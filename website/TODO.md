# Offene Punkte – Bakin & Horst Website

Alle Stellen sind im Code mit `TODO(INHABER)` markiert. Die meisten Inhalte werden zentral in `src/data/site.ts` geändert.

## Von den Inhabern zu klären

1. **Name & Gesellschafter:** Woher kommt „Horst“ im Namen? Sind im Impressum alle Gesellschafter genannt (aktuell: Witali Bakin, Michelle Bakin)?
   → `site.ts` (`owners`), `pages/impressum.astro`
2. **Konditionen:** Mietdauer der Pakete (Tag / Wochenende?), Kaution, Anzahlung, Storno.
   → `site.ts` (`packages`, `packagesNote`, `faq`)
3. **Preise bestätigen:** Selbstaufbau 250 €, Rundum-Sorglos 450 €, Event Design „auf Anfrage“. Label „Beliebt“ am Rundum-Sorglos-Paket ok?
4. **Liefergebiet:** Liefer-Radius und Lieferkosten (km-Pauschale?). „Lohne“ = Lohne (Wietmarschen) (geklärt 19.10., Karte angepasst). Ortsliste bestätigen.
   → `site.ts` (`areas`), `components/sections/Area.astro` (Koordinaten)
5. **Leistungsumfang:** Was ist inklusive (Garnituren, Beleuchtung, Boden, Heizung)? Wird Deko vermietet? Was gehört konkret zum Paket „Event Design“ (aktuell: Dekorationskonzept, Tischdeko & Blumen, Lichterketten, Traubogen)?
6. **Erreichbarkeit:** Ist 0155 10626727 auf WhatsApp erreichbar? Ist „Antwort innerhalb von 24 Stunden“ realistisch?
   → `site.ts` (`whatsapp`, `responseTime`)
7. **Material:** Originale Logo-Datei (SVG/AI/PDF) und weitere Fotos von echten Events (Anlässe-Sektion nutzt bisher nur Ausschnitte der zwei vorhandenen Fotos).
8. **Texte freigeben:** „Über uns“-Text, Signatur „Witali & Michelle Bakin“, alle FAQ-Antworten (sind vorsichtige Platzhalter).
9. **Steuer:** USt-IdNr. oder Hinweis auf Kleinunternehmerregelung (§ 19 UStG) für das Impressum. Verantwortlicher nach § 18 Abs. 2 MStV bestätigen.
10. **Mietbedingungen:** Text liefern (Seite `/mietbedingungen` ist Platzhalter, `noindex`).
11. **Domain:** Zugang zu bakin-event.de / DNS für Netlify.

## Rechtliches / Technik vor Go-Live

- [ ] Impressum und Datenschutzerklärung **rechtlich prüfen lassen** (Datenschutz ist als Vorlage formuliert).
- [ ] Auftragsverarbeitungsvertrag (DPA) mit Netlify abschließen.
- [ ] Netlify: Formular-Benachrichtigung „anfrage“ an w.bakin@bakin-event.de einrichten (Site settings → Forms → Notifications).
- [ ] Domain bakin-event.de verbinden, HTTPS aktiv.
- [ ] Nach dem Go-Live: Sitemap in der Google Search Console einreichen (`https://bakin-event.de/sitemap-index.xml`).
- [ ] **Google-Unternehmensprofil** anlegen. NAP-Daten (Name, Adresse, Telefon) überall identisch halten: „Bakin & Horst Event Design GbR, Hackelbarg 9, 32369 Rahden, 0155 10626727“.
- [ ] Instagram-Bio auf die Website verlinken.

- [ ] Nach Go-Live auf echtem iPhone (Safari) prüfen: Datumsfeld im Formular, Schriften werden nicht doppelt geladen (Playwright-WebKit lädt vorgeladene Fonts doppelt), Querformat.
- [ ] Datenschutz Abschnitt 3: Satz „AV-Vertrag … geschlossen“ erst stehen lassen, wenn der Vertrag wirklich abgeschlossen ist.
- [ ] Obergrenze Gästezahl im Formular (aktuell 150) passend zur Zeltkapazität festlegen

## Bekannte Messwerte (lokal, Lighthouse mobil, simuliertes Slow-4G)

Stand 15.10.2026 nach Performance-Überarbeitung:
Performance 86–88 (schwankt je Lauf) · Accessibility 100 · Best Practices 100 · SEO 100 · CLS 0 · TBT 30–40 ms.
LCP simuliert ca. 3,5 s (real gemessen ca. 2,4 s): Die Hero-Inhalte werden durch den gewünschten Preloader (erster Besuch, ca. 2,7 s) bewusst verzögert eingeblendet. Wer LCP < 2,5 s will, muss den Preloader kürzen oder weglassen. Auf Netlify mit CDN nach dem Go-Live erneut messen.

Stand 16.10.2026 nach Mobile-First-Umbau (kein Preloader/Hero-Intro mobil): LCP simuliert ca. 2,7–2,8 s (vorher ca. 3,5 s), Speed Index ca. 2,4 s (vorher ca. 4,1 s). Lokal stark schwankend, weil der Rechner während der Messung ausgelastet war – nach dem Go-Live auf Netlify erneut messen.

Scroll-Performance (Playwright, 4× CPU-Drosselung, Wheel-Scroll über die ganze Seite):
Layout-Berechnungen −63 % (≈1290 → ≈470), Style-Neuberechnung −55 %, Main-Thread-Zeit −28 %, keine Long Tasks mehr.

Stand 19.10.2026 nach 3-Agenten-Prüfung (Produktions-Build, mobil): Lighthouse Perf 89–98, A11y/BP/SEO 100, Seitengewicht 360 px ca. 425 KB, CLS meist 0,0001 (max. 0,02), axe mobil 0 Verstöße auf allen Seiten.
