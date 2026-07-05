// PreTeXt-driven terminal output — with draggable, breakable text.
//
// PreTeXt lays out every command's output: its rich-inline engine returns the exact wrapped
// lines (mixed weights + links) by pure arithmetic, no DOM. From that layout we know the home
// position of every single glyph. We then hang a tiny Verlet physics sim on those homes:
//
//   • each glyph is a node pulled toward its PreTeXt home (rubber band),
//   • neighbours on a line are joined by distance links,
//   • grab a letter and drag — the line stretches elastically and the neighbours follow,
//   • yank past a threshold and the link SNAPS where you pulled; the torn ends then droop
//     under gravity, hanging slightly.
//
// Resizing re-typesets the whole scrollback (PreTeXt again). A hidden DOM mirror carries the
// text + real <a> tags for screen readers, SEO and copy-paste. Short taps still open links.

import {
  prepareRichInline,
  layoutNextRichInlineLineRange,
  materializeRichInlineLineRange,
} from "@chenglou/pretext/rich-inline";

const FONT = "JetBrains Mono";
const SIZE = 14;
const LH = 22;
const PAD_TOP = 2;
const DEFAULT = "#e7e7e9";

// physics — a rubber band of letters that snaps and lets the torn ends hang
const DAMP = 0.86;
const ITER = 4;
const LINK_STIFF = 0.5;       // rigidity of the band between neighbouring letters
const BREAK_DIST = 156;       // drag a letter this far from its home and the line snaps there
const HOMEK_INTACT = 0.22;    // snap-back stiffness of untouched text
const HOMEK_LOOSE = 0.02;     // torn ends barely resist — they hang
const GRAV = 0.16;            // only applied to loosened glyphs, scaled by how loose they are
const LOOSE_WINDOW = 7;       // letters on each side of a break that go loose, with falloff

export type Run = { text: string; color?: string; href?: string; cmd?: string; weight?: number };
export type Paragraph = Run[];
export type Output = Paragraph[];

type Glyph = {
  ch: string;
  hx: number; hy: number; // PreTeXt home
  x: number; y: number;
  px: number; py: number; // previous (verlet)
  w: number;
  color: string; font: string; run: Run;
  idx: number;   // reveal order
  loose: number; // 0 = intact/anchored, 1 = fully torn → hangs under gravity
};
type Link = { a: number; b: number; rest: number; broken: boolean };
type Line = { glyphs: Glyph[]; links: Link[] };

type Prepared = { blank: boolean; prep?: ReturnType<typeof prepareRichInline>; runs: Run[] };

type Block = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  paragraphs: Prepared[];
  lines: Line[];
  total: number;
  reveal: number;
  done: boolean;
  height: number;
  active: boolean; // needs simulating/redrawing
};

const fontFor = (r: Run) => `${r.weight ?? 500} ${SIZE}px "${FONT}"`;

type Drag = { block: Block; g: Glyph; line: Line; gi: number; broke: boolean; ox: number; oy: number; tx: number; ty: number; moved: boolean };

export class Terminal {
  private blocks: Block[] = [];
  private running = false;
  private ctxMeasure = document.createElement("canvas").getContext("2d")!;
  private seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  private ready = false;
  private pending: { out: Output; opts: { instant?: boolean } }[] = [];
  private drag: Drag | null = null;
  private lastWidth = -1;

  constructor(
    private screen: HTMLElement,
    private onCommand: (cmd: string) => void
  ) {
    const ro = new ResizeObserver(() => this.relayoutAll());
    ro.observe(screen);
    screen.addEventListener("pointerdown", (e) => this.onDown(e));
    screen.addEventListener("pointermove", (e) => this.onMove(e));
    window.addEventListener("pointerup", () => this.onUp());
    // If the browser ever steals the gesture, drop the drag so text can't freeze mid-pull.
    window.addEventListener("pointercancel", () => this.onCancel());

    const fonts: any = (document as any).fonts;
    const flush = () => {
      this.ready = true;
      const q = this.pending;
      this.pending = [];
      for (const it of q) this._print(it.out, it.opts);
    };
    if (fonts?.ready) {
      fonts.ready
        .then(() => Promise.all([fonts.load(`500 ${SIZE}px "${FONT}"`), fonts.load(`700 ${SIZE}px "${FONT}"`)]))
        .then(flush)
        .catch(flush);
    } else {
      flush();
    }
  }

