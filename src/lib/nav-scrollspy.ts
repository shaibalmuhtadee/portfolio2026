const NAV_LINK_SELECTOR = '.identity__nav-link';
const SECTION_SELECTOR = 'section[id]';

function setActiveLink(id: string) {
  document.querySelectorAll<HTMLElement>(NAV_LINK_SELECTOR).forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${id}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

export function initScrollspy() {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>(SECTION_SELECTOR),
  ).filter((section) =>
    document.querySelector(`a[href="#${section.id}"]`),
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    },
    { threshold: 0, rootMargin: '-80px 0px -60% 0px' },
  );

  sections.forEach((section) => observer.observe(section));

  document.querySelectorAll<HTMLElement>(NAV_LINK_SELECTOR).forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) setActiveLink(href.slice(1));
    });
  });

  setActiveLink(sections[0]?.id ?? '');
}
