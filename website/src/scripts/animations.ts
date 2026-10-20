/**
 * Zentrales Animations- und Interaktionssystem.
 * Progressive Enhancement: Startzustände greifen nur, wenn <html> die Klasse .js-anim trägt (gesetzt im <head>).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const ease = {
  luxe: "expo.out",
  silk: "power3.inOut",
  soft: "power2.out",
};
export const dur = { xs: 0.25, s: 0.5, m: 0.9, l: 1.4, xl: 2 };

const root = document.documentElement;
if (location.hash) history.scrollRestoration = "manual";
root.classList.add("anim-ready");

// Hat der Failsafe im <head> schon gegriffen (Skript kam zu spät), keine Einblend-Animationen mehr starten
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || root.classList.contains("anim-failed");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
// Mobile first: aufwendige Scroll-Effekte nur auf großen Bildschirmen mit Maus
const DESKTOP = "(min-width: 1024px)";
const isDesktop = () => window.matchMedia(DESKTOP).matches;
const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) => ctx.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) => Array.from(ctx.querySelectorAll<T>(sel));

/* ------------------------------------------------------------------ */
/* Lenis (Smooth Scroll) ↔ ScrollTrigger                               */
/* ------------------------------------------------------------------ */
let lenis: Lenis | null = null;
if (!reduced && finePointer) {
  // Nur mit Maus/Trackpad – Touch scrollt nativ (kein Ticker-Aufwand auf dem Handy)
  // lerp statt fester Dauer: folgt dem Mausrad direkt und läuft nur kurz nach (Touch bleibt nativ)
  lenis = new Lenis({ lerp: 0.12 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.addEventListener("refresh", () => lenis?.resize());
}

/** Anker-Ziel sicher auflösen (querySelector wirft bei Hashes wie „#1“) */
function hashTarget(hash: string): HTMLElement | null {
  if (hash.length < 2) return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const el = typeof target === "string" ? hashTarget(target) : target;
  if (el === null) return;
  // Zielposition selbst berechnen (80 px Header-Offset), damit Pin-Spacer & Co. berücksichtigt sind
  const y = typeof el === "number" ? el : Math.max(0, el.getBoundingClientRect().top + window.scrollY - 80);
  if (lenis) {
    lenis.resize(); // Seitenhöhe kann sich durch Pinning geändert haben
    lenis.scrollTo(y, { immediate, force: true });
  }
  else window.scrollTo({ top: y, behavior: reduced || immediate ? "auto" : "smooth" });
}

/* ------------------------------------------------------------------ */
/* Header: Scroll-Zustand, Ein-/Ausblenden                              */
/* ------------------------------------------------------------------ */
const header = $("[data-header]");
if (header) {
  let lastY = window.scrollY;
  let scrolled: boolean | null = null;
  let hidden = false;
  // Nur bei echtem Zustandswechsel ins DOM schreiben
  const update = () => {
    const y = window.scrollY;
    const s = y > 80;
    if (s !== scrolled) header.classList.toggle("is-scrolled", (scrolled = s));
    let h = hidden;
    if (!root.classList.contains("menu-open") && y > 240 && y > lastY + 4) h = true;
    else if (y < lastY - 4 || y < 240) h = false;
    if (h !== hidden) header.classList.toggle("is-hidden", (hidden = h));
    lastY = y;
  };
  if (lenis) lenis.on("scroll", update);
  else window.addEventListener("scroll", update, { passive: true });
  update();
  header.addEventListener("focusin", () => {
    hidden = false;
    header.classList.remove("is-hidden");
  });
}

/* ------------------------------------------------------------------ */
/* Mobiles Menü                                                         */
/* ------------------------------------------------------------------ */
const burger = $<HTMLButtonElement>("[data-burger]");
const mmenu = $("[data-mmenu]");
function setMenu(open: boolean) {
  if (!burger || !mmenu) return;
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  mmenu.classList.toggle("is-open", open);
  root.classList.toggle("menu-open", open);
  // Hintergrund für Tastatur & Screenreader sperren (Dialog)
  $$("main, footer, .fcta").forEach((el) => el.toggleAttribute("inert", open));
  if (open) {
    mmenu.removeAttribute("inert");
    header?.classList.remove("is-hidden");
    lenis?.stop();
    $<HTMLElement>("a", mmenu)?.focus({ preventScroll: true });
  } else {
    mmenu.setAttribute("inert", "");
    lenis?.start();
  }
}
// Wechsel auf Desktop-Breite (z. B. iPad drehen): Menü schließen, sonst bleibt die Seite gesperrt
window.matchMedia(DESKTOP).addEventListener("change", (e) => {
  if (e.matches && root.classList.contains("menu-open")) setMenu(false);
});

/**
 * Breakpoint-Wechsel (z. B. iPad drehen, Fenster verkleinern): gsap.matchMedia baut Pinning & Co. neu auf
 * und setzt dabei die Scrollposition auf 0 zurück. Darum laufend (nach Scroll-Ende) merken, welcher Abschnitt oben
 * sichtbar ist – im alten Layout gemessen –, und ihn nach dem Neuaufbau wiederherstellen.
 */
let scrollAnchor: { el: HTMLElement; ratio: number } | null = null;
let restoring = false;
let anchorTimer = 0;
const isSpacer = (el: Element | null) => !!el?.classList.contains("pin-spacer");
function measureScrollAnchor() {
  const main = $("main");
  const outer = main && window.scrollY > 0 ? $$(":scope > *", main).find((b) => b.getBoundingClientRect().bottom > 0) : undefined;
  if (!outer) return void (scrollAnchor = null);
  const r = outer.getBoundingClientRect();
  // Pin-Spacer verschwindet beim Neuaufbau → den Abschnitt darin merken
  const el = isSpacer(outer) ? (outer.firstElementChild as HTMLElement) : outer;
  scrollAnchor = { el, ratio: r.height ? -r.top / r.height : 0 };
}
window.addEventListener(
  "scroll",
  () => {
    if (restoring) return;
    clearTimeout(anchorTimer);
    anchorTimer = window.setTimeout(measureScrollAnchor, 150);
  },
  { passive: true },
);
let wasDesktop = isDesktop();
window.addEventListener("resize", () => {
  if (isDesktop() === wasDesktop) return;
  wasDesktop = !wasDesktop;
  clearTimeout(anchorTimer);
  const anchor = scrollAnchor;
  if (!anchor) return;
  restoring = true;
  let raf = 0;
  const restore = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const outer = isSpacer(anchor.el.parentElement) ? anchor.el.parentElement! : anchor.el;
      const r = outer.getBoundingClientRect();
      scrollToTarget(Math.max(0, r.top + window.scrollY + anchor.ratio * r.height), true);
    });
  };
  ScrollTrigger.addEventListener("refresh", restore);
  restore();
  // ScrollTrigger vermisst nach Resize verzögert neu → kurz mitlaufen, dann wieder abmelden
  setTimeout(() => {
    ScrollTrigger.removeEventListener("refresh", restore);
    restoring = false;
    measureScrollAnchor();
  }, 1200);
});
burger?.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
document.addEventListener("keydown", (e) => {
  if (!root.classList.contains("menu-open")) return;
  if (e.key === "Escape") {
    setMenu(false);
    burger?.focus();
  } else if (e.key === "Tab" && burger && mmenu) {
    // Fokus-Falle: nur Burger (Schließen) und Menü-Links erreichbar
    const items = [burger, ...$$<HTMLElement>("a[href]", mmenu)];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = i === -1 ? (e.shiftKey ? items.length - 1 : 0) : (i + (e.shiftKey ? -1 : 1) + items.length) % items.length;
    e.preventDefault();
    items[next].focus();
  }
});

