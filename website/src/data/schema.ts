import { site } from "./site";

export const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  alternateName: "Bakin & Horst Event Verleih",
  description: `Partyzelt-Verleih und Event Design in Rahden: elegantes Partyzelt ${site.tent.size} für Hochzeiten, Geburtstage und Firmenfeiern – mit Lieferung und Aufbauservice.`,
  url: site.url,
  image: `${site.url}/og-image.jpg`,
  logo: `${site.url}/apple-touch-icon.png`,
  telephone: site.phone.intl,
  email: site.email,
  priceRange: "€€",
  foundingDate: String(site.founded),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.zip,
    addressLocality: site.address.city,
    addressRegion: "Nordrhein-Westfalen",
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: 52.4333, longitude: 8.6167 },
  areaServed: site.areas.map((name) => ({ "@type": "City", name })),
  sameAs: [site.instagram],
  makesOffer: site.packages.map((p) => ({
    "@type": "Offer",
    name: `Partyzelt ${site.tent.size} – ${p.name}`,
    description: p.tagline,
    ...(p.price !== null ? { price: p.price, priceCurrency: "EUR" } : {}),
    availability: "https://schema.org/InStock",
    itemOffered: { "@id": `${site.url}/#zelt` },
  })),
};

export const product = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${site.url}/#zelt`,
  name: `Partyzelt ${site.tent.size} mieten`,
  description: `Partyzelt mit ${site.tent.area} m² Grundfläche, bis ca. ${site.tent.standing} Stehplätze, Seitenwände mit Sprossenfenstern. Abholung oder Lieferung mit Aufbauservice in Rahden und Umgebung.`,
  image: `${site.url}/og-image.jpg`,
  brand: { "@type": "Brand", name: "Bakin & Horst" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: Math.min(...site.packages.filter((p) => p.price !== null).map((p) => p.price as number)),
    highPrice: Math.max(...site.packages.filter((p) => p.price !== null).map((p) => p.price as number)),
    offerCount: site.packages.filter((p) => p.price !== null).length,
    seller: { "@id": `${site.url}/#business` },
  },
};

export const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: site.faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
