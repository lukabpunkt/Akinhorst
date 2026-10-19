# Build-Briefing: Website „Bakin & Horst Event Design GbR“

> **An Claude Code:** Dieses Dokument ist dein vollständiger Auftrag. Baue danach eine produktionsreife, hochwertige One-Page-Website (plus Impressum/Datenschutz) für einen jungen Event-Verleih aus Rahden. Lies das ganze Dokument, bevor du anfängst. Arbeite die Phasen in **Abschnitt 14** der Reihe nach ab und prüfe am Ende alle Punkte aus **Abschnitt 15**.
>
> Alles, was mit `TODO(INHABER)` markiert ist, sind Angaben, die noch vom Kunden bestätigt werden müssen. **Erfinde dafür keine Fakten.** Setz einen klar sichtbaren Platzhalter und liste alle offenen TODOs am Ende in einer `TODO.md`.

---

## 0. Assets (liegen bei)

Lege diese Dateien unter `src/assets/` bzw. `public/` ab:

| Datei | Inhalt | Verwendung |
|---|---|---|
| `logo-original-transparent.png` | Original-Logo, freigestellt, dunkel + gold (1314×1016) | Referenz, OG-Image, Fallback |
| `logo-light-transparent.png` | Logo-Variante für dunkle Hintergründe | nur Fallback |
| `zelt-aussen.webp` / `.jpg` | Partyzelt 5×10 m im Garten, Bäume, bewölkter Himmel (Hochformat 3:4) | Hero / Zelt-Sektion |
| `zelt-innen-hochzeit.webp` / `.jpg` | Innenansicht: lange weiße Tafel, Schleierkraut + weiße Rosen, Traubogen „Better Together“, Lichterketten, Rasen | Hero / Galerie / „Event Design“ |

**Wichtig zum Logo:** Die PNGs stammen aus einem Instagram-Bild und sind leicht unscharf. **Baue das Logo deshalb als Inline-SVG bzw. HTML/CSS-Komponente nach** (`<Logo />`, Spezifikation in Abschnitt 3). So bleibt es gestochen scharf und lässt sich animieren (Linien zeichnen sich, Buchstaben blenden ein). Die PNGs dienen nur als Vorlage für den Abgleich.

---

## 1. Projektziel

- Eine elegante, emotionale Website, die einen kleinen regionalen Zeltverleih **hochwertiger wirken lässt als die Konkurrenz** (die meisten Mitbewerber verkaufen nur über Kleinanzeigen).
- **Hauptziel (Conversion):** Terminanfragen für das Partyzelt über ein Formular, per Telefon oder WhatsApp.
- **Nebenziele:** lokal bei Google gefunden werden („Partyzelt mieten Rahden“), Vertrauen aufbauen, Instagram-Follower gewinnen.
- **Wirkung:** „Boutique-Hochzeitsausstatter“, nicht „Baumarkt-Verleih“. Ruhig, luxuriös, viel Weißraum, Schwarz und Gold, starke, aber geschmackvolle Animationen.

---

## 2. Unternehmensdaten (Quelle: öffentliche Kleinanzeige + Instagram, Stand 10/2026)

| Feld | Wert |
|---|---|
| Firma | Bakin & Horst Event Design GbR |
| Gesellschafter | Witali Bakin, Michelle Bakin — `TODO(INHABER)`: vollständig? Woher kommt „Horst“? |
| Adresse | Hackelbarg 9, 32369 Rahden, Deutschland |
| Telefon | 0155 10626727 (Link: `tel:+4915510626727`) |
| WhatsApp | `https://wa.me/4915510626727` — `TODO(INHABER)`: ist die Nummer auf WhatsApp erreichbar? |
| E-Mail | w.bakin@bakin-event.de |
| Domain | bakin-event.de (vorhanden, bisher ohne Website) |
| Instagram | https://www.instagram.com/bakin_horst_event_design/ |
| Einsatzgebiet | Rahden, Lohne und Umgebung — `TODO(INHABER)`: genauen Radius bestätigen |
| Gegründet | 2026 |

### Angebot: Partyzelt 5 × 10 m

- Grundfläche 50 m²
- bis ca. **100** Stehplätze · ca. **71** Sitzplätze in Stuhlreihen · ca. **64** Sitzplätze mit 8 Bierzeltgarnituren à 2 m
- Seitenwände mit Sprossenfenstern, einzeln anbring- oder abnehmbar (offen bei Sonne, geschlossen bei Wind und Regen)
- Abholung oder Lieferung, Selbstaufbau oder Aufbauservice
- Anlässe: Hochzeit, Geburtstag, Firmenfeier, Vereinsfest, Gartenparty, Taufe, Jubiläum
- Das Innenfoto zeigt, dass auch **Tischdeko, Tafel, Stühle und Traubogen** schon umgesetzt wurden. Formuliere „Event Design / Dekoration“ deshalb als **Zusatzleistung auf Anfrage**, ohne einzelne Mietartikel zu versprechen. `TODO(INHABER)`: Was davon wird wirklich vermietet?

### Preise

| Paket | Preis | Inhalt |
|---|---|---|
| **Selbstaufbau** | 250 € | Zelt inkl. Seitenwände, Abholung — `TODO(INHABER)`: Mietdauer? |
| **Rundum-Sorglos** | 450 € | Lieferung, Auf- und Abbau durch das Team — `TODO(INHABER)`: Liefer-Radius / km-Pauschale? |
| **Event Design** | auf Anfrage | Dekoration, Tafel, Ausstattung — `TODO(INHABER)` |

Zeige unter den Preisen eine kleine Zeile: „Kaution, Mietdauer und Lieferkosten besprechen wir persönlich.“ (`TODO(INHABER)`: durch echte Konditionen ersetzen.)

---

## 3. Brand-Analyse des Logos (gemessen am Originalbild)

### 3.1 Aufbau des Logos
```
┌───────────────────          ← offene Rahmenecke oben links (dünne dunkle Linie)
│     B │ H                   ← Monogramm: „B“ schwarz, „H“ gold, dazwischen feiner vertikaler Goldstrich
│
  B A K I N  &  H O R S T     ← Serifen-Versalien, sehr weit gesperrt, „&“ in Gold
───── EVENT DESIGN GBR ─────  ← Grotesk-Versalien, weit gesperrt, links und rechts Linien
└──  EVENT VERLEIH            ← offene Rahmenecke unten links, Text in Gold
```

