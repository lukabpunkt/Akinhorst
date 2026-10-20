# Bakin & Horst Event Design – Website

One-Page-Website (plus Impressum, Datenschutz, Mietbedingungen, Danke, 404) für den Partyzelt-Verleih aus Rahden.
Grundlage: `../CLAUDE_CODE_BRIEFING_bakin-horst-website.md`.

**Stack:** Astro 5 (statisch) · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText) · Lenis · Netlify Forms · Fonts lokal via Fontsource.

## Entwicklung

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # statischer Output in dist/
npm run preview   # Build lokal ansehen
```

Hinweis: Das Anfrageformular funktioniert erst auf Netlify (Netlify Forms erkennt das Formular beim Deploy).

## Inhalte ändern

Fast alles steht in **`src/data/site.ts`**:

| Was | Wo in `site.ts` |
|---|---|
| Telefon, WhatsApp, E-Mail, Adresse, Instagram | `phone`, `whatsapp`, `email`, `address`, `instagram` |
| Preise & Paketinhalte | `packages` (Preis `null` = „auf Anfrage“) |
| Hinweis unter den Preisen | `packagesNote` |
| Zeltdaten (Fläche, Plätze) | `tent` |
| Anlässe | `occasions` |
| Liefergebiet (Ortsliste) | `areas` – neue Orte brauchen Koordinaten in `src/components/sections/Area.astro` |
| Ablauf-Schritte | `steps` |
| FAQ (inkl. FAQ-Schema für Google) | `faq` |
| Reaktionszeit (Formular, Danke-Seite) | `responseTime` |

Weitere Texte stehen direkt in den Sektionen unter `src/components/sections/` (z. B. „Über uns“ in `Intro.astro`).
Impressum und Datenschutz: `src/pages/impressum.astro`, `src/pages/datenschutz.astro`.

**Fotos austauschen/ergänzen:** Dateien nach `src/assets/` legen und in der jeweiligen Sektion importieren – Astro erzeugt automatisch AVIF/WebP in passenden Größen.

## Struktur

```
src/
  components/        Logo (SVG-Nachbau), CornerFrame, Eyebrow, Button, Header, MobileMenu, Footer, Cursor, Preloader …
  components/sections/  Hero, Intro, Tent, Stats, Occasions, Packages, Process, DesignTeaser, Area, Faq, Contact
  data/              site.ts (Inhalte), schema.ts (JSON-LD), nav.ts, logo-glyphs.json (generiert)
  layouts/           BaseLayout (Meta, JSON-LD, Progressive Enhancement), LegalLayout
  scripts/animations.ts   alle Animationen & Interaktionen zentral
  styles/global.css  Design-Tokens, Basis, Komponenten