/* ------------------------------------------------------------------ */
/* Anker-Links (Lenis, Offset) + Paket-/Anlass-Vorauswahl              */
/* ------------------------------------------------------------------ */
const isHome = !!$("[data-hero-section]");

function preselectPaket(id: string | null) {
  if (!id) return;
  const radio = $<HTMLInputElement>(`input[name="paket"][value="${CSS.escape(id)}"]`);
  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function preselectAnlass(value: string | null) {
  const select = $<HTMLSelectElement>('select[name="anlass"]');
  if (!value || !select || ![...select.options].some((o) => o.value === value)) return;
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

document.addEventListener("click", (e) => {
  // Cmd/Strg/Shift-Klick (neuer Tab/Fenster) nicht abfangen
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
  if (!a || a.classList.contains("skip-link")) return;
  const href = a.getAttribute("href") || "";
  let hash = "";
  let query = "";

  if (href.startsWith("#")) hash = href;
  else if (isHome && href.startsWith("/#")) hash = href.slice(1);
  else if (isHome && /^\/?\?(paket|anlass)=/.test(href)) {
    // z. B. ?paket=event-design#kontakt oder /?anlass=Hochzeit#kontakt
    const [q, h] = href.replace(/^\//, "").split("#");
    query = q;
    hash = h ? `#${h}` : "#kontakt";
  } else return;

  const target = hashTarget(hash);
  if (!target) return;
  e.preventDefault();
  if (root.classList.contains("menu-open")) setMenu(false);
  const params = new URLSearchParams(query);
  preselectPaket(params.get("paket"));
  preselectAnlass(params.get("anlass"));
  history.replaceState(null, "", `${query}${hash}`);
  scrollToTarget(target);
  // Fokus mitnehmen, damit Tastatur & Screenreader im Ziel-Abschnitt weitermachen
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});

$("[data-totop]")?.addEventListener("click", () => {
  scrollToTarget(0);
  ($("#main") as HTMLElement | null)?.focus({ preventScroll: true });
});

/* ------------------------------------------------------------------ */
/* FAQ-Accordion (immer nur einer offen)                                */
/* ------------------------------------------------------------------ */
const faqItems = $$("[data-faq-item]");
if (faqItems.length) {
  // Zuklappen erst, wenn dieses Skript läuft (ohne JS bleiben alle Antworten sichtbar)
  root.classList.add("faq-js");
  faqItems.forEach((item) => $("[data-faq-panel]", item)?.setAttribute("inert", ""));
}
function toggleFaq(item: HTMLElement, open: boolean) {
  const btn = $<HTMLButtonElement>("[data-faq-btn]", item)!;
  const panel = $("[data-faq-panel]", item)!;
  btn.setAttribute("aria-expanded", String(open));
  gsap.killTweensOf(panel);
  // Seitenhöhe ändert sich → Trigger weiter unten neu vermessen
  const done = () => ScrollTrigger.refresh();
  if (open) {
    panel.classList.add("is-open");
    panel.removeAttribute("inert");
    gsap.fromTo(panel, { height: 0 }, { height: "auto", duration: reduced ? 0.01 : 0.7, ease: ease.luxe, onComplete: done });
  } else {
    panel.setAttribute("inert", "");
    gsap.to(panel, {
      height: 0,
      duration: reduced ? 0.01 : 0.5,
      ease: ease.silk,
      onComplete: () => (panel.classList.remove("is-open"), done()),
    });
  }
}
faqItems.forEach((item) => {
  $("[data-faq-btn]", item)?.addEventListener("click", () => {
    const isOpen = $("[data-faq-btn]", item)!.getAttribute("aria-expanded") === "true";
    faqItems.forEach((other) => {
      if (other !== item && $("[data-faq-btn]", other)!.getAttribute("aria-expanded") === "true") toggleFaq(other, false);
    });
    toggleFaq(item, !isOpen);
  });
});

/* ------------------------------------------------------------------ */
/* Anfrageformular                                                      */
/* ------------------------------------------------------------------ */
const form = $<HTMLFormElement>("[data-form]");
if (form) {
  form.noValidate = true;
  const today = new Date();
  const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $$<HTMLInputElement>("[data-min-today]", form).forEach((i) => (i.min = iso));

  const startParams = new URLSearchParams(location.search);
  preselectPaket(startParams.get("paket"));
  preselectAnlass(startParams.get("anlass"));

  const messages: Record<string, (el: HTMLInputElement) => string> = {
    name: () => "Bitte verratet uns euren Namen.",
    email: (el) => (el.value ? "Bitte prüft die E-Mail-Adresse – da scheint etwas zu fehlen." : "Bitte gebt eine E-Mail-Adresse an, damit wir antworten können."),
    wunschtermin: (el) => (el.value ? "Bitte wählt heute oder ein späteres Datum." : "Bitte wählt euren Wunschtermin."),
    ort: () => "Wo soll gefeiert werden?",
    anlass: () => "Bitte wählt einen Anlass.",
    gaeste: () => "Bitte gebt eine Gästezahl zwischen 1 und 150 an.",
    telefon: () => "Bitte prüft die Telefonnummer.",
    paket: () => "Bitte wählt ein Paket – oder „Noch unsicher“.",
  };

  const errEl = (name: string) => {
    const map: Record<string, string> = {
      name: "f-name-err",
      email: "f-email-err",
      telefon: "f-tel-err",
      wunschtermin: "f-date-err",
      ort: "f-ort-err",
      anlass: "f-anlass-err",
      gaeste: "f-gaeste-err",
      paket: "f-paket-err",
    };
    return document.getElementById(map[name] || "");
  };

  const validateField = (el: HTMLInputElement): boolean => {
    const name = el.name;
    const box = el.closest(".field, [data-radio-group]");
    const valid = el.type === "radio" ? !!form.querySelector(`input[name="${name}"]:checked`) : el.checkValidity();
    const err = errEl(name);
    box?.classList.toggle("is-invalid", !valid);
    if (err) err.textContent = valid ? "" : messages[name]?.(el) ?? "Bitte prüft dieses Feld.";
    const fields = el.type === "radio" ? $$<HTMLInputElement>(`input[name="${name}"]`, form) : [el];
    fields.forEach((f) => {
      f.setAttribute("aria-invalid", String(!valid));
      if (err) f.setAttribute("aria-describedby", err.id);
    });
    // Sammel-Hinweis entfernen, sobald alle markierten Felder korrigiert sind
    if (valid && !form.querySelector(".is-invalid")) {
      const status = $("[data-form-status]", form);
      if (status) status.textContent = "";
    }
    return valid;
  };

  const fields = $$<HTMLInputElement>("input:not([type=hidden]):not([name=bot-field]), select, textarea", form);
  fields.forEach((el) => {
    el.addEventListener("blur", () => {
      // Radio/Checkbox haben immer einen value → nur über „change“ validieren
      if (el.type === "radio" || el.type === "checkbox") return;
      if (el.dataset.touched || el.value) {
        el.dataset.touched = "1";
        validateField(el);
      }
    });
    el.addEventListener("change", () => {
      if (el.type === "radio" || el.type === "checkbox" || el.dataset.touched) validateField(el);
    });
    el.addEventListener("input", () => {
      if (el.closest(".is-invalid")) validateField(el);
    });
  });

  const submitBtn = $<HTMLButtonElement>("[data-submit]", form);
  // Demo-Build: Button ist ohne JS gesperrt (nichts wird gesendet); mit JS Validierung zeigen, aber nicht absenden
  const demo = form.hasAttribute("data-demo");
  if (demo && submitBtn) submitBtn.disabled = false;
  let submitting = false;
  // Zurück-Navigation aus dem bfcache (z. B. von /danke): Ladezustand zurücksetzen
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      submitting = false;
      submitBtn?.classList.remove("is-loading");
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (submitting) return;
    const seen = new Set<string>();
    let firstInvalid: HTMLElement | null = null;
    fields.forEach((el) => {
      if (seen.has(el.name)) return;
      seen.add(el.name);
      if (!validateField(el) && !firstInvalid) firstInvalid = el;
    });
    const status = $("[data-form-status]", form);
    if (firstInvalid) {
      if (status) {
        status.classList.remove("is-info");
        status.textContent = "Bitte ergänzt die markierten Felder.";
      }
      form.classList.remove("shake");
      void form.offsetWidth;
      if (!reduced) form.classList.add("shake");
      (firstInvalid as HTMLElement).focus({ preventScroll: true });
      scrollToTarget((firstInvalid as HTMLElement).closest(".field, fieldset") as HTMLElement);
      return;
    }
    if (demo) {
      if (status) {
        status.classList.add("is-info");
        status.textContent = "Alles richtig ausgefüllt. Das ist eine Demo – die Anfrage wurde nicht gesendet.";
      }
      return;
    }
    if (status) status.textContent = "";
    submitting = true;
    submitBtn?.classList.add("is-loading");
    HTMLFormElement.prototype.submit.call(form);
  });
}

/* ------------------------------------------------------------------ */
/* Floating CTA (mobil)                                                 */
/* ------------------------------------------------------------------ */
const fcta = $("[data-fcta]");
const heroSection = $("[data-hero-section]");
const contactSection = $("[data-contact]");
if (fcta && heroSection) {
  let pastHero = false;
  let inContact = false;
  let inFooter = false;
  const sync = () => {
    const show = pastHero && !inContact && !inFooter;
    fcta.classList.toggle("is-visible", show);
    fcta.setAttribute("aria-hidden", String(!show));
    $$("a", fcta).forEach((a) => (show ? a.removeAttribute("tabindex") : a.setAttribute("tabindex", "-1")));
  };
  ScrollTrigger.create({ trigger: heroSection, start: "bottom top+=10", onEnter: () => ((pastHero = true), sync()), onLeaveBack: () => ((pastHero = false), sync()) });
  if (contactSection) {
    ScrollTrigger.create({
      trigger: contactSection,
      start: "top bottom-=80",
      end: "bottom top",
      onToggle: (self) => ((inContact = self.isActive), sync()),
    });
  }
  // Footer: CTA ebenfalls ausblenden
  const footer = $("[data-footer]");
  if (footer) ScrollTrigger.create({ trigger: footer, start: "top bottom", end: "bottom top", onToggle: (s) => ((inFooter = s.isActive), sync()) });
}

/* ------------------------------------------------------------------ */
/* Hilfsfunktionen für Animationen                                      */
/* ------------------------------------------------------------------ */
function splitLines(el: HTMLElement) {
  return SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line", maskClass: "split-mask", aria: "none" } as any);
}

const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]);