  clear() {
    this.pending = [];
    this.blocks = [];
    this.drag = null;
    this.screen.innerHTML = "";
  }

  print(out: Output, opts: { instant?: boolean } = {}) {
    if (!this.ready) {
      this.pending.push({ out, opts });
      return;
    }
    this._print(out, opts);
  }

  private _print(out: Output, opts: { instant?: boolean } = {}) {
    const wrap = document.createElement("div");
    wrap.className = "oblock";
    const canvas = document.createElement("canvas");
    canvas.className = "ocanvas";
    wrap.appendChild(canvas);

    const sr = document.createElement("div");
    sr.className = "sr";
    for (const p of out) {
      const line = document.createElement("div");
      for (const r of p) {
        if (r.href) {
          const a = document.createElement("a");
          a.href = r.href;
          a.textContent = r.text;
          line.appendChild(a);
        } else line.appendChild(document.createTextNode(r.text));
      }
      sr.appendChild(line);
    }
    wrap.appendChild(sr);
    this.screen.appendChild(wrap);

    const ctx = canvas.getContext("2d")!;
    const paragraphs: Prepared[] = out.map((p) => {
      const runs = p.filter((r) => r.text.length > 0);
      return runs.length === 0
        ? { blank: true, runs: [] }
        : { blank: false, runs, prep: prepareRichInline(runs.map((r) => ({ text: r.text, font: fontFor(r) }))) };
    });

    const block: Block = {
      canvas, ctx, paragraphs, lines: [], total: 0, reveal: 0, done: !!opts.instant, height: 0, active: true,
    };
    this.blocks.push(block);
    this.layout(block);
    block.reveal = opts.instant ? block.total : 0;
    this.draw(block);
    this.scrollToBottom();
    this.ensureLoop();
  }

  private layout(block: Block) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(200, block.canvas.clientWidth - 2);
    const lines: Line[] = [];
    let y = PAD_TOP;
    let idx = 0;

    for (const p of block.paragraphs) {
      if (p.blank || !p.prep) {
        y += LH;
        continue;
      }
      let start: any = undefined;
      let guard = 0;
      while (guard++ < 2000) {
        const range = layoutNextRichInlineLineRange(p.prep, w, start);
        if (range === null) break;
        const mline = materializeRichInlineLineRange(p.prep, range);
        const glyphs: Glyph[] = [];
        let x = 0;
        for (const f of mline.fragments) {
          const run = p.runs[f.itemIndex];
          const font = fontFor(run);
          this.ctxMeasure.font = font;
          x += f.gapBefore;
          for (const s of this.seg.segment(f.text)) {
            const ch = s.segment;
            const gw = this.ctxMeasure.measureText(ch).width;
            if (ch.trim() !== "") {
              glyphs.push({
                ch, hx: x, hy: y, x, y, px: x, py: y, w: gw,
                color: run.color ?? DEFAULT, font, run, idx: idx++, loose: 0,
              });
            }
            x += gw;
          }
        }
        const links: Link[] = [];
        for (let i = 0; i < glyphs.length - 1; i++) {
          links.push({ a: i, b: i + 1, rest: glyphs[i + 1].hx - glyphs[i].hx, broken: false });
        }
        lines.push({ glyphs, links });
        start = range.end;
        y += LH;
      }
    }

