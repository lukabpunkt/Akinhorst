// Zentrale Inhaltsdatei: Texte, Preise, Kontaktdaten und Orte.
// Alles mit TODO(INHABER) muss noch vom Kunden bestätigt werden (siehe TODO.md).

export type Package = {
  id: "selbstaufbau" | "rundum-sorglos" | "event-design";
  name: string;
  price: number | null; // null = „auf Anfrage“
  tagline: string;
  features: string[];
  featured?: boolean;
  badge?: string;
};

export const site = {
  name: "Bakin & Horst Event Design GbR",
  shortName: "Bakin & Horst",
  url: "https://bakin-event.de",
  owners: ["Witali Bakin", "Michelle Bakin"], // TODO(INHABER): vollständig? Woher kommt „Horst“?
  signature: "Witali & Michelle Bakin", // TODO(INHABER): Freigabe
  founded: 2026,
  phone: { display: "0155 10626727", href: "tel:+4915510626727", intl: "+49 155 10626727" },
  whatsapp: "https://wa.me/4915510626727", // TODO(INHABER): auf WhatsApp erreichbar?
  email: "w.bakin@bakin-event.de",
  address: { street: "Hackelbarg 9", zip: "32369", city: "Rahden", country: "DE" },
  instagram: "https://www.instagram.com/bakin_horst_event_design/",
  instagramHandle: "@bakin_horst_event_design",
  responseTime: "innerhalb von 24 Stunden", // TODO(INHABER): Reaktionszeit ok?

  tent: { size: "5 × 10 m", area: 50, standing: 100, seatsRows: 71, seatsBenches: 64, benchSets: 8 },

  // TODO(INHABER): Preise, Mietdauer und Leistungsumfang bestätigen
  packages: [
    {
      id: "selbstaufbau",
      name: "Selbstaufbau",
      price: 250, // TODO(INHABER): Mietdauer?
      tagline: "Ihr holt ab, baut auf und feiert.",
      features: ["Zelt 5 × 10 m", "Seitenwände mit Fenstern", "Einweisung", "Abholung in Rahden"],
    },
    {
      id: "rundum-sorglos",
      name: "Rundum-Sorglos",
      price: 450, // TODO(INHABER): Liefer-Radius / km-Pauschale?
      tagline: "Wir liefern, bauen auf und wieder ab.",
      features: ["Alles aus Selbstaufbau", "Lieferung", "Auf- & Abbau durch uns", "Persönlicher Ansprechpartner"],
      featured: true,
      badge: "Beliebt", // TODO(INHABER): ok?
    },
    {
      id: "event-design",
      name: "Event Design",
      price: null, // TODO(INHABER): Umfang klären
      tagline: "Tafel, Deko & Atmosphäre aus einer Hand.",
      features: ["Dekorationskonzept", "Tischdeko & Blumen", "Lichterketten", "Traubogen"],
    },
  ] satisfies Package[],
  packagesNote: "Kaution, Mietdauer und Lieferkosten besprechen wir gern persönlich.", // TODO(INHABER): echte Konditionen

  occasions: ["Hochzeit", "Geburtstag", "Firmenfeier", "Vereinsfest", "Gartenparty", "Taufe & Jubiläum"],

  // TODO(INHABER): Liste bestätigen, welches „Lohne“ ist gemeint?
  areas: ["Rahden", "Espelkamp", "Stemwede", "Diepenau", "Rehden", "Wagenfeld", "Lohne", "Preußisch Oldendorf"],

  steps: [
    { title: "Anfragen", text: "Wunschtermin, Ort und Gästezahl über das Formular senden." },
    { title: "Bestätigen", text: "Wir melden uns persönlich und reservieren euren Termin." },
    { title: "Liefern & Aufbauen", text: "Abholung oder Lieferung, auf Wunsch mit Aufbau." },
    { title: "Feiern", text: "Ihr genießt euren Tag." },
    { title: "Abbau", text: "Wir holen das Zelt wieder ab – oder ihr bringt es zurück." },
  ],

  // TODO(INHABER): alle Antworten prüfen und durch echte Konditionen ersetzen
  faq: [
    {
      q: "Wie lange kann ich das Zelt mieten?",
      a: "Die Mietdauer stimmen wir gemeinsam mit euch auf euer Fest ab – sprecht uns einfach an.",
    },
    {
      q: "Welcher Untergrund ist nötig?",
      a: "Ideal ist eine ebene Rasen- oder Pflasterfläche von etwa 7 × 12 m inklusive Platz für die Abspannung. Bei besonderen Flächen beraten wir euch gern vorab.",
    },
    {
      q: "Was passiert bei Sturm oder Unwetter?",
      a: "Die Seitenwände schützen zuverlässig vor Wind und Regen. Bei Sturm oder Unwetterwarnung muss das Zelt aus Sicherheitsgründen geräumt werden. Die Details klären wir gemeinsam vor eurem Fest.",
    },
    {
      q: "Gibt es eine Kaution?",
      a: "Ob und in welcher Höhe eine Kaution anfällt, besprechen wir persönlich bei der Reservierung.",
    },
    {
      q: "Sind Tische, Bänke oder Beleuchtung dabei?",
      a: "Das Zelt wird mit Seitenwänden vermietet. Ob und welche weitere Ausstattung möglich ist, besprechen wir gern persönlich mit euch.",
    },
    {
      q: "Wie weit liefert ihr?",
      a: "Wir liefern in Rahden, Lohne und Umgebung. Ihr feiert weiter weg? Fragt einfach an – wir finden eine Lösung.",
    },
    {
      q: "Wie früh sollte ich reservieren?",
      a: "Gerade in der Hochzeitssaison von Mai bis September empfehlen wir eine frühe Anfrage.",
    },
  ],
};

export const formatPrice = (p: number | null) => (p === null ? "auf Anfrage" : `${p} €`);