/* ------------------------------------------------------------------ */
/* Preloader + Hero-Intro                                               */
/* ------------------------------------------------------------------ */
function heroIntro(): gsap.core.Timeline {
  const tl = gsap.timeline();
  const imgs = $$("[data-hero-img]");
  const inner = $$("[data-hero-parallax] img");
  const eyebrow = $('[data-hero="eyebrow"]');
  const title = $('[data-hero="title"]');
  const fades = $$('[data-hero="fade"]');
  const frames = $$("[data-hero-frame]");
  const drawFrames = () => frames.forEach((f) => f.classList.add("is-drawn"));

  // Mobil: Hero steht sofort ohne Intro (schnellstes LCP, kein Springen nach dem Laden)
  if (!isDesktop()) {
    drawFrames();
    eyebrow?.classList.add("is-in");
    return tl;
  }

  if (reduced) {
    tl.set(imgs, { clipPath: "inset(0% 0% 0% 0%)" });
    tl.to([eyebrow, title, ...fades], { opacity: 1, duration: 0.3 });
    drawFrames();
    eyebrow?.classList.add("is-in");
    return tl;
  }

  tl.fromTo(
    imgs,
    { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: dur.l, ease: ease.luxe, stagger: 0.15 },
    0,
  );
  tl.fromTo(inner, { scale: 1.25 }, { scale: 1, duration: dur.l + 0.4, ease: ease.luxe, stagger: 0.15 }, 0);
  tl.call(drawFrames, [], 0.8);

  if (title) {
    gsap.set(title, { opacity: 1 });
    const split = splitLines(title);
    tl.from(split.lines, { yPercent: 110, duration: 1.2, ease: ease.luxe, stagger: 0.08 }, 0.15);
    const accent = $("[data-shimmer]", title);
    if (accent) {
      tl.fromTo(
        accent,
        { backgroundImage: "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(244,231,198,.95) 50%, transparent 60%, transparent 100%)", backgroundSize: "250% 100%", backgroundPosition: "100% 0" },
        { backgroundPosition: "-50% 0", duration: 1.4, ease: "power2.inOut", clearProps: "backgroundImage,backgroundSize,backgroundPosition" },
        0.9,
      );
    }
  }
  if (eyebrow) {
    tl.to(eyebrow, { opacity: 1, duration: 0.8, ease: ease.soft, onStart: () => eyebrow.classList.add("is-in") }, 0.1);
  }
  tl.fromTo(fades, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: ease.luxe, stagger: 0.1 }, 0.55);

  // Scroll-Indikator: Lichtpunkt läuft die Linie herunter
  const dot = $("[data-scroll-dot]");
  const hero = $("[data-hero-section]");
  if (dot && hero) {
    const loop = gsap.fromTo(dot, { yPercent: -100 }, { yPercent: 460, duration: 2, ease: "power1.inOut", repeat: -1, delay: 1.5 });
    // nur laufen lassen, solange die Hero sichtbar ist
    ScrollTrigger.create({ trigger: hero, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? loop.resume() : loop.pause()) });
  }
  return tl;
}

