const NAV_LINK_SELECTOR = '.identity__nav-link';
const SECTION_SELECTOR = 'section[id]';
const ACTIVATION_OFFSET = 100;

function setActiveLink(id: string) {
  document.querySelectorAll<HTMLElement>(NAV_LINK_SELECTOR).forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

export function initScrollspy() {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>(SECTION_SELECTOR),
  ).filter((section) =>
    document.querySelector(`${NAV_LINK_SELECTOR}[href="#${section.id}"]`),
  );

  function updateActiveSection() {
    if (!sections.length) return;

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 1;

    if (atBottom) {
      setActiveLink(sections.at(-1)!.id);
      return;
    }

    let activeSection = sections[0]!;

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
        activeSection = section;
      } else {
        break;
      }
    }

    setActiveLink(activeSection.id);
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);

  updateActiveSection();
}