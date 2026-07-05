// Interactive header, powered by PreTeXt.
//
// PreTeXt does the hard part: given a container width, it computes the exact multiline
// wrapping for each text block by pure arithmetic — no DOM, no reflow. We turn every glyph
// into a particle: the text assembles from a sparse point cloud on load, and your cursor
// scatters nearby glyphs back into points, which then spring home.

import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

const FONT = "JetBrains Mono";

export type FieldBlock = { text: string; weight: number; size: number; color: string };

type Glyph = {
  ch: string;
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  font: string;
  color: string;
  seed: number;
  reveal: number;
  delay: number;
};

export async function createGlyphField(canvas: HTMLCanvasElement, blocks: FieldBlock[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  try {
    await (document as any).fonts?.ready;
    for (const b of blocks) await (document as any).fonts?.load(`${b.weight} ${b.size}px ${FONT}`);
  } catch {
    /* proceed */
  }

  const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  let dpr = 1;
  let w = 0;
  let totalH = 0;
  let glyphs: Glyph[] = [];
  let startTime = performance.now();
  const cursor = { x: -9999, y: -9999, active: false };

  function build() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(240, rect.width);

    const rows: { text: string; y: number; font: string; color: string }[] = [];
    let y = 6;
    for (const b of blocks) {
      const size = w < 520 ? Math.round(b.size * 0.72) : b.size;
      const lh = Math.round(size * 1.35);
      const font = `${b.weight} ${size}px "${FONT}"`;
      const prep = prepareWithSegments(b.text, font);
      for (const l of layoutWithLines(prep, w, lh).lines) {
        rows.push({ text: l.text, y, font, color: b.color });
        y += lh;
      }
      y += Math.round(size * 0.5);
    }
    totalH = y + 6;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(totalH * dpr);
    canvas.style.height = totalH + "px";
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.textBaseline = "top";

    glyphs = [];
    for (const r of rows) {
      ctx!.font = r.font;
      let x = 0;
      for (const { segment } of seg.segment(r.text)) {
        const cwid = ctx!.measureText(segment).width;
        if (segment.trim() !== "") {
          const seed = Math.random();
          glyphs.push({
            ch: segment,
            hx: x,
            hy: r.y,
            x,
            y: r.y,
            vx: 0,
            vy: 0,
            font: r.font,
            color: r.color,
            seed,
            reveal: 0,
            delay: (r.y / totalH) * 850 + seed * 260,
          });
        }
        x += cwid;
      }
    }
    startTime = performance.now();
  }

  function frame(now: number) {
    if (!canvas.isConnected) return;
    const elapsed = now - startTime;
    ctx!.clearRect(0, 0, w, totalH);

    for (const g of glyphs) {
      const t = Math.max(0, elapsed - g.delay);
      const target = Math.min(1, t / 420);
      g.reveal += (target - g.reveal) * 0.16;

      let fx = (g.hx - g.x) * 0.18;
      let fy = (g.hy - g.y) * 0.18;
      if (cursor.active) {
        const dx = g.x - cursor.x;
        const dy = g.y - cursor.y;
        const d = Math.hypot(dx, dy) || 0.0001;
        if (d < 74) {
          const push = (1 - d / 74) * 3.4;
          fx += (dx / d) * push;
          fy += (dy / d) * push;
        }
      }
      g.vx = (g.vx + fx) * 0.74;
      g.vy = (g.vy + fy) * 0.74;
      g.x += g.vx * 0.25;
      g.y += g.vy * 0.25;

      const disp = Math.hypot(g.x - g.hx, g.y - g.hy);
      const broken = Math.min(1, disp / 26);

      const pAlpha = Math.max(1 - g.reveal, broken) * 0.5;
      if (pAlpha > 0.02) {
        ctx!.globalAlpha = pAlpha;
        ctx!.fillStyle = "#3f8f63";
        ctx!.fillRect(g.x, g.y + 6, 1.8, 1.8);
      }

      const cAlpha = g.reveal * (1 - broken * 0.9);
      if (cAlpha > 0.02) {
        ctx!.globalAlpha = cAlpha;
        ctx!.fillStyle = g.color;
        ctx!.font = g.font;
        ctx!.fillText(g.ch, g.x, g.y);
      }
    }
    ctx!.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  function setCursor(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    cursor.x = e.clientX - rect.left;
    cursor.y = e.clientY - rect.top;
    cursor.active = true;
  }
  canvas.addEventListener("pointerdown", (e) => {
    // Capture the pointer so a touch drag keeps streaming move events to us instead of
    // being re-interpreted as a page scroll — this is what keeps the effect smooth on Android.
    try { canvas.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    setCursor(e);
    if (e.pointerType !== "mouse") e.preventDefault();
  });
  canvas.addEventListener("pointermove", (e) => {
    setCursor(e);
    if (e.pointerType !== "mouse") e.preventDefault();
  });
  const release = () => (cursor.active = false);
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("pointerleave", release);
  canvas.style.touchAction = "none";

  const ro = new ResizeObserver(() => build());
  ro.observe(canvas);
  build();
  requestAnimationFrame(frame);
}