function preloaderTimeline(): gsap.core.Timeline {
  const pre = $("[data-preloader]")!;
  const logo = $("#preloader-logo")!;
  const finish = () => {
    root.classList.remove("js-preload");
    pre.remove();
    lenis?.start();
    // Scrollbar ist jetzt wieder da → Layoutbreite kann sich geändert haben
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  const tl = gsap.timeline();

  if (reduced) {
    tl.fromTo(logo, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .to(pre, { opacity: 0, duration: 0.3, delay: 0.3 })
      .call(finish)
      .add(heroIntro(), "-=0.1");
    return tl;
  }

  lenis?.stop();
  const top = $('[data-logo-corner="top"]', logo)!;
  const bottom = $('[data-logo-corner="bottom"]', logo)!;
  const b = $("[data-logo-b]", logo)!;
  const divider = $("[data-logo-divider]", logo)!;
  const h = $("[data-logo-h]", logo)!;
  const shine = $("[data-logo-shine]", logo)!;
  const letters = $$("[data-logo-word] text", logo);
  const rules = $$("[data-logo-rule]", logo);
  const sub = $("[data-logo-sub] text", logo)!;
  const verleih = $("[data-logo-verleih]", logo)!;

  gsap.set([top, bottom], { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set([b, h], { opacity: 0, y: 30, filter: "blur(8px)" });
  gsap.set(divider, { scaleY: 0, transformOrigin: "50% 50%" });
  gsap.set(rules[0], { scaleX: 0, transformOrigin: "100% 50%" });
  gsap.set(rules[1], { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set([sub, verleih], { opacity: 0 });
  letters.forEach((l) => {
    const x = parseFloat(l.dataset.x || "0");
    gsap.set(l, { attr: { x: 320 + (x - 320) * 1.45 }, opacity: 0 });
  });

  tl.to(top, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0)
    .to(b, { opacity: 1, y: 0, filter: "blur(0px)", duration: dur.m, ease: ease.luxe }, 0.3)
    .to(divider, { scaleY: 1, duration: 0.7, ease: ease.luxe }, 0.45)
    .to(h, { opacity: 1, y: 0, filter: "blur(0px)", duration: dur.m, ease: ease.luxe }, 0.6)
    .fromTo(shine, { attr: { x1: 250, x2: 330 } }, { attr: { x1: 520, x2: 600 }, duration: 0.9, ease: "power2.inOut" }, 0.95)
    .to(
      letters,
      { attr: { x: (_i: number, el: Element) => parseFloat((el as HTMLElement).dataset.x || "0") }, opacity: 1, duration: 0.9, ease: ease.luxe, stagger: 0.03 },
      0.9,
    )
    .to(rules, { scaleX: 1, duration: 0.7, ease: ease.luxe }, 1.2)
    .to(sub, { opacity: 1, duration: 0.6 }, 1.25)
    .to(bottom, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 1.4)
    .to(verleih, { opacity: 1, duration: 0.5 }, 1.45)
    .to(logo, { scale: 0.9, opacity: 0, duration: 0.6, ease: ease.silk, transformOrigin: "50% 50%" }, 1.8)
    .to(pre, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: ease.silk }, 1.8)
    .add(heroIntro(), 2.1)
    .call(finish, [], 2.7);
  return tl;
}

/* ------------------------------------------------------------------ */
/* Standard-Reveals (data-anim)                                         */
/* ------------------------------------------------------------------ */
function setupReveals() {
  const start = "top 85%";
  const simple = (el: Element) =>
    gsap.to(el, { opacity: 1, duration: 0.3, scrollTrigger: { trigger: el, start, once: true } });

  $$("[data-anim]").forEach((el) => {
    if (el.closest("[data-hero-section]") || el.hasAttribute("data-anim-skip")) return;
    const type = el.dataset.anim;

    if (reduced) {
      if (type === "stagger") gsap.to(el.children, { opacity: 1, duration: 0.3, scrollTrigger: { trigger: el, start, once: true } });
      else if (type === "eyebrow") ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => (el.classList.add("is-in"), gsap.to(el, { opacity: 1, duration: 0.3 })) });
      else if (type === "line-x" || type === "line-y") gsap.set(el, { scale: 1 });
      else simple(el);
      return;
    }

    switch (type) {
      case "fade-up":
        gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: ease.luxe, scrollTrigger: { trigger: el, start, once: true } });
        break;
      case "eyebrow":
        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: () => {
            el.classList.add("is-in");
            gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, ease: ease.luxe });
          },
        });
        break;
      case "lines": {
        gsap.set(el, { opacity: 1 });
        // autoSplit: Zeilen nach Font-Load/Resize neu berechnen (Animation wird übernommen)
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          maskClass: "split-mask",
          aria: "none",
          autoSplit: true,
          onSplit: (self: SplitText) =>
            gsap.from(self.lines, { yPercent: 110, duration: 1.2, ease: ease.luxe, stagger: 0.08, scrollTrigger: { trigger: el, start, once: true } }),
        } as any);
        break;
      }
      case "words": {
        gsap.set(el, { opacity: 1 });
        const split = SplitText.create(el, { type: "words", aria: "none" } as any);
        gsap.from(split.words, { opacity: 0, y: 18, duration: 1.1, ease: ease.luxe, stagger: 0.06, scrollTrigger: { trigger: el, start, once: true } });
        break;
      }
      case "image":
        gsap.fromTo(el, { opacity: 1, clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: dur.l, ease: ease.luxe, scrollTrigger: { trigger: el, start, once: true } });
        gsap.fromTo($$("img", el), { scale: 1.2 }, { scale: 1, duration: dur.l + 0.4, ease: ease.luxe, scrollTrigger: { trigger: el, start, once: true } });
        break;
      case "line-x":
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 1.4, ease: ease.luxe, scrollTrigger: { trigger: el, start, once: true } });
        break;
      case "line-y":
        gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, transformOrigin: "top center", duration: 1.6, ease: ease.luxe, scrollTrigger: { trigger: el, start, once: true } });
        break;
      case "stagger":
        gsap.fromTo(el.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: ease.luxe, stagger: 0.08, scrollTrigger: { trigger: el, start, once: true } });
        break;
    }
  });

  // Corner-Frames zeichnen sich
  $$("[data-frame-anim]").forEach((frame) => {
    if (frame.hasAttribute("data-hero-frame")) return;
    if (reduced) return void frame.classList.add("is-drawn");
    ScrollTrigger.create({ trigger: frame, start: "top 80%", once: true, onEnter: () => frame.classList.add("is-drawn") });
  });

  // Parallax (data-speed)
  if (!reduced) {
    $$("[data-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.speed || "1");
      gsap.to(el, { yPercent: (1 - speed) * 100, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }
}

/* ------------------------------------------------------------------ */
/* Sektions-spezifische Animationen                                     */
/* ------------------------------------------------------------------ */
function setupHeroScroll(mm: gsap.MatchMedia) {
  const hero = $("[data-hero-section]");
  if (!hero || reduced) return;
  mm.add(DESKTOP, () => setupHeroParallax(hero));
}
function setupHeroParallax(hero: HTMLElement) {
  const big = $('[data-hero-parallax="big"]');
  const small = $('[data-hero-parallax="small"]');
  const text = $("[data-hero-text]");
  const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  // Bild-Ebenen haben 8 % Überstand (Hero.astro) → Verschiebung bleibt innerhalb des Rahmens
  if (big) gsap.to(big, { yPercent: 6, ease: "none", scrollTrigger: st });
  if (small) gsap.to(small, { yPercent: -6, ease: "none", scrollTrigger: st });
  if (text) gsap.to(text, { y: -60, opacity: 0.2, ease: "none", scrollTrigger: st });
}

function setupStats() {
  $$("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count || "0", 10);
    const item = el.closest(".stats__item") as HTMLElement | null;
    if (reduced) return void (item && gsap.set(item, { "--div-scale": 1 }));
    const obj = { v: 0 };
    el.textContent = "0";
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, { v: target, duration: 1.8, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(obj.v))) });
        if (item) gsap.fromTo(item, { "--div-scale": 0 }, { "--div-scale": 1, duration: 1.4, ease: ease.luxe });
      },
    });
  });
}