    block.lines = lines;
    block.total = idx;
    block.height = y + 4;
    block.canvas.width = Math.round(w * dpr);
    block.canvas.height = Math.round(block.height * dpr);
    block.canvas.style.height = block.height + "px";
    block.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    block.ctx.textBaseline = "top";
  }

  private simulate(block: Block) {
    const drag = this.drag && this.drag.block === block ? this.drag : null;

    // Snap where the letter is pulled: once the grabbed glyph is dragged far enough from its
    // home, break the more-stretched of its two neighbour links. Both sides then hang.
    if (drag && !drag.broke) {
      const dd = Math.hypot(drag.g.x - drag.g.hx, drag.g.y - drag.g.hy);
      if (dd > BREAK_DIST) {
        let target: Link | null = null;
        let best = -1;
        for (const lk of [drag.line.links[drag.gi - 1], drag.line.links[drag.gi]]) {
          if (!lk || lk.broken) continue;
          const a = drag.line.glyphs[lk.a];
          const b = drag.line.glyphs[lk.b];
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          if (len > best) { best = len; target = lk; }
        }
        if (target) {
          target.broken = true;
          this.loosen(drag.line, target.a, target.b);
        }
        drag.broke = true;
        block.active = true;
      }
    }

    // integrate (Verlet). Gravity only pulls glyphs that have been torn loose, so intact
    // text stays perfectly straight.
    for (const line of block.lines) {
      for (const g of line.glyphs) {
        if (drag && drag.g === g) {
          g.x = drag.tx; g.y = drag.ty; g.px = g.x; g.py = g.y;
          continue;
        }
        const vx = (g.x - g.px) * DAMP;
        const vy = (g.y - g.py) * DAMP;
        g.px = g.x; g.py = g.y;
        g.x += vx;
        g.y += vy + GRAV * g.loose;
      }
    }

    // rubber-band links between neighbours
    for (let it = 0; it < ITER; it++) {
      for (const line of block.lines) {
        for (const lk of line.links) {
          if (lk.broken) continue;
          const a = line.glyphs[lk.a];
          const b = line.glyphs[lk.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          const diff = ((d - lk.rest) / d) * LINK_STIFF;
          const ox = dx * diff;
          const oy = dy * diff;
          const aDrag = drag && drag.g === a;
          const bDrag = drag && drag.g === b;
          if (aDrag && !bDrag) { b.x -= ox * 2; b.y -= oy * 2; }
          else if (bDrag && !aDrag) { a.x += ox * 2; a.y += oy * 2; }
          else { a.x += ox; a.y += oy; b.x -= ox; b.y -= oy; }
        }
      }
    }

    // home spring — strong for intact text (holds it in place); torn ends recoil back to their
    // column horizontally but barely resist vertically, so they hang.
    for (const line of block.lines) {
      for (const g of line.glyphs) {
        if (drag && drag.g === g) continue;
        const kx = HOMEK_INTACT * (1 - 0.55 * g.loose);
        const ky = HOMEK_INTACT + (HOMEK_LOOSE - HOMEK_INTACT) * g.loose;
        g.x += (g.hx - g.x) * kx;
        g.y += (g.hy - g.y) * ky;
      }
    }

    // settle detection
    let energy = 0;
    for (const line of block.lines) for (const g of line.glyphs) energy += (g.x - g.px) ** 2 + (g.y - g.py) ** 2;
    if (!drag && block.done && energy < 0.02) block.active = false;
  }

  // A snapped link loosens a run of letters on each side, fading out with distance, so the torn
  // ends hang in a smooth decaying curve instead of a single letter dropping.
  private loosen(line: Line, ai: number, bi: number) {
    for (let k = 0; k < LOOSE_WINDOW; k++) {
      const amount = 1 - k / LOOSE_WINDOW;
      const l = line.glyphs[ai - k]; if (l) l.loose = Math.max(l.loose, amount);
      const r = line.glyphs[bi + k]; if (r) r.loose = Math.max(r.loose, amount);
    }
  }

  private draw(block: Block) {
    const ctx = block.ctx;
    ctx.clearRect(0, 0, block.canvas.width, block.canvas.height);
    let cx = 0, cy = 0, drewCursor = false;
    for (const line of block.lines) {
      for (const g of line.glyphs) {
        if (g.idx >= block.reveal) {
          if (!drewCursor) { cx = g.hx; cy = g.hy; drewCursor = true; }
          continue;
        }
        ctx.font = g.font;
        ctx.fillStyle = g.color;
        ctx.fillText(g.ch, g.x, g.y);
        if (g.run.href || g.run.cmd) {
          ctx.strokeStyle = g.color;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.moveTo(g.x, g.y + SIZE + 3);
          ctx.lineTo(g.x + g.w, g.y + SIZE + 3);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        cx = g.x + g.w; cy = g.y;
      }
    }
    if (!block.done) {
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(cx + 1, cy, 7, SIZE + 2);
    }
  }

  private ensureLoop() {
    if (this.running) return;
    this.running = true;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      let any = false;
      for (const b of this.blocks) {
        if (!b.done) {
          const rate = Math.max(340, b.total / 0.9) / 1000;
          b.reveal = Math.min(b.total, b.reveal + dt * rate);
          if (b.reveal >= b.total) b.done = true;
          b.active = true;
        }
        if (b.active) {
          this.simulate(b);
          this.draw(b);
          any = true;
        }
      }
      if (any) requestAnimationFrame(tick);
      else this.running = false;
    };
    requestAnimationFrame(tick);
  }

  private relayoutAll() {
    // Only re-typeset on a genuine width change. Spurious ResizeObserver fires (e.g. a
    // scrollbar toggling, or a new prompt growing the content) must NOT rebuild blocks, or
    // they'd wipe any letters the visitor has dragged and snapped.
    const w = this.screen.clientWidth;
    if (Math.abs(w - this.lastWidth) < 1) return;
    this.lastWidth = w;
    for (const b of this.blocks) {
      this.layout(b);
      b.active = true;
    }
    this.ensureLoop();
  }

  // ---- pointer / drag ----
  private localFor(canvas: HTMLCanvasElement, e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  private blockForCanvas(target: EventTarget | null): Block | null {
    if (!(target instanceof HTMLCanvasElement)) return null;
    return this.blocks.find((b) => b.canvas === target) ?? null;
  }
  private glyphAt(block: Block, x: number, y: number): Glyph | null {
    let best: Glyph | null = null;
    let bestD = 20;
    for (const line of block.lines) {
      for (const g of line.glyphs) {
        if (g.idx >= block.reveal) continue;
        if (x >= g.x - 1 && x <= g.x + g.w + 1 && y >= g.y - 3 && y <= g.y + LH - 3) return g;
        const d = Math.hypot(x - (g.x + g.w / 2), y - (g.y + SIZE / 2));
        if (d < bestD) { bestD = d; best = g; }
      }
    }
    return best;
  }

  private onDown(e: PointerEvent) {
    const block = this.blockForCanvas(e.target);
    if (!block) return;
    const p = this.localFor(block.canvas, e);
    const g = this.glyphAt(block, p.x, p.y);
    if (!g) return;
    let line: Line | null = null;
    let gi = -1;
    for (const ln of block.lines) {
      const i = ln.glyphs.indexOf(g);
      if (i >= 0) { line = ln; gi = i; break; }
    }
    if (!line) return;
    this.drag = { block, g, line, gi, broke: false, ox: p.x - g.x, oy: p.y - g.y, tx: g.x, ty: g.y, moved: false };
    block.active = true;
    block.canvas.style.cursor = "grabbing";
    this.ensureLoop();
  }

  private onMove(e: PointerEvent) {
    if (this.drag) {
      const p = this.localFor(this.drag.block.canvas, e);
      this.drag.tx = p.x - this.drag.ox;
      this.drag.ty = p.y - this.drag.oy;
      if (Math.hypot(this.drag.tx - this.drag.g.hx, this.drag.ty - this.drag.g.hy) > 4) this.drag.moved = true;
      return;
    }
    const block = this.blockForCanvas(e.target);
    if (!block) return;
    const p = this.localFor(block.canvas, e);
    const g = this.glyphAt(block, p.x, p.y);
    block.canvas.style.cursor = g ? "grab" : "default";
  }

  private onUp() {
    if (!this.drag) return;
    const { block, g, moved } = this.drag;
    block.canvas.style.cursor = "grab";
    this.drag = null;
    if (!moved && (g.run.href || g.run.cmd)) {
      if (g.run.cmd) this.onCommand(g.run.cmd);
      else if (g.run.href!.startsWith("mailto:")) window.location.href = g.run.href!;
      else window.open(g.run.href!, "_blank", "noopener");
    } else {
      block.active = true;
      this.ensureLoop();
    }
  }

  // Gesture stolen by the browser (e.g. a scroll took over): release the drag without treating
  // it as a click, and let the letters spring back instead of freezing where they were.
  private onCancel() {
    if (!this.drag) return;
    const { block } = this.drag;
    block.canvas.style.cursor = "grab";
    this.drag = null;
    block.active = true;
    this.ensureLoop();
  }

  private scrollToBottom() {
    this.screen.scrollTop = this.screen.scrollHeight;
  }
}
