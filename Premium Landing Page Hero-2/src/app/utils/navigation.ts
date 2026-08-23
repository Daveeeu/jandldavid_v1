export const SECTION_IDS = {
  services: "section-services",
  projects: "section-projects",
  process: "section-process",
  testimonials: "section-testimonials",
  contact: "section-contact",
  faq: "section-faq",
} as const;

export function scrollToSection(id: string, offset = 72) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export function triggerConsultationPreselect() {
  window.dispatchEvent(new CustomEvent("kt:preselect-consultation"));
}

export function scrollToContact() {
  scrollToSection(SECTION_IDS.contact);
}

export function scrollToContactAndConsult() {
  scrollToSection(SECTION_IDS.contact);
  // Slight delay so scroll starts before the form reacts
  setTimeout(() => triggerConsultationPreselect(), 400);
}