function setupPackagesEntrance() {
  const cards = $$("[data-pk-card]");
  if (!cards.length) return;
  if (reduced) return void gsap.to(cards, { opacity: 1, duration: 0.3, scrollTrigger: { trigger: cards[0], start: "top 85%", once: true } });
  const desk = isDesktop();
  gsap.fromTo(
    cards,
    // 3D-Kippen nur am Desktop, mobil schlichter Fade
    desk ? { y: 80, rotateX: 8, opacity: 0, transformPerspective: 1200 } : { y: 30, opacity: 0 },
    { y: 0, rotateX: 0, opacity: 1, duration: desk ? 1.3 : 0.9, ease: ease.luxe, stagger: desk ? 0.12 : 0.06, scrollTrigger: { trigger: cards[0].parentElement, start: "top 85%", once: true } },
  );
}

function setupTeaser(mm: gsap.MatchMedia) {
  const clip = $("[data-teaser-clip]");
  const img = $("[data-teaser-img]");
  if (!clip || !img || reduced) return;
  // Einmaliger Reveal statt Scrub: clip-path wird nur kurz animiert, nicht bei jedem Scroll-Frame neu gezeichnet
  gsap.fromTo(
    clip,
    { clipPath: "inset(14% 22% 14% 22%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: ease.luxe, scrollTrigger: { trigger: clip.parentElement, start: "top 70%", once: true } },
  );
  // Parallaxe nur am Desktop (mm: wird beim Wechsel auf Mobil, z. B. iPad drehen, sauber entfernt)
  mm.add(DESKTOP, () => {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: clip.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
}

function setupArea() {
  const map = $("[data-area-map]");
  if (!map || reduced) return;
  const lines = $$("[data-area-line]", map);
  const places = $$("[data-area-place]", map);
  gsap.set(lines, { strokeDashoffset: 1 });
  gsap.set(places, { opacity: 0, scale: 0.6, transformOrigin: "center", transformBox: "fill-box" } as gsap.TweenVars);
  const tl = gsap.timeline({ scrollTrigger: { trigger: map, start: "top 75%", once: true } });
  tl.to(lines, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", stagger: 0.12 }, 0).to(
    places,
    { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(2)", stagger: 0.12 },
    0.5,
  );
}

function setupFooter(mm: gsap.MatchMedia) {
  const footer = $("[data-footer]");
  if (!footer) return;
  const corners = $$("#footer-logo [data-logo-corner]");
  const type = $("[data-footer-type]");
  if (reduced) return;
  gsap.set(corners, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.to(corners, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.3, scrollTrigger: { trigger: footer, start: "top 75%", once: true } });
  if (type)
    mm.add(DESKTOP, () => {
      gsap.fromTo(type, { xPercent: 5 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true } });
    });
}

function setupProcess(mm: gsap.MatchMedia) {
  const wrap = $("[data-process-list]");
  const fill = $("[data-process-fill]");
  if (!wrap || !fill) return;
  const dots = $$("[data-step-dot]", wrap);
  const bodies = $$("[data-step-body]", wrap);

  if (reduced) return;

  mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (ctx) => {
    const desktop = ctx.conditions?.desktop;
    gsap.set(dots, { scale: 0 });
    gsap.set(bodies, { opacity: 0, y: 20 });
    const state = dots.map(() => false);
    const shown = bodies.map(() => false);
    gsap.fromTo(
      fill,
      desktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
      {
        ...(desktop ? { scaleX: 1 } : { scaleY: 1 }),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: desktop ? "top 70%" : "top 65%",
          end: desktop ? "top 25%" : "bottom 60%",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            dots.forEach((dot, i) => {
              const reached = p >= i / (dots.length - 1) - 0.001;
              if (reached !== state[i]) {
                state[i] = reached;
                gsap.to(dot, { scale: reached ? 1 : 0, duration: 0.6, ease: reached ? "back.out(2)" : "power2.out" });
              }
              if (reached && !shown[i]) {
                shown[i] = true;
                gsap.to(bodies[i], { opacity: 1, y: 0, duration: 0.9, ease: ease.luxe });
              }
            });
          },
        },
      },
    );
    // Falls weit nach unten gesprungen wird (Anker): Inhalte zeigen
    ScrollTrigger.create({ trigger: wrap, start: "bottom top", once: true, onEnter: () => gsap.to(bodies, { opacity: 1, y: 0 }) });
  });
}

