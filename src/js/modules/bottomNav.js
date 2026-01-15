import { $ } from "../utils/dom.js";

export const initBottomNav = () => {
  const nav = $(".bottom-nav__inner");
  const profileLink = $(".bottom-nav__link[href='#profile-placeholder']");
  const toast = $("[data-toast]");
  const sectionLinks = nav
    ? [...nav.querySelectorAll(".bottom-nav__link[href^='#']")].filter(
        (link) => link.getAttribute("href") !== "#profile-placeholder"
      )
    : [];

  const setActiveLink = (activeLink) => {
    if (!nav) return;
    nav
      .querySelectorAll(".bottom-nav__link")
      .forEach((link) => link.removeAttribute("aria-current"));
    if (activeLink) {
      activeLink.setAttribute("aria-current", "page");
    }
  };

  if (nav) {
    const homeLink = nav.querySelector(".bottom-nav__link[href='#hero']");
    if (homeLink) {
      setActiveLink(homeLink);
    }

    nav.addEventListener("click", (event) => {
      const link = event.target.closest(".bottom-nav__link");
      if (!link) return;
      if (link.hasAttribute("data-form-open")) {
        event.preventDefault();
        return;
      }
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#profile-placeholder") {
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveLink(link);
    });
  }

  if (sectionLinks.length && "IntersectionObserver" in window) {
    const sections = sectionLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const visibility = new Map();

    const updateActiveLink = () => {
      const visibleEntries = [...visibility.values()].filter(
        (entry) => entry.isIntersecting
      );
      if (!visibleEntries.length) {
        setActiveLink(null);
        return;
      }
      const bestEntry = visibleEntries.reduce((best, entry) => {
        if (!best) return entry;
        return entry.intersectionRect.height > best.intersectionRect.height
          ? entry
          : best;
      }, null);
      const activeLink = sectionLinks.find(
        (link) => link.getAttribute("href") === `#${bestEntry.target.id}`
      );
      setActiveLink(activeLink || null);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target, entry);
        });
        updateActiveLink();
      },
      {
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  if (!profileLink || !toast) return;

  profileLink.addEventListener("click", (event) => {
    event.preventDefault();
    toast.classList.add("toast--visible");
    clearTimeout(toast.dataset.timeoutId);
    const timeoutId = setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, 2400);
    toast.dataset.timeoutId = timeoutId;
  });
};
