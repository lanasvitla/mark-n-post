(() => {
  const carousel = document.querySelector("[data-direction-carousel]");
  if (!carousel) return;

  const viewport = carousel.querySelector("[data-direction-viewport]");
  const slides = Array.from(carousel.querySelectorAll("[data-direction-slide]"));
  const previous = carousel.querySelector("[data-direction-previous]");
  const next = carousel.querySelector("[data-direction-next]");
  const count = carousel.querySelector("[data-direction-count]");
  const progress = carousel.querySelector("[data-direction-progress]");
  if (!viewport || !slides.length || !previous || !next || !count || !progress) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopAccordion = window.matchMedia("(min-width: 1200px) and (hover: hover) and (pointer: fine)");
  const countryCards = Array.from(carousel.querySelectorAll("[data-direction-card]"));
  let activeIndex = 0;
  let scrollTimer;

  const countryLabel = (country, mode) => ({
    serbia: mode === "in" ? "СЕРБИЮ" : "СЕРБИИ",
    bulgaria: mode === "in" ? "БОЛГАРИЮ" : "БОЛГАРИИ",
    montenegro: mode === "in" ? "ЧЕРНОГОРИЮ" : "ЧЕРНОГОРИИ"
  }[country] || country.toUpperCase());

  const setActiveCountry = (activeCard) => {
    if (!desktopAccordion.matches) return;
    countryCards.forEach((card) => {
      const expanded = card === activeCard;
      card.classList.toggle("is-expanded", expanded);
      card.classList.toggle("is-collapsed", !expanded);
      const tab = card.querySelector("[data-direction-expand]");
      const content = card.querySelector(".direction-card__content");
      if (tab) tab.hidden = expanded;
      if (content) content.setAttribute("aria-hidden", String(!expanded));
      if (expanded && tab && document.activeElement === tab) {
        card.querySelector("[data-direction-mode]")?.focus();
      }
    });
  };

  const renderCountryMode = (card, mode) => {
    const country = card.dataset.country;
    const title = card.querySelector("[data-direction-title]");
    const buttons = Array.from(card.querySelectorAll("[data-direction-mode]"));
    if (title) title.textContent = `${mode === "in" ? "В" : "ИЗ"}\u00a0${countryLabel(country, mode)}`;
    buttons.forEach((button) => {
      const active = button.dataset.directionMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    card.querySelectorAll("[data-direction-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.directionPanel !== mode;
    });
  };

  countryCards.forEach((card) => {
    card.querySelectorAll("[data-direction-mode]").forEach((button) => {
      button.addEventListener("click", () => renderCountryMode(card, button.dataset.directionMode));
    });
    const tab = card.querySelector("[data-direction-expand]");
    if (tab) tab.addEventListener("click", () => setActiveCountry(card));
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") setActiveCountry(card);
    });
    card.addEventListener("focusin", () => setActiveCountry(card));
  });

  const syncAccordionMode = () => {
    if (desktopAccordion.matches) {
      const current = countryCards.find((card) => card.classList.contains("is-expanded")) || countryCards[0];
      setActiveCountry(current);
    } else {
      countryCards.forEach((card) => {
        card.classList.add("is-expanded");
        card.classList.remove("is-collapsed");
        const tab = card.querySelector("[data-direction-expand]");
        const content = card.querySelector(".direction-card__content");
        if (tab) tab.hidden = true;
        if (content) content.removeAttribute("aria-hidden");
      });
    }
  };
  syncAccordionMode();
  desktopAccordion.addEventListener("change", syncAccordionMode);

  const render = (index) => {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    count.textContent = `${activeIndex + 1} / ${slides.length}`;
    progress.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === slides.length - 1;
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-label", `${slideIndex + 1} из ${slides.length}`);
    });
  };

  const currentSlideIndex = () => {
    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    slides.forEach((slide, index) => {
      const bounds = slide.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const goTo = (index) => {
    const targetIndex = Math.max(0, Math.min(index, slides.length - 1));
    const slide = slides[targetIndex];
    const left = slide.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft;
    viewport.scrollTo({ left, behavior: reducedMotion.matches ? "auto" : "smooth" });
    render(targetIndex);
  };

  previous.addEventListener("click", () => goTo(activeIndex - 1));
  next.addEventListener("click", () => goTo(activeIndex + 1));
  viewport.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => render(currentSlideIndex()), 80);
  }, { passive: true });

  render(0);
})();