function setupTent(mm: gsap.MatchMedia) {
  const section = $("[data-tent]");
  if (!section || reduced) return;
  const chapters = $$("[data-tent-chapter]", section);
  const imgs = $$("[data-tent-img]", section);
  const bar = $("[data-tent-bar]", section);
  const count = $("[data-tent-count]", section);

  // Wischbare Galerie ist mobil per Tastatur scrollbar; gepinnt am Desktop wäre der Tab-Stopp funktionslos
  const gallery = $(".tent__media", section);

  mm.add("(min-width: 1024px)", () => {
    root.classList.add("tent-pinned");
    gallery?.removeAttribute("tabindex");
    chapters.forEach((c) => c.setAttribute("data-anim-skip", ""));
    // Nach Wechsel von Mobil: dort angelegte Fade-ups der Kapitel entfernen, sonst sind alle gleichzeitig sichtbar
    ScrollTrigger.getAll().forEach((t) => chapters.includes(t.trigger as HTMLElement) && t.kill());
    gsap.killTweensOf(chapters);
    gsap.set(chapters, { opacity: 0, yPercent: 30 });
    gsap.set(chapters[0], { opacity: 1, yPercent: 0 });
    gsap.set(imgs[1], { clipPath: "circle(0% at 70% 50%)" });

    let current = 0;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: true, // Lenis glättet bereits; kein Snap (kämpft gegen Lenis)
        refreshPriority: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = self.progress < 0.25 ? 0 : self.progress < 0.75 ? 1 : 2;
          if (idx !== current && count) {
            current = idx;
            count.textContent = `0${idx + 1}`;
          }
        },
      },
    });
    tl.to($("img", imgs[0]), { scale: 1.12, duration: 2 }, 0)
      .to(chapters[0], { opacity: 0, yPercent: -30, duration: 0.3 }, 0.3)
      .to(chapters[1], { opacity: 1, yPercent: 0, duration: 0.3 }, 0.45)
      .to(chapters[1], { opacity: 0, yPercent: -30, duration: 0.3 }, 1.3)
      .to(chapters[2], { opacity: 1, yPercent: 0, duration: 0.3 }, 1.45)
      .to(imgs[1], { clipPath: "circle(150% at 70% 50%)", duration: 0.7, ease: "power2.inOut" }, 1.2)
      .fromTo($("img", imgs[1]), { scale: 1.15 }, { scale: 1, duration: 0.8 }, 1.2);
    if (bar) tl.fromTo(bar, { scaleX: 1 / 3 }, { scaleX: 1, duration: 2 }, 0);

    ScrollTrigger.sort();
    return () => {
      root.classList.remove("tent-pinned");
      gallery?.setAttribute("tabindex", "0");
      chapters.forEach((c) => c.removeAttribute("data-anim-skip"));
      gsap.set(chapters, { opacity: 1, yPercent: 0 });
    };
  });
}

