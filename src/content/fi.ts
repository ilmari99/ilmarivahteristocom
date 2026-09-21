import type { Content } from "./types";

// TARKISTA TÄMÄ / PROOFREAD THIS.
//
// Finnish draft by Claude — Ilmari's own sales copy, so it needs his eye before it goes live.
// Terms deliberately used, because they are what a Finnish plant manager types into Google:
// konenäkö, konenäkökonsultti (and the spaced "konenäkö konsultti" people actually search),
// koneoppiminen, tekoäly, laadunvalvonta, automaatio, mittaus, anturit.
//
// Note: `posts` is intentionally empty — the notes stay in English, and the terminal points
// there instead (ui.blogElsewhere). See src/seo.ts, which drops the section when empty.

export const fi: Content = {
  locale: "fi",

  meta: {
    title: "Ilmari Vahteristo — konenäkökonsultti, Helsinki",
    description:
      "Autan suomalaisia yrityksiä ja valmistavaa teollisuutta hyödyntämään konenäköä, " +
      "antureita ja koneoppimista tuotannossa, automaatiossa ja päätöksenteossa. " +
      "Helsinki, tapaamiset Uudellamaalla. Maksuton tunnin konsultaatio.",
    ogTitle: "Ilmari Vahteristo — konenäkö ja anturijärjestelmät teollisuudelle",
    ogDescription:
      "Konenäkö- ja tekoälykonsultti Helsingissä. Kamerat, LiDAR, tutka ja laserit oikeassa " +
      "tuotannossa. Maksuton tunnin konsultaatio — tuo ongelma, saat rehellisen vastauksen.",
    ogLocale: "fi_FI",
  },

  headline: "konenäkö ja anturijärjestelmät teollisuudelle",
  role: "Konenäkö- ja tekoälykonsultti",
  tagline: "Opetan koneet näkemään.",

  intro: [
    "Autan suomalaisia yrityksiä ja valmistavaa teollisuutta — kokoon katsomatta — hyödyntämään",
    "kameroita, antureita ja koneoppimista tuotannossa, automaatiossa, päätöksenteossa ja",
    "tiedonkeruussa. Toimin Helsingistä käsin ja tapaan mieluiten paikan päällä Uudellamaalla.",
    "Työkielinä suomi ja englanti.",
  ],

  consult: {
    heading: "Maksuton tunnin konsultaatio",
    body: [
      "Tuo mukanasi ongelma tai idea. Käymme läpi, miten se olisi ratkaistavissa tekoälyn,",
      "koneoppimisen ja konenäön keinoin, mitä se vaatisi datalta ja laitteistolta, ja mikä",
      "tarkkuus sekä mitkä kompromissit ovat realistisia.",
      "",
      "Maksuton eikä sido mihinkään — tapaan mieluiten paikan päällä Uudellamaalla. Jos päätät,",
      "että ongelma kannattaa ratkaista, voin auttaa ratkaisemaan sen tai auttaa löytämään",
      "jonkun muun, joka pystyy siihen.",
      "",
      "Jos uskot ongelman olevan yhteinen koko toimialalle tai siinä piilevän skaalautuvaa",
      "liiketoimintaa, kiinnostun vain enemmän.",
    ],
    heroCta: "Mitä maksuton tunti sisältää",
  },

  work: [
    {
      title: "Monikameraseuranta katvealueiden läpi",
      tag: "teollisuus",
      body:
        "Reaaliaikainen kohteiden tunnistus ja seuranta monikamerajärjestelmässä, jossa kohteet " +
        "katoavat toistuvasti esteiden taakse ja ne on tunnistettava uudelleen niiden tullessa " +
        "taas näkyviin. 3 cm tarkkuus 6 metrin etäisyydeltä, reunalaitteistolla tuotantotiloissa.",
    },
    {
      title: "Liikkuvien ajoneuvojen 3D-rekonstruktio",
      tag: "teollisuus",
      body:
        "Jäykkä, liikekompensoitu 3D-rekonstruktio rekoista niiden ajaessa ohi — huomioiden " +
        "ajoneuvon oman kiertymisen ja kiihtyvyyden — LiDARin ja tutkan avulla. Noin 4 cm " +
        "tarkkuus tuotannossa.",
      label: "diplomityö",
      url: "https://lutpub.lut.fi/handle/10024/170362",
    },
    {
      title: "Tietokonetomografiakuvien rekonstruktio röntgendatasta",
      tag: "akateeminen",
      body:
        "Datatehokas rajoitetun kulman tietokonetomografia: käyttökelpoisia rekonstruktioita " +
        "huomattavasti pienemmällä määrällä röntgenprojektioita kuin tavallinen kuvaus vaatii. " +
        "Ensimmäisenä kirjoittajana SCIA-konferenssissa (IEEE).",
      label: "arXiv",
      url: "https://arxiv.org/abs/2502.12293",
    },
    {
      title: "Kilpailut ja hackathonit",
      body:
        "Junction 2025 — voitto ElevenLabsin ääni-AI-haasteessa. Kaggle LLM 20 Questions — " +
        "7. sija 800:sta. IndySCC-supertietokonekilpailu — 3. sija kymmenestä yliopistosta " +
        "maailmanlaajuisesti. Google Foobar — yhdeksän tehtävää, mikä johti Googlen haastatteluun.",
    },
  ],

  alsoShipped: [
    "Lankun paksuuden ja pituuden mittaus lasertriangulaatiolla — alle 0,5 mm tarkkuus.",
    "OCR heikkolaatuisille pakkausmerkinnöille enemmistöäänestyksellä — yli 99,5 % tarkkuus.",
  ],

  projects: [
    { line: "PolyGate — MCP-palvelin, jonka avulla LLM-agentit tutkivat ennustemarkkinoita ja käyvät niillä kauppaa.", label: "github", url: "https://github.com/ilmari99/polygate" },
    { line: "BLASE — globaali optimoija pallokoodeille; paransi 1 550 tunnettua ennätystä (20,7 %).", label: "github", url: "https://github.com/ilmari99/tammes_BLASE" },
    { line: "Moska — vahvistusoppimisagentti, joka voittaa parhaat ihmispelaajat suomalaisessa korttipelissä.", label: "opinnäyte", url: "https://urn.fi/URN:NBN:fi-fe2023051644576" },
  ],

  capabilities: [
    { label: "Anturit", items: "LiDAR · tutka · lasertriangulaatio · kamerat · IMU · ääni" },
    { label: "Menetelmät", items: "Syväoppiminen · konenäkö · optimointi · monianturijärjestelmät · tekoäly- ja LLM-työkalut" },
    { label: "Järjestelmät", items: "Reunalaskenta · reaaliaikainen päättely · PLC · Python · C · Docker · Git · Linux" },
  ],

  why: [
    "Uskon, että runsaan digitaalisen älyn aikakausi on alkamassa, ja kiinnostava ongelma on",
    "muuntaa se taloudellisesti hyödylliseksi työksi: havainnoida todellista maailmaa antureilla,",
    "muodostaa siitä digitaalinen esitys ja antaa ohjelmistojen ja laitteiden tehdä sillä jotain",
    "arvokasta. Vain asiakas tietää, mikä on hänelle arvokasta — siksi aloitan kuuntelemalla",
    "enkä ehdottamalla mallia.",
  ],

  whoami: [
    "Hei — olen Ilmari, konenäkö- ja tekoälykonsultti Helsingissä.",
    "Rakennan havainnointijärjestelmiä teollisuudelle: kamerat, LiDAR, tutka ja laserit,",
    "reaaliajassa tuotantotiloissa. Diplomi-insinööri laskennallisesta matematiikasta;",
    "toinen maisterintutkinto robotiikasta kesken Aallossa.",
    "Yrittäjähenkinen, ja otan parhaillaan vastaan toimeksiantoja.",
  ],

  now: [
    "→ Konsultoin konenäössä ja anturijärjestelmissä suomalaiselle valmistavalle teollisuudelle.",
    "→ Tarjoan maksuttomia tunnin tapaamisia Uudellamaalla — tuo ongelma tai idea.",
    "→ Viimeistelen robotiikan maisterintutkintoa Aallossa.",
  ],

  irl: [
    "Ruudun ulkopuolella:",
    "• Jääkiekkoa, satunnainen jalkapallopeli ja suunnistusta.",
    "• Pokeri-iltoja ja aikaa ystävien kanssa.",
    "• Äänikirjoja pitkillä automatkoilla, ja mikä tahansa syy päästä ulos.",
    "• Järjestän mielelläni tapahtumia ystäville.",
    "• Sotilasjohtamiskokemusta rauhanturvaoperaatiosta Etelä-Libanonissa.",
  ],

  // Intentionally empty — see the file header.
  posts: [],

  ui: {
    sections: {
      work: "Työt",
      capabilities: "Anturit ja menetelmät",
      why: "Miksi",
      writing: "Ground Truth — muistiinpanot",
      contact: "Yhteystiedot",
    },
    alsoInProduction: "Myös tuotannossa:",
    sideProjects: "Omat projektit",
    messageOnLinkedIn: "viesti LinkedInissä",
    switchLabel: "In English",

    termAria: "Interaktiivinen terminaali",
    chipsAria: "komentoehdotukset",
    noteAria: "Muistiinpano",
    sayHi: "moikkaa",
    backToTerminal: "takaisin terminaaliin",
    bestWayEmail: "Parhaiten tavoitat minut sähköpostilla:",
    blogHeader: "# Ground Truth — puolivalmiita ajatuksia, teroitettuna julkisesti",
    tapNote: "avaa muistiinpano napauttamalla.",
    blogElsewhere: "Muistiinpanot ovat englanniksi — lue ne englanninkieliseltä sivulta.",
    commandNotFound: "komentoa ei löydy: ",
    noSuchNote: "muistiinpanoa ei löydy: ",
    tryCmd: "  — kokeile ",
    cv: { before: "ansioluettelo löytyy toistaiseksi ", link: "LinkedInistä", after: "." },
    sudo: {
      before: "Hyvä yritys. Jos haluat korottaa oikeuksiani, ",
      link: "kysy vain",
      after: ".",
    },
    boot: [
      "// Konenäkö ja anturijärjestelmät teollisuudelle. Helsinki.",
      "// Napauta komentoa tai vieritä alas — kaikki on kirjoitettu auki alle.",
    ],
    helpDesc: {
      whoami: "kuka olen, lyhyesti",
      consult: "maksuton tunnin tapaaminen",
      work: "mitä olen rakentanut",
      sensors: "anturit, menetelmät, järjestelmät",
      now: "mitä teen juuri nyt",
      why: "mihin oikeasti uskon",
      irl: "elämä ruudun ulkopuolella",
      blog: "muistiinpanot — Ground Truth",
      contact: "miten tavoitat minut",
      clear: "tyhjennä ruutu",
    },
  },

  schema: {
    knowsAbout: [
      "Konenäkö", "Koneoppiminen", "Tekoäly", "LiDAR", "Tutka", "Lasertriangulaatio",
      "Anturifuusio", "Reunalaskenta", "Teollisuusautomaatio", "Python", "C",
    ],
    areaServed: "Uusimaa, Suomi",
    locality: "Helsinki",
  },
};
