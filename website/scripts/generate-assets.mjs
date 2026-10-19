// Erzeugt Favicons, Apple-Touch-Icon, Manifest-Icons und og-image.jpg aus den lokalen Fonts + Fotos.
// Aufruf: node scripts/generate-assets.mjs
import opentype from "opentype.js";
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const fs = (p) => opentype.parse(readFileSync(p).buffer.slice(0));
const fontDir = "node_modules/@fontsource";
const serif = fs(`${fontDir}/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff`);
const serif500 = fs(`${fontDir}/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff`);
const sans = fs(`${fontDir}/montserrat/files/montserrat-latin-500-normal.woff`);

const INK = "#1D1D1D", GOLD = "#BB9758", IVORY = "#F7F3EC";

/** Text als Pfad, zentriert (anchor middle) oder links, mit Sperrung in em. */
function textPath(font, str, size, x, y, { anchor = "start", tracking = 0, fill = INK } = {}) {
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(str);
  const adv = glyphs.map((g) => g.advanceWidth * scale);
  const total = adv.reduce((a, b) => a + b, 0) + tracking * size * (glyphs.length - 1);
  let cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  const parts = glyphs.map((g, i) => {
    const d = g.getPath(cx, y, size).toPathData(2);
    cx += adv[i] + tracking * size;
    return d;
  });
  return `<path fill="${fill}" d="${parts.join(" ")}"/>`;
}

function monogram(size = 512, bg = IVORY) {
  const s = size;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}">
  ${bg ? `<rect width="${s}" height="${s}" fill="${bg}"/>` : ""}
  ${textPath(serif, "B", s * 0.62, s * 0.29, s * 0.71, { anchor: "middle", fill: INK })}
  <rect x="${s * 0.497}" y="${s * 0.2}" width="${Math.max(1, s * 0.012)}" height="${s * 0.6}" fill="${GOLD}"/>
  ${textPath(serif, "H", s * 0.62, s * 0.72, s * 0.71, { anchor: "middle", fill: GOLD })}
</svg>`;
}

function width(font, str, size, tracking = 0) {
  const g = font.stringToGlyphs(str);
  return g.reduce((a, x) => a + (x.advanceWidth * size) / font.unitsPerEm, 0) + tracking * size * (g.length - 1);
}
// „&“ mittig zwischen BAKIN und HORST
const ampX = () => (4 + width(serif500, "BAKIN", 64, 0.2) + (636 - width(serif500, "HORST", 64, 0.2))) / 2;

function fullLogo(ink = INK) {
  // viewBox -4 -4 648 500 (wie Logo.astro)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 648 500">
  <g fill="none" stroke="${ink}" stroke-width="2.2"><path d="M67 246 V2 H328"/><path d="M67 423 V476 H118"/></g>
  ${textPath(serif, "B", 232, 211, 210, { anchor: "middle", fill: ink })}
  <line x1="316" y1="34" x2="316" y2="244" stroke="${GOLD}" stroke-width="2"/>
  ${textPath(serif, "H", 232, 431, 210, { anchor: "middle", fill: GOLD })}
  ${textPath(serif500, "BAKIN", 64, 4, 338, { tracking: 0.2, fill: ink })}
  ${textPath(serif500, "&", 64, ampX(), 338, { anchor: "middle", fill: GOLD })}
  ${textPath(serif500, "HORST", 64, 636, 338, { tracking: 0.2, fill: ink, anchor: "end" })}
  <line x1="4" y1="384" x2="92" y2="384" stroke="${ink}" stroke-width="2"/>
  ${textPath(sans, "EVENT DESIGN GBR", 23, 320, 392, { anchor: "middle", tracking: 0.3, fill: ink })}
  <line x1="548" y1="384" x2="636" y2="384" stroke="${ink}" stroke-width="2"/>
  ${textPath(sans, "EVENT VERLEIH", 19, 152, 484, { tracking: 0.36, fill: GOLD })}
</svg>`;
}

writeFileSync("public/favicon.svg", monogram(64));
await sharp(Buffer.from(monogram(512))).resize(32, 32).png().toFile("public/favicon-32.png");
await sharp(Buffer.from(monogram(512))).resize(180, 180).png().toFile("public/apple-touch-icon.png");
await sharp(Buffer.from(monogram(512))).resize(192, 192).png().toFile("public/icon-192.png");
await sharp(Buffer.from(monogram(512))).png().toFile("public/icon-512.png");
writeFileSync("src/assets/logo-paths.svg", fullLogo());
// Monogramm-Glyphen als Pfade für Logo.astro (gestochen scharf, unabhängig vom Font-Laden)
const glyph = (font, ch, size, x, y) => {
  const g = font.charToGlyph(ch);
  const w = (g.advanceWidth * size) / font.unitsPerEm;
  return g.getPath(x - w / 2, y, size).toPathData(2);
};
writeFileSync(
  "src/data/logo-glyphs.json",
  JSON.stringify({ B: glyph(serif, "B", 232, 211, 210), H: glyph(serif, "H", 232, 431, 210), smallB: glyph(serif, "B", 86, 30, 66), smallH: glyph(serif, "H", 86, 91, 66) }, null, 2),
);

// OG-Image 1200×630: links Logo auf Ivory, rechts Zeltfoto mit Goldrahmen-Ecke
const photo = await sharp("../assets/zelt-innen-hochzeit.jpg").resize(520, 630, { fit: "cover", position: "centre" }).modulate({ saturation: 0.92 }).toBuffer();
const logo = await sharp(Buffer.from(fullLogo()), { density: 300 }).resize(470).png().toBuffer();
const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <path d="M640 150 V40 H800" fill="none" stroke="${GOLD}" stroke-width="2"/>
  <path d="M640 480 V590 H800" fill="none" stroke="${GOLD}" stroke-width="2"/>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: IVORY } })
  .composite([
    { input: photo, left: 680, top: 0 },
    { input: logo, left: 95, top: 133 },
    { input: frame, left: 0, top: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/og-image.jpg");

// Grain-Overlay: kleine, kachelbare Rausch-Textur (ersetzt SVG-feTurbulence → kein Filter-Rendering beim Scrollen)
{
  const n = 128, px = Buffer.alloc(n * n * 2);
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let i = 0; i < n * n; i++) { px[i * 2] = rnd() < 0.5 ? 0 : 255; px[i * 2 + 1] = Math.round(rnd() * 255); }
  await sharp(px, { raw: { width: n, height: n, channels: 2 } }).png({ compressionLevel: 9 }).toFile("public/noise.png");
}

// Fotos: Farbkorrektur (vorher CSS-filter saturate(.92) contrast(1.03)) einbacken.
// Quelle: Original-Fotos in ../assets, Ziel: src/assets (wird von astro:assets optimiert).
for (const name of ["zelt-aussen", "zelt-innen-hochzeit"]) {
  await sharp(`../assets/${name}.jpg`)
    .modulate({ saturation: 0.92 })
    .linear(1.03, -128 * 0.03)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(`src/assets/${name}.jpg`);
}

console.log("Assets erzeugt.");