/* ------------------------------------------------------------------ */
/* Desktop-Interaktionen: Tilt, Magnet, Cursor                          */
/* ------------------------------------------------------------------ */
function setupTilt(signal: AbortSignal) {
  const resets: (() => void)[] = [];
  $$("[data-pk-tilt]").forEach((card) => {
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
    gsap.set(card, { transformPerspective: 900 });
    // Rect nur beim Betreten messen, nicht bei jeder Bewegung (kein Layout-Thrashing)
    let r: DOMRect | null = null;
    resets.push(() => (r = null));
    card.addEventListener("pointerenter", () => (r = card.getBoundingClientRect()), { signal });
    card.addEventListener(
      "pointermove",
      (e) => {
        r ??= card.getBoundingClientRect();
        const px = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width);
        const py = gsap.utils.clamp(0, 1, (e.clientY - r.top) / r.height);
        ry((px - 0.5) * 12);
        rx(-(py - 0.5) * 12);
        card.style.setProperty("--gx", `${px * 100}%`);
        card.style.setProperty("--gy", `${py * 100}%`);
      },
      { signal },
    );
    card.addEventListener(
      "pointerleave",
      () => {
        r = null;
        rx(0);
        ry(0);
      },
      { signal },
    );
  });
  // Beim Scrollen verschiebt sich die Karte unter dem Zeiger → Rect bei der nächsten Bewegung neu messen
  const reset = () => resets.forEach((fn) => fn());
  if (lenis) {
    lenis.on("scroll", reset);
    signal.addEventListener("abort", () => lenis?.off("scroll", reset));
  }
}

function setupMagnetic(signal: AbortSignal) {
  const radius = 60;
  const max = 10;
  // Positionen zwischenspeichern (Seiten-Koordinaten bzw. Viewport bei fixierten Elementen) statt bei jeder Mausbewegung zu messen
  const items = $$("[data-magnetic]").map((el) => ({
    el,
    fixed: !!el.closest("[data-header], [data-fcta]"),
    cx: 0,
    cy: 0,
    hw: 0,
    hh: 0,
    x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" }),
    y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" }),
    active: false,
  }));
  const measure = () => {
    for (const it of items) {
      gsap.set(it.el, { x: 0, y: 0 });
      it.active = false;
      const r = it.el.getBoundingClientRect();
      const oy = it.fixed ? 0 : window.scrollY;
      it.hw = r.width / 2;
      it.hh = r.height / 2;
      it.cx = r.left + it.hw;
      it.cy = r.top + it.hh + oy;
    }
  };
  measure();
  ScrollTrigger.addEventListener("refresh", measure);
  signal.addEventListener("abort", () => ScrollTrigger.removeEventListener("refresh", measure));

  window.addEventListener(
    "pointermove",
    (e) => {
      const sy = window.scrollY;
      const headerHidden = header?.classList.contains("is-hidden");
      for (const it of items) {
        if (it.hw === 0 || (it.fixed && headerHidden)) continue;
        const dx = e.clientX - it.cx;
        const dy = e.clientY + (it.fixed ? 0 : sy) - it.cy;
        const inside = Math.abs(dx) < it.hw + radius && Math.abs(dy) < it.hh + radius;
        if (inside) {
          it.active = true;
          it.x((dx / (it.hw + radius)) * max);
          it.y((dy / (it.hh + radius)) * max);
        } else if (it.active) {
          it.active = false;
          gsap.to(it.el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
        }
      }
    },
    { passive: true, signal },
  );
}

function setupCursor() {
  const cursor = $("[data-cursor]");
  if (!cursor) return;
  root.classList.add("has-cursor");
  const dot = $("[data-cursor-dot]", cursor)!;
  const ring = $("[data-cursor-ring]", cursor)!;
  const text = $("[data-cursor-text]", cursor)!;
  const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
  const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      cursor.classList.add("is-visible");
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    },
    { passive: true },
  );
  document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  document.addEventListener("pointerover", (e) => {
    const t = e.target as HTMLElement;
    const labelEl = t.closest<HTMLElement>("[data-cursor-label]");
    const link = t.closest("a, button, label, select, [role=button]");
    if (labelEl && !link) {
      cursor.classList.add("is-label");
      cursor.classList.remove("is-link");
      text.textContent = labelEl.dataset.cursorLabel || "";
    } else {
      cursor.classList.remove("is-label");
      cursor.classList.toggle("is-link", !!link);
    }
  });
}

