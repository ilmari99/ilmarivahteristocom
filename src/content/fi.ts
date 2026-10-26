import type { Content } from "./types";

// TARKISTA TÄMÄ / PROOFREAD THIS.
//
// Finnish draft by Claude, translated from en.ts — it needs Ilmari's eye before it goes live.
// Terms deliberately used, because they are what a Finnish recruiter types into Google:
// konenäkö, konenäköinsinööri, koneoppiminen, tekoäly, anturit, 3D-rekonstruktio.
//
// Note: `posts` is intentionally empty — the notes stay in English, and the terminal points
// there instead (ui.blogElsewhere).

export const fi: Content = {
  locale: "fi",

  meta: {
    title: "Ilmari Vahteristo — koneoppimis- ja konenäköinsinööri",
    description:
      "Koneoppimis- ja konenäköinsinööri Helsingissä. Reaaliaikaista havainnointia " +
      "reunalaitteilla kameroiden, LiDARin, tutkan ja laserien avulla, tuotannossa " +
      "teollisuudessa. Julkaisuja optimoinnista ja laskennallisesta kuvantamisesta. DI, LUT.",
    ogTitle: "Ilmari Vahteristo — koneoppimis- ja konenäköinsinööri",
    ogDescription:
      "Havainnointijärjestelmiä oikeaan maailmaan: monikameraseuranta, liikkuvien ajoneuvojen " +
      "3D-rekonstruktio, lasermittaus, CT-rekonstruktio. Helsinki.",
    ogLocale: "fi_FI",
  },

  role: "Koneoppimis- ja konenäköinsinööri",
  tagline: "Opetan koneet näkemään.",
  intro:
    "Rakennan havainnointijärjestelmiä, jotka toimivat oikeassa maailmassa: kamerat, LiDAR, " +
    "tutka ja laserit reunalaitteilla tehtaissa ja raskaassa teollisuudessa.",
  availability: "Avoin konenäön ja soveltavan koneoppimisen työtehtäville · Helsinki",

  sections: {
    experience: {
      heading: "Työkokemus",
      rows: [
        {
          lead: "2025–26",
          title: "Ohjelmistoinsinööri, ML / CV · Virelabs",
          note: "Reaaliaikaista havainnointia raskaalle teollisuudelle, reunalaitteilla.",
          points: [
            "Monikameraseuranta katvealueiden läpi — 5 cm 6 m:n etäisyydeltä",
            "Liikkuvien ajoneuvojen 3D-rekonstruktio — viivakamerat, LiDAR, tutka",
            "Viilun laadunvalvonta lasertriangulaatiolla — 0,5 mm yli 1 m:n etäisyydeltä",
            "OCR teollisuuspakkauksiin enemmistöäänestyksellä — 99,9 %",
          ],
        },
        { lead: "2024", title: "Tutkimusavustaja · LUT-yliopisto", note: "Syväoppimista rajoitetun kulman CT-rekonstruktioon." },
        { lead: "2024–25", title: "Freelance-datatieteilijä", note: "Ravintolan asiakasmäärän ennustaminen ruokalistasta ruokahävikin vähentämiseksi." },
        { lead: "2020–21", title: "Rauhanturvaaja · UNIFIL, Libanon", note: "Ryhmän varajohtaja, sitten ryhmänjohtaja ja partion varajohtaja." },
      ],
    },
    // Paper titles stay in English: that is what they are published as.
    publications: {
      heading: "Julkaisut",
      rows: [
        {
          lead: "2026",
          title: "New spherical codes by tuning an annealing solver",
          note: "Preprint, ainoa kirjoittaja. Uusi paras tunnettu ratkaisu 15 %:lle 29 670 tapauksesta.",
          links: [
            { label: "arXiv", url: "https://arxiv.org/abs/2610.19988" },
            { label: "koodi", url: "https://github.com/ilmari99/tammes_BLASE" },
          ],
        },
        {
          lead: "2025",
          title: "Data-efficient limited-angle CT using deep priors and regularization",
          note: "SCIA (IEEE), ensimmäinen kirjoittaja.",
          links: [{ label: "arXiv", url: "https://arxiv.org/abs/2502.12293" }],
        },
        {
          lead: "2025",
          title: "Stationary LiDAR, moving target: pure LiDAR solution for motion estimation and 3D reconstruction",
          note: "Diplomityö, LUT-yliopisto, yhteistyössä Virelabsin kanssa.",
          links: [{ label: "pdf", url: "https://urn.fi/URN:NBN:fi-fe2025082784786" }],
        },
        {
          lead: "2023",
          title: "Man vs machine: beating humans in a multiplayer card game without lookahead",
          note: "Kandidaatintyö, LUT-yliopisto.",
          links: [{ label: "pdf", url: "https://urn.fi/URN:NBN:fi-fe2023051644576" }],
        },
      ],
    },
    projects: {
      heading: "Projektit",
      rows: [
        {
          lead: "Moska",
          title: "Korttipelin tekoäly, joka voittaa parhaat ihmispelaajat",
          note: "Nyt myös testi siitä, miten kielimallit pelaavat peliä, jota ne eivät ole nähneet.",
          links: [{ label: "moska.eu", url: "https://moska.eu/" }],
        },
        {
          lead: "PolyGate",
          title: "MCP-palvelin LLM-agenteille ennustemarkkinoilla",
          links: [{ label: "github", url: "https://github.com/ilmari99/polygate" }],
        },
      ],
    },
    competitions: {
      heading: "Kilpailut",
      rows: [
        { lead: "2025", title: "Junction — ElevenLabsin haasteen voitto", links: [{ label: "demo", url: "https://youtu.be/WhviYsdgZNE" }] },
        { lead: "2024", title: "Junction — vertaisarvioinnin parhaat 5 %", links: [{ label: "demo", url: "https://www.youtube.com/watch?v=jerwB3SQ5Ok" }] },
        { lead: "2024", title: "Kaggle LLM 20 Questions — 7. / 800" },
        { lead: "2023", title: "Visman koodauskilpailu — 1. / 20 joukkuetta" },
        { lead: "2022", title: "IndySCC-supertietokonekilpailu — 3. / 10 yliopistoa" },
      ],
    },
    education: {
      heading: "Koulutus",
      rows: [
        { lead: "2025", title: "DI, konenäkö ja hahmontunnistus · LUT-yliopisto", note: "Keskiarvo 4,2 / 5. Vaihto IST Lissabonissa." },
        { lead: "nyt", title: "Maisteri, robotiikka ja automaatio · Aalto-yliopisto" },
      ],
    },
    skills: {
      heading: "Osaaminen",
      rows: [
        { lead: "Anturit", title: "Kamerat · LiDAR · tutka · lasertriangulaatio · IMU" },
        { lead: "Menetelmät", title: "Syväoppiminen · 3D-näkö · seuranta · anturifuusio · optimointi" },
        { lead: "Työkalut", title: "Python · C · Docker · Git · Linux · reunalaskenta · PLC" },
      ],
    },
  },

  whoami: [
    { lead: "nimi", title: "Ilmari Vahteristo" },
    { lead: "rooli", title: "Koneoppimis- ja konenäköinsinööri" },
    { lead: "rakentaa", title: "Havainnointia reunalaitteilla — kamerat, LiDAR, tutka, laserit" },
    { lead: "tutkinto", title: "DI, LUT · nyt maisteri robotiikasta, Aalto" },
    { lead: "sijainti", title: "Helsinki" },
    { lead: "tilanne", title: "Avoin konenäön ja soveltavan koneoppimisen työtehtäville" },
  ],

  why:
    "Uskon, että runsaan digitaalisen älyn aikakausi on alkamassa, ja kiinnostava ongelma on " +
    "muuntaa se taloudellisesti hyödylliseksi työksi: havainnoida todellista maailmaa antureilla, " +
    "muodostaa siitä digitaalinen esitys ja antaa ohjelmistojen ja laitteiden tehdä sillä jotain " +
    "arvokasta.",

  irl: [
    "Jääkiekkoa, satunnainen jalkapallopeli ja suunnistusta.",
    "Pokeri-iltoja, aikaa ystävien kanssa ja tapahtumien järjestämistä heille.",
    "Äänikirjoja pitkillä automatkoilla, ja mikä tahansa syy päästä ulos.",
  ],

  // Intentionally empty — see the file header.
  posts: [],

  ui: {
    contact: "Yhteystiedot",
    emailMe: "lähetä sähköpostia",
    cv: "CV (PDF)",
    switchLabel: "In English",

    termAria: "Interaktiivinen terminaali",
    chipsAria: "komentoehdotukset",
    noteAria: "Muistiinpano",
    sayHi: "moikkaa",
    backToTerminal: "takaisin terminaaliin",
    more: "lisää: ",
    blogHeader: "# Ground Truth — puolivalmiita ajatuksia, teroitettuna julkisesti",
    tapNote: "avaa muistiinpano napauttamalla.",
    blogElsewhere: "Muistiinpanot ovat englanniksi — lue ne englanninkieliseltä sivulta.",
    commandNotFound: "komentoa ei löydy: ",
    noSuchNote: "muistiinpanoa ei löydy: ",
    tryCmd: "  — kokeile ",
    sudo: {
      before: "Hyvä yritys. Jos haluat korottaa oikeuksiani, ",
      link: "kysy vain",
      after: ".",
    },
    boot: [
      "// Koneoppimis- ja konenäköinsinööri. Helsinki.",
      "// Napauta komentoa tai vieritä alas.",
    ],
    helpDesc: {
      whoami: "kuka olen, lyhyesti",
      experience: "roolit ja tulokset",
      publications: "artikkelit ja opinnäytteet",
      projects: "omat projektit",
      competitions: "kilpailut",
      education: "tutkinnot",
      skills: "anturit, menetelmät, työkalut",
      cv: "lataa CV",
      contact: "miten tavoitat minut",
      clear: "tyhjennä ruutu",
      why: "mihin uskon",
      irl: "elämä ruudun ulkopuolella",
      blog: "muistiinpanot — Ground Truth",
    },
  },

  schema: {
    knowsAbout: [
      "Konenäkö", "Koneoppiminen", "Syväoppiminen", "3D-rekonstruktio", "Kohteiden seuranta",
      "LiDAR", "Tutka", "Lasertriangulaatio", "Anturifuusio", "Reunalaskenta",
      "Numeerinen optimointi", "Tietokonetomografia", "Python", "C",
    ],
    locality: "Helsinki",
  },
};