### 3.2 Gemessene Farben → Design-Tokens

| Token | Hex | Herkunft / Verwendung |
|---|---|---|
| `--ink` | `#1D1D1D` | „B“ und Schriftzug (gemessen). Haupttext, dunkle Flächen |
| `--ink-soft` | `#3A3836` | Rahmenlinien (gemessen ca. #434343, leicht wärmer). Sekundärtext |
| `--gold` | `#BB9758` | „H“ und „&“ (gemessen, Median). **Akzentfarbe** |
| `--gold-deep` | `#9C7A3F` | dunklere Abstufung für Hover und Text auf Hell (Kontrast!) |
| `--gold-light` | `#D9C49A` | Schimmer, Verläufe, Linien auf Dunkel |
| `--ivory` | `#F7F3EC` | Seitenhintergrund (wärmer als das reine Weiß des Logos, wirkt edler) |
| `--paper` | `#FFFFFF` | Karten, Formular |
| `--stone` | `#E8E1D5` | Trennlinien, Ränder |
| `--night` | `#161513` | dunkle Sektionen (Preise, Footer) |

**Goldverlauf** (für Linien, Akzente, Shimmer – sparsam!):
`linear-gradient(110deg, #9C7A3F 0%, #BB9758 35%, #E3CF9F 50%, #BB9758 65%, #9C7A3F 100%)`

**Kontrastregeln (WCAG AA):**
- `--gold` (#BB9758) auf `--ivory` erreicht nur ca. 2,6:1. **Gold also nur für große Schrift (≥ 24 px), Linien und Ornamente** verwenden, nie für Fließtext.
- Für goldene Kleinschrift auf Hell `--gold-deep` (#9C7A3F, ca. 3,7:1) ab 18 px fett bzw. 24 px. Fließtext immer `--ink`.
- Auf `--night` ist `--gold` gut lesbar (ca. 7:1).

### 3.3 Typografie

Die Logo-Schriften sind eine klassische, kontrastreiche Antiqua (Garamond/Didone-Charakter) plus eine geometrische Grotesk mit weiter Sperrung.

| Rolle | Font | Gewichte | Hinweise |
|---|---|---|---|
| Display / Headlines / Monogramm | **Cormorant Garamond** | 300, 400, 500, 600 + Italic 400 | Headlines groß, `letter-spacing: -0.01em`; Versal-Labels `0.18em` |
| Wortmarke „BAKIN & HORST“ | **Cormorant Garamond** 500, Versalien | — | `letter-spacing: 0.22em` |
| UI / Fließtext / Labels | **Montserrat** | 300, 400, 500, 600 | Labels Versalien, 11–13 px, `letter-spacing: 0.28em` |

- Fonts **lokal hosten** (z. B. `@fontsource/cormorant-garamond`, `@fontsource/montserrat`), nicht über die Google-Fonts-CDN laden (DSGVO).
- Fluid Type mit `clamp()`:
  - H1 `clamp(2.75rem, 6vw + 1rem, 6.5rem)`
  - H2 `clamp(2.25rem, 3.5vw + 1rem, 4.25rem)`
  - H3 `clamp(1.5rem, 1.2vw + 1rem, 2rem)`
  - Body `clamp(1rem, 0.2vw + 0.95rem, 1.125rem)`, `line-height: 1.7`
- Italic-Cormorant für emotionale Akzentwörter in Headlines, z. B. „Euer Fest. *Unvergesslich.*“, dabei das kursive Wort in Gold.

### 3.4 Gestaltungs-Motive aus dem Logo (konsequent wiederverwenden!)

1. **Offene Rahmenecke (Corner-Bracket):** zwei dünne Linien (1 px, `--ink-soft` oder `--gold`), die eine Ecke bilden. Einsatz an Bildern, Preiskarten und Sektionstiteln (oben links + unten links, wie im Logo). Sie werden beim Scrollen **gezeichnet** (siehe Animationen).
2. **Vertikaler Goldstrich (B|H-Divider):** feine 1-px-Goldlinie als Trenner, z. B. zwischen Zahlen in den Kennzahlen, zwischen Navigationspunkten und als Scroll-Indikator im Hero.
3. **Linie – Text – Linie** („—— EVENT DESIGN GBR ——“): Muster für Sektions-Eyebrows, z. B. `—— UNSER ZELT ——`.
4. **Zweifarbigkeit Schwarz/Gold:** In Headlines bekommt genau **ein** Wort oder Zeichen Gold, so wie das „H“ und das „&“ im Logo.
5. **Gesperrte Versalien** für alle kleinen Labels.

### 3.5 Bildsprache

Weiß, Grün und Licht: weiße Zeltplane, satter Rasen, Schleierkraut, weiße Rosen, Lichterketten. Die Fotos bekommen ein **dezentes, einheitliches Grading** per CSS (`filter: saturate(0.92) contrast(1.03)`) und bei Overlays einen warmen Verlauf `rgba(22,21,19,0.55) → transparent`. Bilder nie hart rechteckig in den Fluss setzen: immer mit Corner-Bracket, Maske oder Parallax-Rahmen.

### 3.6 Tonalität der Texte

Du-Form („ihr/euch“), herzlich, aber elegant und ruhig. Kurze Sätze. Keine Emojis auf der Website. Keine übertriebenen Superlative und keine erfundenen Zahlen (wie „500+ Events“) oder erfundene Bewertungen.

---

## 4. Tech-Stack

| Bereich | Wahl | Begründung |
|---|---|---|
| Framework | **Astro 5** (statischer Output) | schnell, SEO-stark, wenig JS |
| Styling | **Tailwind CSS 4** + CSS-Custom-Properties aus Abschnitt 3.2 | Tokens in `@theme` |
| Animation | **GSAP 3** inkl. **ScrollTrigger** und **SplitText** (seit 2025 kostenlos) | präzise Scroll-Choreografie |
| Smooth Scroll | **Lenis** | edles, weiches Scrollen; mit ScrollTrigger synchronisieren |
| Bilder | `astro:assets` `<Picture>` (AVIF/WebP, responsive `srcset`) | Performance |
| Formular | **Netlify Forms** (Honeypot + Pflichtfelder) | ohne Backend; Alternative: Formspree |
| Icons | eigene feine Line-Icons als SVG (1,25 px Strich) oder `lucide` (stroke 1.25) | passend zur Linienästhetik |
| Hosting | Netlify, Domain bakin-event.de | `TODO(INHABER)`: Zugang zur Domain |
| Sprache | `lang="de"` | |

Kein jQuery, kein schweres UI-Framework. React-Islands nur, wenn es wirklich nötig ist (eigentlich nicht).

### Projektstruktur
```
/
├─ public/
│  ├─ favicon.svg            (Monogramm „B|H“ als SVG)
│  ├─ og-image.jpg           (1200×630, Logo auf Ivory + Zeltfoto)
│  └─ robots.txt
├─ src/
│  ├─ assets/                (Fotos, Logo-PNGs)
│  ├─ components/
│  │  ├─ Logo.astro          (SVG-Nachbau, Props: variant="dark|light", animated)
│  │  ├─ Preloader.astro
│  │  ├─ Header.astro / MobileMenu.astro
│  │  ├─ CornerFrame.astro   (Rahmenecken-Motiv)
│  │  ├─ Eyebrow.astro       („—— TEXT ——“)
│  │  ├─ Button.astro        (primary gold / ghost)
│  │  ├─ Cursor.astro        (Custom Cursor, nur Desktop)
│  │  └─ sections/ Hero, Intro, Tent, Features, Occasions, Packages, Process, DesignTeaser, Area, Faq, Contact, Footer
│  ├─ layouts/BaseLayout.astro (Meta, JSON-LD, Fonts, Lenis-Init)
│  ├─ scripts/animations.ts   (alle GSAP-Timelines zentral)
│  ├─ styles/global.css       (Tokens, Basis, Utilities, Grain)
│  └─ pages/ index.astro, impressum.astro, datenschutz.astro, danke.astro, 404.astro
└─ astro.config.mjs (site: "https://bakin-event.de")
```

---

## 5. Layout-System

- Container max. 1320 px, Seitenränder `clamp(1.25rem, 5vw, 4rem)`
- 12-Spalten-Grid auf Desktop, asymmetrische Layouts erwünscht (Editorial-Stil)
- Sektionsabstand vertikal `clamp(6rem, 12vw, 11rem)`, also viel Luft
- Radius: **0** (eckig, wie der Logo-Rahmen). Nur Buttons optional 2 px.
- Linien 1 px, Farbe `--stone` (hell) bzw. `rgba(217,196,154,0.25)` (dunkel)
- **Feine Körnung (Grain):** ein SVG-Noise-Overlay über der ganzen Seite, `opacity: 0.035`, `pointer-events: none`, wirkt wie Papier
- Breakpoints: 640 / 768 / 1024 / 1280 / 1536. **Mobile-first**, alles muss ab 360 px Breite perfekt aussehen

---

## 6. Seitenaufbau & Inhalte (One-Pager, Reihenfolge verbindlich)

Navigation (Anker): **Zelt · Pakete · Ablauf · Event Design · FAQ · Kontakt**, rechts Button **„Termin anfragen“**.

### 6.1 Preloader (nur beim ersten Besuch pro Session, max. 2,2 s)
- Ivory-Fläche. Das SVG-Logo baut sich auf (Ablauf in Abschnitt 7.1).
- Danach fährt die Fläche als Vorhang nach oben weg und gibt den Hero frei.
- `sessionStorage`-Flag (in try/catch): bei weiteren Seitenaufrufen nur ein kurzer Fade.

### 6.2 Header
- Transparent über dem Hero, Logo-Variante „kompakt“ (Monogramm B|H + „BAKIN & HORST“ einzeilig).
- Ab 80 px Scroll: Hintergrund `--ivory` mit 85 % Deckkraft + `backdrop-filter: blur(12px)`, feine Unterlinie, Höhe schrumpft von 96 auf 72 px.
- Beim Runterscrollen ausblenden, beim Hochscrollen einblenden.
- Nav-Links: Hover zeichnet eine Goldlinie von links nach rechts darunter.
- Mobil: Burger (zwei Linien → X). Vollbild-Menü in `--night`, Links in großer Cormorant-Schrift, die gestaffelt von unten einfliegen, dazu Telefon, WhatsApp und Instagram unten.

### 6.3 Hero (100svh)
**Layout Desktop:** links Text (Spalten 1–6), rechts zwei überlappende Bilder (Innenfoto groß, Außenfoto kleiner versetzt davor), beide mit Corner-Frames. **Mobil:** Bild als Vollflächen-Hintergrund mit dunklem Verlauf, Text darüber in Ivory.

Texte:
- Eyebrow: `—— EVENT VERLEIH · RAHDEN ——`
- H1: „Euer Fest verdient einen *besonderen* Rahmen.“ (*besonderen* = Cormorant Italic, Gold)
- Subline: „Unser elegantes Partyzelt für Hochzeiten, Geburtstage und Firmenfeiern in Rahden, Lohne und Umgebung. Mit Lieferung, Aufbau und viel Liebe zum Detail.“
- Buttons: **„Termin anfragen“** (primär, Gold) · **„Das Zelt entdecken“** (Ghost mit Pfeil)
- Unten links ein Scroll-Indikator: vertikale Goldlinie, in der ein Lichtpunkt nach unten läuft, Label `SCROLL` vertikal.
- Unten rechts ein Mini-Fakt: `5 × 10 m │ bis 100 Gäste`

### 6.4 Intro / Über uns
- Eyebrow `—— ÜBER UNS ——`
- H2: „Gegründet aus Liebe zu *schönen Momenten*.“
- Text (Platzhalter, `TODO(INHABER)` zur Freigabe): „Wir sind Bakin & Horst – ein junges Team aus Rahden. Wir glauben, dass die schönsten Feste dort entstehen, wo man sich wohlfühlt: im eigenen Garten, auf dem Hof oder auf der Lieblingswiese. Damit das Wetter euch keinen Strich durch die Rechnung macht, bringen wir den Raum mit – und auf Wunsch die passende Atmosphäre gleich dazu.“
- Rechts ein großes Zitat in Cormorant Italic: „Ihr feiert. Wir kümmern uns um den Rest.“
- Signatur-Zeile: „Witali & Michelle Bakin“ (`TODO(INHABER)`)

### 6.5 Das Zelt (Signature-Sektion, gepinnt)
- Eyebrow `—— UNSER PARTYZELT ——`, H2 „Raum für *bis zu 100* Gäste.“
- **Pinned-Scroll-Erlebnis (Desktop):** Die Sektion wird für ca. 250 vh gepinnt. Links das Außenfoto im Rahmen. Beim Scrollen wechseln rechts drei Kapitel (Text-Crossfade + Bild-Zoom/Wechsel):
  1. **Großzügig** – „50 m² überdachte Fläche – genug Platz für Tafel, Buffet und Tanzfläche.“
  2. **Wetterfest** – „Seitenwände mit Sprossenfenstern – einzeln abnehmbar. Offen bei Sonne, geschützt bei Wind und Regen.“
  3. **Wandelbar** – „Von der Gartenparty bis zur festlichen Hochzeitstafel – das Zelt passt sich eurem Anlass an.“ (Bild wechselt per Clip-Path-Wipe zum Innenfoto)
  - Ein Fortschrittsbalken in Gold mit „01 / 03“-Zähler.
- **Mobil:** kein Pinning, die drei Kapitel stehen untereinander mit Reveal-Animationen.

### 6.6 Kennzahlen (Count-up)
Vier Zahlen nebeneinander, getrennt durch vertikale Goldstriche (B|H-Motiv):

| Zahl | Label |
|---|---|
| 50 m² | Grundfläche |
| 100 | Stehplätze |
| 71 | Sitzplätze in Reihe |
| 64 | an 8 Garnituren |

Zahlen in Cormorant 300 (sehr groß), Labels in Montserrat-Versalien. Count-up beim Einscrollen.

### 6.7 Anlässe
- Eyebrow `—— FÜR JEDEN ANLASS ——`, H2 „Wofür *ihr* feiert.“
- Interaktive Liste (Editorial-Stil): große Zeilen in Cormorant, getrennt durch feine Linien: **Hochzeit · Geburtstag · Firmenfeier · Vereinsfest · Gartenparty · Taufe & Jubiläum**.
- **Desktop-Hover:** Ein Bild-Thumbnail folgt dem Cursor (verzögert, mit leichter Rotation). Die Zeile verschiebt sich um 24 px nach rechts, eine Goldlinie fährt ein und die Nummer „01–06“ färbt sich gold. Mit nur zwei echten Fotos: wechselnde Ausschnitte bzw. Zooms der beiden Bilder verwenden, **keine Stockfotos einfügen**. `TODO(INHABER)`: mehr Fotos.
- Mobil: einfache Liste mit Reveal.

### 6.8 Pakete & Preise (dunkle Sektion, `--night`)
- Eyebrow (gold) `—— PAKETE ——`, H2 (Ivory) „Klar. Fair. *Persönlich.*“
- Drei Karten nebeneinander, mobil horizontal swipebar (Scroll-Snap):
  1. **Selbstaufbau** – 250 € – „Ihr holt ab, baut auf und feiert.“ – Liste: Zelt 5 × 10 m · Seitenwände mit Fenstern · Einweisung · Abholung in Rahden
  2. **Rundum-Sorglos** – 450 € – **hervorgehoben** (Goldrahmen, Label „BELIEBT“, `TODO(INHABER)`: ok?) – „Wir liefern, bauen auf und wieder ab.“ – Liste: alles aus Selbstaufbau · Lieferung · Auf- & Abbau durch uns · persönlicher Ansprechpartner
  3. **Event Design** – „auf Anfrage“ – „Tafel, Deko & Atmosphäre aus einer Hand.“ – Liste: Dekorationskonzept · Tischdeko & Blumen · Lichterketten · Traubogen (`TODO(INHABER)`)
- Kartenrand 1 px `rgba(217,196,154,0.25)`, Corner-Frames in Gold an der hervorgehobenen Karte
- **Hover (Desktop):** 3D-Tilt (max. 6°) + Lichtreflex, der dem Cursor folgt (radialer Goldverlauf, `mix-blend-mode: soft-light`)
- Unter den Karten: „Kaution, Mietdauer und Lieferkosten besprechen wir gern persönlich.“ + Button „Unverbindlich anfragen“
- Preise im Markup als `TODO(INHABER)` kommentieren, damit sie leicht zu ändern sind (zentral in `src/data/site.ts` pflegen)

### 6.9 Ablauf („So einfach geht's“)
- H2 „In *fünf* Schritten zum Fest.“
- Horizontale Timeline (Desktop) bzw. vertikale (mobil). Eine Goldlinie **zeichnet sich beim Scrollen** (scrub) durch alle Schritte, die Schrittpunkte füllen sich, sobald die Linie sie erreicht.
  1. **Anfragen** – Wunschtermin, Ort und Gästezahl über das Formular senden
  2. **Bestätigen** – Wir melden uns persönlich und reservieren euren Termin
  3. **Liefern & Aufbauen** – Abholung oder Lieferung, auf Wunsch mit Aufbau
  4. **Feiern** – Ihr genießt euren Tag
  5. **Abbau** – Wir holen das Zelt wieder ab – oder ihr bringt es zurück

### 6.10 Event Design Teaser (Vollbild-Parallax)
- Das Innenfoto als Vollbreiten-Bild (ca. 90 vh) mit **Clip-Path-Reveal** (öffnet sich vom Zentrum als Rechteck auf volle Breite) und Parallax.
- Darauf (unten links, Ivory) die H2 „Mehr als ein Zelt – *ein Ort zum Erinnern*.“ und der Text „Auf Wunsch gestalten wir eure Feier komplett: von der festlich gedeckten Tafel bis zum Blumenbogen.“ + Button „Event Design anfragen“ (füllt im Formular das Paket „Event Design“ vor).

### 6.11 Liefergebiet
- Zweispaltig: links Text und Ortsliste, rechts eine **stilisierte SVG-Karte** (keine Google-Maps-Einbettung, wegen DSGVO und Optik): ein Goldpunkt für Rahden mit pulsierenden konzentrischen Ringen und feinen Punkten für die Nachbarorte.
- Orte: Rahden · Espelkamp · Stemwede · Diepenau · Rehden · Wagenfeld · Lohne · Preußisch Oldendorf — `TODO(INHABER)`: Liste bestätigen und klären, welches Lohne gemeint ist
- Text: „Ihr feiert weiter weg? Fragt einfach an – wir finden eine Lösung.“

### 6.12 FAQ (Accordion)
Die Antworten sind Platzhalter mit `TODO(INHABER)`, formuliert als vorsichtige Standardaussagen:
1. Wie lange kann ich das Zelt mieten?
2. Welcher Untergrund ist nötig? (ebene Rasen- oder Pflasterfläche, ca. 7 × 12 m inkl. Abspannung, `TODO`)
3. Was passiert bei Sturm oder Unwetter?
4. Gibt es eine Kaution?
5. Sind Tische, Bänke oder Beleuchtung dabei?
6. Wie weit liefert ihr?
7. Wie früh sollte ich reservieren? („Gerade in der Hochzeitssaison von Mai bis September empfehlen wir eine frühe Anfrage.“)

- Accordion: Plus-Icon dreht sich zu X, Höhe animiert (GSAP, `height: auto`), immer nur einer offen.
- Semantik: `<details>/<summary>` oder Buttons mit `aria-expanded`/`aria-controls`.
- **FAQPage JSON-LD** ausgeben.

### 6.13 Kontakt & Anfrage
Zweispaltig. Links:
- H2 „Lasst uns *euer Fest* planen.“
- Direkte Wege als große, klickbare Zeilen: Telefon · WhatsApp · E-Mail · Instagram (jeweils Icon + Label + Pfeil, Hover: Goldlinie)
- Adresse: Hackelbarg 9, 32369 Rahden

Rechts das **Anfrageformular** (Netlify Forms, `name="anfrage"`, Honeypot):

| Feld | Typ | Pflicht |
|---|---|---|
| Name | text | ja |
| E-Mail | email | ja |
| Telefon | tel | nein |
| Wunschtermin | date (min = heute) | ja |
| Ort der Feier | text | ja |
| Anlass | select: Hochzeit, Geburtstag, Firmenfeier, Vereinsfest, Gartenparty, Sonstiges | ja |
| Gästezahl | number 1–150 | nein |
| Paket | Radio-Karten: Selbstaufbau / Rundum-Sorglos / Event Design / Noch unsicher | ja |
| Nachricht | textarea | nein |
| Datenschutz | Checkbox „Ich habe die Datenschutzerklärung gelesen …“ | ja |

- **Floating Labels:** Das Label wandert beim Fokus nach oben und wird klein. Die Feldlinie (nur Unterlinie, keine Box) füllt sich in Gold von links.
- Validierung clientseitig mit freundlichen deutschen Meldungen. Fehlerzustand mit dezentem Shake.
- Der Absenden-Button zeigt einen Ladezustand (Linie läuft durch). Danach Weiterleitung zu `/danke` mit animiertem Häkchen (SVG-Stroke) + „Danke! Wir melden uns innerhalb von 24 Stunden.“ (`TODO(INHABER)`: Reaktionszeit ok?)
- Buttons wie „Event Design anfragen“ füllen das Paket per URL-Parameter `?paket=event-design` vor.

### 6.14 Footer (`--night`)
- Großes Logo (helle SVG-Variante) zentriert. Beim Einscrollen zeichnen sich die Rahmenecken.
- Spalten: Kontakt · Navigation · Social · Rechtliches (Impressum, Datenschutz)
- Ganz unten: „© 2026 Bakin & Horst Event Design GbR · Rahden“ + „Nach oben“-Button (Pfeil, smooth zu Top via Lenis)
- Optional ein riesiger, angeschnittener Schriftzug „BAKIN & HORST“ in `rgba(217,196,154,0.06)` als Hintergrund-Typografie, der beim Scrollen leicht horizontal wandert

### 6.15 Floating CTA (mobil)
- Sobald der Hero aus dem Bild ist: unten fixierte Leiste mit zwei Buttons „Anrufen“ und „Anfragen“ (gold). Sie blendet sich im Kontaktbereich aus.

---

## 7. Animations-Spezifikation (Kernstück – mit Sorgfalt umsetzen)

**Grundprinzipien:** stark, aber edel. Lieber **langsam und weich** als hektisch. Nichts springt oder blinkt. Jede Animation hat eine Bedeutung (Enthüllen, Führen, Bestätigen).

**Globale Easing- und Dauer-Tokens:**
```ts
export const ease = {
  luxe: "expo.out",          // Standard für Reveals
  silk: "power3.inOut",      // Übergänge, Vorhänge
  soft: "power2.out",        // kleine UI-Reaktionen
};
export const dur = { xs: 0.25, s: 0.5, m: 0.9, l: 1.4, xl: 2 };
// CSS-Pendant: --ease-luxe: cubic-bezier(0.16, 1, 0.3, 1);
```

### 7.1 Preloader / Logo-Build (Timeline, ca. 2,2 s)
1. 0,0 s – Rahmenecke oben links **zeichnet sich** (SVG `stroke-dashoffset`, 0,7 s, `power2.inOut`): erst vertikal hoch, dann horizontal nach rechts
2. 0,3 s – „B“ blendet ein: `opacity 0→1`, `y: 30→0`, `filter: blur(8px)→0` (0,9 s, `expo.out`)
3. 0,45 s – Goldener Trennstrich wächst von der Mitte vertikal (`scaleY 0→1`)
4. 0,6 s – „H“ in Gold wie „B“, danach läuft ein **Shimmer-Glanz** einmal über das H (Gradient-Maske wandert von links nach rechts)
5. 0,9 s – „BAKIN & HORST“: Buchstaben einzeln, `letter-spacing` von 0,6 em auf 0,22 em zusammenziehend, `opacity` gestaffelt (`stagger 0.03`)
6. 1,2 s – Linien links und rechts von „EVENT DESIGN GBR“ wachsen von innen nach außen, Text blendet ein
7. 1,4 s – untere Rahmenecke zeichnet sich, „EVENT VERLEIH“ blendet in Gold ein
8. 1,8 s – das ganze Logo skaliert auf 0,9 und blendet aus, gleichzeitig fährt der Ivory-Vorhang nach oben (`clip-path: inset(0 0 100% 0)`, 0,9 s, `power3.inOut`) und gibt den Hero frei
9. Der Hero-Intro startet überlappend (−0,3 s)

### 7.2 Hero-Intro
- Hero-Bilder: `clip-path: inset(100% 0 0 0) → inset(0)` (1,4 s, `expo.out`), gleichzeitig `scale 1.25 → 1`
- Das zweite Bild folgt 0,15 s später, Corner-Frames zeichnen sich danach
- H1: **SplitText nach Zeilen** mit Maske (`overflow: hidden`), Zeilen gleiten von `yPercent: 110` hoch (`stagger 0.08`, 1,2 s, `expo.out`). Das Gold-Italic-Wort hat zusätzlich einen kurzen Shimmer.
- Eyebrow-Linien wachsen (`scaleX`), Subline und Buttons faden von unten ein (`stagger 0.1`)
- Scroll-Indikator: Endlosschleife, Lichtpunkt läuft die Linie herunter (2 s, `power1.inOut`, repeat)

### 7.3 Hero-Scroll (Scrub)
- Beim Wegscrollen: das große Bild Parallax `yPercent: 0 → 15`, das kleine Bild `yPercent: 0 → -10` (Tiefenwirkung), der Textblock verblasst und steigt leicht (`y: -60`, `opacity → 0.2`)

### 7.4 Standard-Reveals (wiederverwendbar über `data-anim`-Attribute)
| Attribut | Effekt |
|---|---|
| `data-anim="fade-up"` | `y: 40→0`, `opacity 0→1`, 1 s, `expo.out`, start `top 85%` |
| `data-anim="lines"` | SplitText-Zeilen-Reveal wie im Hero |
| `data-anim="words"` | Wörter gestaffelt mit leichtem Blur |
| `data-anim="image"` | Clip-Path-Reveal von unten + Scale 1,2→1 |
| `data-anim="frame"` | Corner-Bracket zeichnet sich (`stroke-dashoffset`) |
| `data-anim="line-x"` | Linie wächst horizontal (`scaleX 0→1`, `transform-origin: left`) |
| `data-anim="stagger"` | Kinder gestaffelt (`stagger 0.08`) |
| `data-speed="0.9"` | Parallax-Faktor für Bilder/Ornamente |

Alle Reveals laufen nur **einmal** (`once: true`), Parallax-Effekte im Scrub-Modus.

### 7.5 Sektions-spezifisch
- **Zelt (6.5):** ScrollTrigger `pin: true`, `scrub: 1`, `end: "+=250%"`. Eine Master-Timeline steuert Kapitel-Crossfades (Text: `yPercent` + `opacity`), Bild-Ken-Burns (`scale 1→1.12`), den Wechsel zum Innenfoto per `clip-path: circle(0% at 70% 50%) → circle(150%)`, Fortschrittsbalken und Zähler. `snap` auf die drei Kapitel.
- **Kennzahlen:** Count-up 0→Zielwert (1,8 s, `power2.out`, gerundet), die Trennstriche wachsen vertikal.
- **Anlässe:** Cursor-Follow-Bild mit `gsap.quickTo` (x/y, 0,6 s, `power3`), Rotation abhängig von der Mausgeschwindigkeit (max. ±8°), Bildwechsel per Crossfade.
- **Preise:** Karten fahren gestaffelt aus der Tiefe ein (`y: 80`, `rotateX: 8° → 0`, `opacity`). Tilt und Glare per `quickTo`. Die hervorgehobene Karte bekommt einen langsam umlaufenden Goldschimmer am Rand (conic-gradient-Rand, 6 s Loop, sehr dezent).
- **Ablauf:** Eine SVG-Linie zeichnet sich gescrubbt (`drawSVG`-Ersatz: `stroke-dashoffset`). Jeder Schrittpunkt skaliert beim Erreichen von 0 auf 1 mit `back.out(2)`, der Schritttext blendet ein.
- **Event Design Teaser:** `clip-path: inset(20% 30% 20% 30%) → inset(0)` gescrubbt beim Hereinscrollen, Bild-Parallax innen, Text-Reveal danach.
- **Liefergebiet:** Ringe um Rahden pulsieren (CSS-Keyframes, 3 s, `infinite`, gestaffelt). Orte erscheinen nacheinander als Punkte, Verbindungslinien zeichnen sich.
- **Footer:** Logo-Rahmen zeichnen sich, Hintergrund-Schriftzug läuft mit `xPercent` scrub.

### 7.6 Mikro-Interaktionen
- **Magnetische Buttons** (Desktop): Der Button folgt dem Cursor in einem Radius von 60 px um max. 10 px (`quickTo`, elastisch zurück mit `elastic.out(1, 0.4)`).
- **Primär-Button:** Gold-Fläche, Text in `--night`. Beim Hover schiebt sich von unten eine `--night`-Fläche hinein (`clip-path`), der Text wechselt zu Gold und der Pfeil gleitet 4 px nach rechts. Dauer 0,5 s, `--ease-luxe`.
- **Ghost-Button:** 1-px-Rahmen. Beim Hover zeichnen sich die Ecken in Gold (Corner-Motiv).
- **Custom Cursor** (nur `pointer: fine`): kleiner Gold-Punkt (6 px) + nachlaufender Ring (36 px, `mix-blend-mode: difference` vermeiden, stattdessen 1-px-Goldring). Über Links wächst der Ring auf 64 px. Über Bildern zeigt er „Ansehen“, über der Anlässe-Liste „Entdecken“. Der native Cursor bleibt aktiv (Barrierefreiheit), der Custom Cursor ist rein dekorativ.
- **Bilder:** Hover-Zoom 1,04 innen (Container `overflow: hidden`), 1,2 s, `--ease-luxe`.
- **Links im Fließtext:** Goldene Unterlinie, die sich beim Hover von links nach rechts erneuert.
- **Lenis:** `duration: 1.2`, `easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))`. Anker-Links laufen über `lenis.scrollTo` mit `offset: -80`.

### 7.7 Barrierefreiheit & Performance der Animationen (Pflicht!)
- `prefers-reduced-motion: reduce` → **kein** Lenis, kein Pinning, kein Parallax, kein Cursor, kein Preloader-Build (nur Logo kurz einblenden). Reveals nur als einfacher Fade (0,3 s). Alle Inhalte müssen ohne JS sichtbar sein (Progressive Enhancement: Startzustände der Animationen **erst per JS** setzen, z. B. Klasse `.js-anim` am `<html>`).
- Nur `transform`, `opacity`, `clip-path` und `filter` animieren, niemals `top`/`left`/`width` (Ausnahme: Accordion-Höhe).
- `gsap.matchMedia()` für Desktop/Mobil-Varianten verwenden. Auf Touch-Geräten keine Hover-, Tilt-, Magnet- oder Cursor-Effekte.
- ScrollTrigger nach dem Laden der Fonts und Bilder `refresh()`en.
- Das Pinning in 6.5 nur ab 1024 px Breite.

---

## 8. Komponenten-Details

### `Logo.astro` (SVG-Nachbau)
- ViewBox ca. 640 × 480, Aufbau wie in Abschnitt 3.1
- Text als `<text>` mit Cormorant Garamond / Montserrat oder (besser für Schärfe und Animation) die Buchstaben „B“ und „H“ als Pfade. Wenn das zu aufwendig ist: `<text>` + lokal geladene Fonts, nach dem Laden der Fonts animieren.
- Props: `variant: "full" | "compact" | "monogram"`, `tone: "dark" | "light"`, `animated: boolean`
- Farben über `currentColor` und CSS-Variablen, damit es auf Ivory und Night funktioniert (Light-Variante: Ink → `#F7F3EC`, Gold bleibt `--gold`)
- Mit `logo-original-transparent.png` optisch abgleichen: Proportionen, Sperrung, Position der Rahmenecken

### `CornerFrame.astro`
- Wrapper, der um Kinder zwei L-Ecken (oben links, unten links; optional alle vier) als absolut positionierte SVGs legt, Abstand `-12px`, Linienlänge 30–40 % der Kante
- Props: `color`, `animated`, `corners`

### `Eyebrow.astro`
- `—— TEXT ——` mit animierbaren Linien (`scaleX`), Montserrat 500, 12 px, `letter-spacing: 0.3em`, Farbe `--gold-deep` (hell) bzw. `--gold` (dunkel)

---

## 9. SEO & Local SEO

- `<title>`: „Partyzelt mieten in Rahden | Bakin & Horst Event Design“
- Meta-Description: „Elegantes Partyzelt 5×10 m mieten in Rahden & Umgebung – für Hochzeiten, Geburtstage & Firmenfeiern. Mit Lieferung & Aufbauservice. Jetzt Termin anfragen!“
- Eine H1, saubere H2/H3-Hierarchie, sprechende `alt`-Texte (z. B. „Festlich gedeckte Hochzeitstafel mit Schleierkraut im weißen Partyzelt“)
- **JSON-LD:** `LocalBusiness` (Name, Adresse, Telefon, E-Mail, `url`, `image`, `areaServed`-Liste, `sameAs` Instagram, `priceRange: "€€"`) + `Product`/`Offer` für die Pakete + `FAQPage`
- `sitemap.xml` (`@astrojs/sitemap`), `robots.txt`, Canonical, Open-Graph- und Twitter-Card-Tags, `og-image.jpg`
- Favicon-Set: SVG-Monogramm B|H (B ink, H gold, auf Ivory), `apple-touch-icon` 180 px, `manifest.webmanifest` (theme-color `#161513`)
- Keywords natürlich im Text verwenden: Partyzelt mieten Rahden, Zeltverleih Rahden, Festzelt mieten, Partyzelt Hochzeit, Espelkamp, Stemwede, Minden-Lübbecke
- Hinweis in der `TODO.md`: Google-Unternehmensprofil anlegen, NAP-Daten identisch halten

---

## 10. Rechtliches (Deutschland)

- **`/impressum`** nach § 5 DDG: Bakin & Horst Event Design GbR, vertreten durch die Gesellschafter Witali Bakin und Michelle Bakin (`TODO(INHABER)`: vollständig?), Hackelbarg 9, 32369 Rahden, Telefon, E-Mail, USt-IdNr. oder Hinweis auf § 19 UStG (`TODO(INHABER)`), verantwortlich nach § 18 Abs. 2 MStV (`TODO`), Hinweis zur EU-Streitschlichtung bzw. Verbraucherstreitbeilegung
- **`/datenschutz`**: Verantwortlicher, Hosting (Netlify, Datenübermittlung in die USA / Data Privacy Framework), Kontaktformular (Netlify Forms), E-Mail/Telefon/WhatsApp-Kontakt, lokal gehostete Fonts, **keine** Cookies/Tracking, Betroffenenrechte, Beschwerderecht (LDI NRW). Als Vorlage-Struktur ausformulieren, am Anfang deutlich vermerken: „Bitte vor Veröffentlichung rechtlich prüfen lassen.“
- **Keine** externen Einbettungen ohne Einwilligung: kein Google Maps, kein Instagram-Embed (nur Links), keine Google-Fonts-CDN, kein Analytics. Dann ist **kein Cookie-Banner nötig**.
- Optional `/mietbedingungen` als Platzhalter-Seite (`TODO(INHABER)`)
- Diese Seiten im gleichen edlen Stil gestalten, aber ruhig (nur Fade-ins)

---

## 11. Performance- & Qualitätsziele

- Lighthouse (mobil): **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100**
- LCP < 2,5 s, CLS < 0,05. Das Hero-Bild bekommt `fetchpriority="high"` und wird nicht lazy geladen, alle anderen Bilder `loading="lazy"`
- Bilder AVIF/WebP, maximal 2400 px breit, responsive `sizes`
- JS-Bundle (gzip) möglichst < 90 KB. GSAP-Plugins einzeln importieren.
- Fonts: nur die benötigten Gewichte, `font-display: swap`, die zwei wichtigsten preloaden
- Tastaturbedienung komplett, sichtbare Fokus-Stile (2 px Goldrand mit Offset), Skip-Link „Zum Inhalt springen“, ARIA für Menü, Accordion und Formular

---

## 12. Zentrale Inhaltsdatei

Alle Texte, Preise, Kontaktdaten und Orte zentral in `src/data/site.ts` ablegen, damit die Inhaber oder ein Entwickler sie ohne Suchen ändern können:
```ts
export const site = {
  name: "Bakin & Horst Event Design GbR",
  phone: { display: "0155 10626727", href: "tel:+4915510626727" },
  whatsapp: "https://wa.me/4915510626727", // TODO(INHABER)
  email: "w.bakin@bakin-event.de",
  address: { street: "Hackelbarg 9", zip: "32369", city: "Rahden" },
  instagram: "https://www.instagram.com/bakin_horst_event_design/",
  packages: [ /* Selbstaufbau 250, Rundum-Sorglos 450, Event Design auf Anfrage */ ],
  areas: ["Rahden", "Espelkamp", "Stemwede", "Diepenau", "Rehden", "Wagenfeld", "Lohne", "Preußisch Oldendorf"],
  tent: { size: "5 × 10 m", area: 50, standing: 100, seatsRows: 71, seatsBenches: 64 },
};
```

---

## 13. Was ausdrücklich NICHT gemacht werden soll

- Keine erfundenen Kundenbewertungen, Zahlen („500+ Events“), Auszeichnungen oder Team-Fotos
- Keine Stockfotos von fremden Hochzeiten, die als eigene Referenzen wirken. Falls zusätzliche Stimmungsbilder nötig sind: als `TODO(INHABER)`-Platzhalterfläche (Ivory mit Corner-Frame und Hinweis) darstellen.
- Kein Gold für Fließtext, keine runden „Bubbly“-Elemente, keine knalligen Farben, keine Emojis
- Keine Autoplay-Musik, keine Pop-ups, kein Cookie-Banner (nicht nötig, siehe 10)
- Keine Animation, die den Inhalt länger als 2,5 s blockiert

---

## 14. Umsetzungsplan (Reihenfolge)

1. **Setup:** Astro + Tailwind 4 + GSAP + Lenis + `@astrojs/sitemap` + Fontsource. Tokens in `global.css`, Grain-Overlay, BaseLayout mit Meta und JSON-LD-Gerüst.
2. **Basis-Komponenten:** Logo (SVG, mit dem PNG abgleichen), CornerFrame, Eyebrow, Button, Header, MobileMenu, Footer.
3. **Sektionen statisch** (ohne Animation) komplett mit Inhalten aus `site.ts`, mobil und desktop sauber, Formular funktionsfähig (Netlify-Attribute, Honeypot, `/danke`).
4. **Rechtsseiten** Impressum, Datenschutz, 404, Danke.
5. **Animationssystem:** `animations.ts` mit Lenis ↔ ScrollTrigger-Sync, `gsap.matchMedia`, Reduced-Motion-Zweig, `data-anim`-Reveals.
6. **Signature-Animationen:** Preloader-Logo-Build, Hero-Intro, Zelt-Pinning, Ablauf-Linie, Event-Design-Clip, Preis-Tilt, Anlässe-Cursor-Bild, Magnet-Buttons, Custom Cursor.
7. **Feinschliff:** Timing aller Animationen gemeinsam ansehen (nichts doppelt, kein Ruckeln), Kontraste prüfen, Fokus-Stile.
8. **QA:** Lighthouse, Test auf 360 / 768 / 1280 / 1920 px, Safari iOS (100svh, Lenis), Firefox, Tastaturtest, Reduced-Motion-Test, JS-aus-Test (Inhalte sichtbar?).
9. **Deploy-Vorbereitung:** `netlify.toml` (Build-Befehl, Security-Header, Cache-Header für Assets), README mit „Inhalte ändern“-Anleitung, `TODO.md` mit allen offenen Inhaber-Punkten.

---

## 15. Abnahme-Checkliste

- [ ] Logo-Nachbau entspricht dem Original (Rahmenecken, B schwarz / H gold, Trennstrich, „&“ gold, Sperrungen)
- [ ] Farben exakt aus Abschnitt 3.2, Gold nie als Fließtextfarbe
- [ ] Preloader ≤ 2,2 s, nur einmal pro Session
- [ ] Alle Sektionen aus Abschnitt 6 vorhanden, Anker-Navigation funktioniert mit Offset
- [ ] Zelt-Sektion pinnt sauber (Desktop) und ist mobil linear
- [ ] Formular sendet, validiert, Honeypot aktiv, Danke-Seite, Paket-Vorauswahl per URL
- [ ] Telefon-, WhatsApp- und Mail-Links funktionieren
- [ ] Reduced Motion: keine Bewegung außer Fades, alles bedienbar
- [ ] Ohne JavaScript ist alles sichtbar und lesbar
- [ ] Lighthouse-Ziele erreicht, kein CLS durch Fonts oder Bilder
- [ ] Impressum und Datenschutz vorhanden, keine externen Requests (Network-Tab prüfen)
- [ ] JSON-LD validiert (LocalBusiness, FAQPage), Sitemap und robots erreichbar
- [ ] `TODO.md` listet alle `TODO(INHABER)`-Punkte

---

## 16. Offene Punkte für die Inhaber (in `TODO.md` übernehmen)

1. Woher kommt „Horst“ im Namen, und sind alle Gesellschafter im Impressum genannt?
2. Mietdauer der Pakete (Tag / Wochenende?), Kaution, Anzahlung, Storno
3. Liefer-Radius und Lieferkosten, welches „Lohne“ gemeint ist
4. Was ist inklusive (Garnituren, Beleuchtung, Boden, Heizung)? Wird Deko vermietet?
5. Ist die Nummer auf WhatsApp erreichbar? Ist die Reaktionszeit von 24 h realistisch?
6. Originale Logo-Datei (SVG/AI/PDF) und weitere Fotos von echten Events
7. „Über uns“-Text und Namen freigeben
8. USt-IdNr. oder Kleinunternehmerregelung
9. Zugang zur Domain bakin-event.de / DNS für Netlify