/* ------------------------------------------------------------------ */
/* Paket-Karussell (mobil): Punkte zeigen/steuern die sichtbare Karte    */
/* ------------------------------------------------------------------ */
function setupPackageDots() {
  const track = $("[data-pk-track]");
  const dots = $$<HTMLButtonElement>("[data-pk-dot]");
  if (!track || !dots.length) return;
  const cards = $$("[data-pk-card]", track);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = cards.indexOf(en.target as HTMLElement);
        dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
      });
    },
    { root: track, threshold: 0.6 },
  );
  cards.forEach((c) => io.observe(c));
  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      track.scrollTo({ left: cards[i].offsetLeft - pad, behavior: reduced ? "auto" : "smooth" });
    }),
  );
}

/* ------------------------------------------------------------------ */
/* Bildansicht: Fotos mit „Ansehen“-Cursor öffnen sich groß              */
/* ------------------------------------------------------------------ */
function setupLightbox() {
  const box = $<HTMLDialogElement>("[data-lightbox]");
  const figure = $("[data-lightbox-figure]", box ?? document);
  if (!box || !figure || typeof box.showModal !== "function") return;

  const open = (picture: HTMLPictureElement) => {
    const clone = picture.cloneNode(true) as HTMLPictureElement;
    // Größere Variante aus dem vorhandenen srcset wählen lassen
    $$("source, img", clone).forEach((el) => el.setAttribute("sizes", "100vw"));
    const img = $<HTMLImageElement>("img", clone);
    if (img) {
      img.loading = "eager";
      img.removeAttribute("fetchpriority");
      img.removeAttribute("style");
    }
    figure.replaceChildren(clone);
    box.showModal();
    lenis?.stop();
    root.classList.add("lightbox-open");
    requestAnimationFrame(() => box.classList.add("is-open"));
  };
  const close = () => {
    if (!box.open) return;
    box.classList.remove("is-open");
    setTimeout(() => {
      box.close();
      figure.replaceChildren();
    }, reduced ? 0 : 350);
  };

  box.addEventListener("close", () => {
    box.classList.remove("is-open");
    figure.replaceChildren();
    lenis?.start();
    root.classList.remove("lightbox-open");
  });
  box.addEventListener("cancel", (e) => (e.preventDefault(), close()));
  // Klick neben das Bild oder auf das X schließt
  box.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest("img") || (e.target as HTMLElement).closest("[data-lightbox-close]")) close();
  });

  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const media = t.closest<HTMLElement>("[data-lightbox-media]");
    if (!media || t.closest("a, button")) return;
    // Mobil ist das Hero-Foto nur Hintergrund
    if (media.hasAttribute("data-hero-img") && !isDesktop()) return;
    const picture = t.closest("picture") ?? $<HTMLPictureElement>("picture", media);
    if (picture) open(picture as HTMLPictureElement);
  });
  // Tastatur: Zelt-Galerie ist fokussierbar → Enter öffnet das erste sichtbare Foto
  document.addEventListener("keydown", (e) => {
    const media = (e.target as HTMLElement).closest?.<HTMLElement>("[data-lightbox-media]");
    if (!media || (e.key !== "Enter" && e.key !== " ")) return;
    const pictures = $$<HTMLPictureElement>("picture", media);
    const mr = media.getBoundingClientRect();
    const visible = pictures.find((p) => {
      const r = p.getBoundingClientRect();
      return r.left >= mr.left - 2 && r.left < mr.right - r.width / 2;
    });
    if (visible ?? pictures[0]) {
      e.preventDefault();
      open((visible ?? pictures[0])!);
    }
  });
}
setupLightbox();

/* ------------------------------------------------------------------ */
/* Start                                                                */
/* ------------------------------------------------------------------ */
async function init() {
  await fontsReady;
  const mm = gsap.matchMedia();

  // Pinning zuerst, damit nachfolgende Trigger korrekt messen
  setupTent(mm);
  setupReveals();
  setupHeroScroll(mm);
  setupPackageDots();
  setupStats();
  setupPackagesEntrance();
  setupProcess(mm);
  setupTeaser(mm);
  setupArea();
  setupFooter(mm);

  if (!reduced) {
    mm.add("(hover: hover) and (pointer: fine) and (min-width: 1024px)", () => {
      // Listener sauber entfernen, wenn die Bedingung wegfällt (sonst doppelt nach Breakpoint-Wechsel)
      const ac = new AbortController();
      setupTilt(ac.signal);
      setupMagnetic(ac.signal);
      return () => ac.abort();
    });
    if (finePointer) setupCursor();
  }

  // Direkt-Einstieg mit Anker (z. B. /?paket=event-design#kontakt): kein Preloader
  const startTarget = hashTarget(location.hash);
  if (startTarget && root.classList.contains("js-preload")) {
    root.classList.remove("js-preload");
    $("[data-preloader]")?.remove();
  }

  // Intro
  if (isHome) {
    if (root.classList.contains("js-preload") && $("[data-preloader]")) preloaderTimeline();
    else heroIntro();
  }
  ScrollTrigger.refresh();
  const afterLoad = () => {
    ScrollTrigger.refresh();
    if (startTarget) requestAnimationFrame(() => scrollToTarget(startTarget, true));
  };
  if (document.readyState === "complete") afterLoad();
  else window.addEventListener("load", afterLoad, { once: true });
  // Spät geladene Schriften ändern Zeilenhöhen → Trigger neu vermessen
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  // Endlos-Animationen (CSS) außerhalb des Viewports pausieren
  const io = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle("is-offscreen", !en.isIntersecting)));
  $$("[data-loop]").forEach((el) => io.observe(el));
}

init().catch((err) => {
  // Notfall: nie eine leere/verdeckte Seite hinterlassen
  console.error(err);
  root.classList.remove("js-anim", "js-preload");
  $("[data-preloader]")?.remove();
  lenis?.start();
});