scripts/generate-assets.mjs   erzeugt Favicons, Icons, og-image.jpg, Logo-Glyphen, noise.png und die farbkorrigierten Fotos (aus ../assets → src/assets)
```

Favicons/OG-Image neu erzeugen (z. B. nach Logo-Änderung): `node scripts/generate-assets.mjs`

## Animationen & Barrierefreiheit

- Alle Inhalte sind ohne JavaScript sichtbar: Startzustände greifen nur mit der Klasse `.js-anim` am `<html>`, mit Failsafe nach 6 s und Notfall-Fallback, falls das Skript beim Start fehlschlägt.
- `prefers-reduced-motion`: kein Smooth Scroll, kein Pinning, kein Parallax, kein Cursor, Preloader nur als kurzer Fade, Reveals als einfache Fades.
- Preloader nur am Desktop (ab 1024 px mit Maus) und nur beim ersten Besuch pro Browser-Session (`sessionStorage`). Mobil steht der Hero sofort.
- Hover-, Tilt-, Magnet- und Cursor-Effekte nur auf Geräten mit Maus ab 1024 px; Zelt-Pinning nur ab 1024 px.

## Deploy (Netlify)

`netlify.toml` enthält Build-Befehl, Security-Header (inkl. CSP) und Cache-Header. Repository mit Netlify verbinden oder `dist/` per Drag & Drop hochladen. Offene Punkte vor dem Go-Live: siehe `TODO.md`.

## Performance-Regeln (beim Weiterentwickeln beachten)

- Bilder: keine CSS-`filter` und keine `transition: transform` auf Bildern, die GSAP bewegt – Farbkorrektur ist in die Fotos eingebacken (`generate-assets.mjs`).
- Keine `backdrop-filter` auf fixierten Elementen (Header, Floating CTA) – stattdessen fast deckender Hintergrund.
- Endlos-Animationen in Sektionen mit `data-loop` werden außerhalb des Viewports pausiert.
- Lenis läuft mit `lerp: 0.12`; ScrollTrigger-Scrubs daher mit `scrub: true` (keine zweite Glättung), kein `snap`.
- Desktop-Interaktionen (`mm.add`) registrieren Listener mit `AbortController`-Signal und räumen beim Breakpoint-Wechsel auf.

## Mobile first

- Basis-CSS ist das Handy-Layout; größere Bildschirme ergänzen per `min-width` (640 / 768 / 1024 / 1280). Keine neuen `max-width`-Overrides einführen.
- Mobil: kein Smooth Scroll (natives Touch-Scrollen), kein Pinning, keine Scroll-Parallaxe, kein 3D; Hero ohne Intro-Animation.
- Touch-Ziele mindestens 44 px; Hover-Effekte nur in `@media (hover: hover)`.
- Seitenränder über `--gutter-l` / `--gutter-r` (berücksichtigen die iPhone-Notch im Querformat).
- Kleine Goldschrift auf Hell nur mit `--gold-deep` (#8A6A33, 4,5:1); Fokusring über `--focus` (Hell: `--gold-deep`, dunkle Flächen: `--gold`). Neue dunkle Bereiche in `global.css` bei der `--focus`-Regel ergänzen.
- Querformat am Handy mitprüfen (Hero-Titel max. 13svh, Floating CTA schmal, Zelt-Galerie max. 60svh breit).
- Bildansicht: Container mit `data-lightbox-media` öffnen das angeklickte Foto groß (`Lightbox.astro`, Logik `setupLightbox` in `animations.ts`). Hero-Fotos nur am Desktop, Zelt-Fotos überall. Ebenen, die über Fotos liegen, brauchen `pointer-events: none`.
- „Wofür ihr feiert“: Jeder Anlass verlinkt auf `/?anlass=…#kontakt` und wählt den Anlass im Formular vor (wie `?paket=`). Die Anlass-Liste kommt aus `site.occasions`.

## GitHub Pages (Vorschau)

Jeder Push auf `main` baut die Seite über `.github/workflows/deploy.yml` und veröffentlicht sie unter https://lukabpunkt.github.io/Akinhorst/. Der Build läuft dort mit `BASE_PATH=/Akinhorst`, deshalb interne Links und Pfade immer über `url()` aus `src/data/paths.ts` schreiben (nie fest `"/…"`). Ohne `BASE_PATH` (Netlify, eigene Domain) baut die Seite wie bisher für `/`.
Der Pages-Build läuft außerdem mit `PUBLIC_DEMO=true` (Demo-Modus, siehe unten). Netlify Forms und die Header aus `netlify.toml` (CSP, Caching) gibt es auf GitHub Pages nicht.

## Datenschutz & Cookies

Stand 20.10.2026 braucht die Seite **kein Cookie-Banner**. Sie setzt keine Cookies, nutzt keinen Local/Session Storage, kein Tracking, keine Analyse und lädt nichts von Fremdservern (Schriften lokal, Karte als SVG, WhatsApp/Instagram nur als Links mit `noreferrer`). Damit das so bleibt:

- Nichts im Browser speichern (Cookies, `localStorage`, `sessionStorage`, IndexedDB), es sei denn, es ist technisch zwingend nötig (§ 25 TDDDG). Das Preloader-Intro erkennt „von außen gekommen“ deshalb über `document.referrer` statt über Storage.
- Keine externen Einbindungen (Google Fonts, Maps, YouTube, Instagram-Feed, Analytics …) ohne Einwilligungslösung. Jede neue Einbindung braucht außerdem einen Abschnitt in der Datenschutzerklärung. Die CSP in `netlify.toml` blockiert Fremd-Requests ohnehin.
- Das Formular hat bewusst **keine Einwilligungs-Checkbox**. Für eine Anfrage reicht Art. 6 Abs. 1 lit. b DSGVO, ein Hinweistext unter dem Button verlinkt die Datenschutzerklärung. Die Spam-Prüfung von Netlify Forms (Akismet) steht in Abschnitt 4 der Datenschutzerklärung.
- **Demo-Modus** (`PUBLIC_DEMO=true`, nur GitHub Pages): Auf allen Seiten steht `noindex, nofollow`. Das Formular hat keine Netlify-Attribute, sendet nichts und zeigt einen Demo-Hinweis. Ohne JS ist der Button gesperrt. Für den Live-Build die Variable nicht setzen.
