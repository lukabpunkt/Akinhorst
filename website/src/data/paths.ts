// Basis-Pfad der Seite: "/" (Netlify/eigene Domain) oder z. B. "/Akinhorst" (GitHub Pages, per BASE_PATH beim Build)
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Interner Link/Pfad mit Basis-Pfad, z. B. url("/impressum") */
export const url = (path: string) => `${base}${path}`;

/** Pfad ohne Basis-Pfad, z. B. "/Akinhorst/impressum" → "/impressum" */
export const stripBase = (pathname: string) => (base && pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname);

/** Demo-Build (GitHub Pages): noindex, Formular sendet nichts. Per PUBLIC_DEMO=true beim Build */
export const isDemo = import.meta.env.PUBLIC_DEMO === "true";

export const isHomePath = (pathname: string) => ["/", "/index", "/index.html"].includes(stripBase(pathname));
