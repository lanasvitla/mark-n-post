const quoteForm = document.querySelector(".quote-strip");
const requestForm = document.querySelector(".request-form");
const typeSelect = document.querySelector("#type");
const contactsSection = document.querySelector("#contacts");
const motoImage = document.querySelector(".moto-strip__image");
const telegramUsername = "MarknPost";
const whatsappPhone = "995511282228";
const telegramFieldLabels = {
  from: "Откуда",
  to: "Куда",
  type: "Тип отправления",
  weight: "Примерный вес",
  details: "Что отправить",
  destination: "Куда",
  "request-weight": "Примерный вес",
  contact: "Контакт",
};
const telegramTemplates = {
  moving: [
    "Здравствуйте!",
    "",
    "Хочу обсудить перевозку личных вещей из Грузии в Россию с Mark’n’Post.",
    "",
    "Данные отправления:",
    "Что отправить: личные вещи при переезде",
    "Откуда: [город в Грузии]",
    "Куда: [город в России]",
    "Примерный объем / вес: [указать]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  shop: [
    "Здравствуйте!",
    "",
    "Хочу узнать условия доставки заказа из интернет-магазина из Грузии в Россию через Mark’n’Post.",
    "",
    "Данные отправления:",
    "Магазин: [Ozon / другой]",
    "Что нужно получить: [указать]",
    "Откуда: [город в Грузии]",
    "Куда доставить: [город в России]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "delivery-details": [
    "Здравствуйте!",
    "",
    "Хочу получить расчет доставки из Грузии в Россию через Mark’n’Post.",
    "",
    "Данные отправления:",
    "Направление: Грузия → Россия",
    "Тип отправления: [посылка / документы / переезд / заказ / упаковка]",
    "Примерный вес: [указать]",
    "Размеры: [указать]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "hero-calculation": [
    "Здравствуйте! Хочу рассчитать стоимость доставки из Грузии в Россию с Mark’n’Post.",
    "",
    "Подскажите, пожалуйста, какие данные нужно прислать для расчёта стоимости и срока.",
  ].join("\n"),
  "service-contact": [
    "Здравствуйте!",
    "",
    "Хочу уточнить услугу Mark’n’Post.",
    "",
    "Интересует доставка из Грузии в Россию. Подскажите, пожалуйста, какой формат подойдет для моей задачи.",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "direction-check": [
    "Здравствуйте!",
    "",
    "Хочу уточнить доставку из Грузии в Россию через Mark’n’Post.",
    "",
    "Данные отправления:",
    "Откуда: [город в Грузии]",
    "Куда: [город в России]",
    "Тип отправления: [посылка / документы / переезд / заказ]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "handoff-contact": [
    "Здравствуйте!",
    "",
    "Хочу согласовать передачу отправления из Грузии в Россию в Mark’n’Post.",
    "",
    "Данные отправления:",
    "Тип отправления: [указать]",
    "Когда удобно передать: [дата / время]",
    "Комментарий: [указать]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "packing-order": [
    "Здравствуйте!",
    "",
    "Хочу подобрать упаковку для отправления из Грузии в Россию в Mark’n’Post.",
    "",
    "Что нужно:",
    "Коробки / материалы: [указать]",
    "Количество: [указать]",
    "Для чего: [посылка / документы / переезд]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
};
function openExternalLink(url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.append(link);
  link.click();
  link.remove();
}

function getTelegramMessageUrl(message = "") {
  const textParam = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://t.me/${telegramUsername}${textParam}`;
}

function getWhatsAppMessageUrl(message) {
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
}

function openTelegramMessage(message) {
  openExternalLink(getTelegramMessageUrl(message));
}

function openWhatsAppMessage(message) {
  openExternalLink(getWhatsAppMessageUrl(message));
}

function setBlankExternalLink(link) {
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}

document.querySelectorAll('a[href^="http"]').forEach(setBlankExternalLink);

document.querySelectorAll("[data-telegram-template]").forEach((link) => {
  const message = telegramTemplates[link.dataset.telegramTemplate];
  if (!message) return;

  link.href = getTelegramMessageUrl(message);
  setBlankExternalLink(link);
});

document.querySelectorAll("[data-whatsapp-template]").forEach((link) => {
  const message = telegramTemplates[link.dataset.whatsappTemplate];
  if (!message) return;

  link.href = getWhatsAppMessageUrl(message);
  setBlankExternalLink(link);
});

function rotateReviewImage(card) {
  const image = card.querySelector("[data-review-image]");
  const sources = (card.dataset.reviewGallery || "")
    .split(",")
    .map((source) => source.trim())
    .filter(Boolean);
  if (!image || sources.length < 2 || card.dataset.paused === "true") return;

  const nextIndex = ((Number(card.dataset.reviewIndex) || 0) + 1) % sources.length;
  const nextSource = sources[nextIndex];
  const preload = new Image();

  image.classList.add("is-changing");
  preload.onload = () => {
    card.dataset.reviewIndex = String(nextIndex);
    image.src = nextSource;
    image.classList.remove("is-changing");
  };
  preload.onerror = () => image.classList.remove("is-changing");
  preload.src = nextSource;
}

document.querySelectorAll("[data-review-gallery]").forEach((card) => {
  const interval = Number(card.dataset.reviewInterval) || 14000;
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (supportsHover) {
    card.addEventListener("mouseenter", () => {
      card.dataset.paused = "true";
    });

    card.addEventListener("mouseleave", () => {
      card.dataset.paused = "false";
    });
  }

  window.setInterval(() => rotateReviewImage(card), interval);
});


function initReviewMarquee(marquee) {
  const viewport = marquee.querySelector(".review-marquee-window");
  const track = marquee.querySelector("[data-review-marquee-track]");
  const dotsHost = marquee.querySelector("[data-review-marquee-dots]");
  const toggle = marquee.querySelector("[data-review-marquee-toggle]");
  if (!viewport || !track || !dotsHost || !toggle) return;

  const slides = Array.from(track.querySelectorAll("[data-review-slide]"));
  if (slides.length === 0) return;

  const desktopMedia = window.matchMedia("(min-width: 721px)");
  const reduceMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  const autoplaySpeed = 24;

  slides.forEach((slide, index) => {
    slide.dataset.reviewIndex = String(index);
  });

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "review-marquee-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать материал ${index + 1}`);
    dotsHost.appendChild(dot);
    return dot;
  });

  let activeIndex = 0;
  let autoplayFrame = null;
  let autoplayLastTime = null;
  let autoplayPosition = null;
  let scrollFrame = null;
  let focusPauseFrame = null;
  let skipNextFocusPause = false;
  let isVisible = false;
  let isManuallyPaused = false;

  function updateToggle() {
    toggle.dataset.state = isManuallyPaused ? "play" : "pause";
    toggle.setAttribute(
      "aria-label",
      isManuallyPaused
        ? "Продолжить автоматическую прокрутку"
        : "Приостановить автоматическую прокрутку",
    );
    toggle.hidden = reduceMotionMedia.matches || !desktopMedia.matches;
  }

  function setActiveDot(nextIndex) {
    if (nextIndex === activeIndex && dots[nextIndex]?.classList.contains("is-active")) return;
    dots[activeIndex]?.classList.remove("is-active");
    dots[activeIndex]?.removeAttribute("aria-current");
    dots[nextIndex]?.classList.add("is-active");
    dots[nextIndex]?.setAttribute("aria-current", "true");
    activeIndex = nextIndex;
  }

  function orderedSlides() {
    return Array.from(track.querySelectorAll("[data-review-slide]"));
  }

  function slideTargetLeftForElement(slide) {
    const viewportRect = viewport.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const paddingLeft = Number.parseFloat(window.getComputedStyle(viewport).paddingLeft) || 0;
    return Math.max(0, viewport.scrollLeft + slideRect.left - viewportRect.left - paddingLeft);
  }

  function setScrollLeftInstant(left) {
    const previousScrollBehavior = viewport.style.scrollBehavior;
    viewport.style.scrollBehavior = "auto";
    viewport.scrollLeft = Math.max(0, left);
    viewport.style.scrollBehavior = previousScrollBehavior;
  }

  function hasEnoughContentAfter(slide) {
    const viewportStyles = window.getComputedStyle(viewport);
    const paddingLeft = Number.parseFloat(viewportStyles.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(viewportStyles.paddingRight) || 0;
    const availableWidth = viewport.clientWidth - paddingLeft - paddingRight;
    const trackRight = track.getBoundingClientRect().right;

    return trackRight - slide.getBoundingClientRect().left >= availableWidth;
  }

  function rotateTrackToSlide(slide) {
    let rotations = 0;

    while (track.firstElementChild !== slide && rotations < slides.length) {
      track.appendChild(track.firstElementChild);
      rotations += 1;
    }

    setScrollLeftInstant(0);
    autoplayPosition = 0;
  }

  function updateActiveDotFromScroll() {
    const viewportRect = viewport.getBoundingClientRect();
    const paddingLeft = Number.parseFloat(window.getComputedStyle(viewport).paddingLeft) || 0;
    const targetX = viewportRect.left + paddingLeft;
    let nextIndex = activeIndex;
    let closest = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - targetX);
      if (distance < closest) {
        closest = distance;
        nextIndex = index;
      }
    });

    setActiveDot(nextIndex);
  }

  function goToSlide(index, behavior = "smooth") {
    const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
    const targetSlide = slides[safeIndex];

    if (!hasEnoughContentAfter(targetSlide)) {
      rotateTrackToSlide(targetSlide);
      setActiveDot(safeIndex);
      return;
    }

    viewport.scrollTo({
      left: slideTargetLeftForElement(targetSlide),
      behavior: reduceMotionMedia.matches ? "auto" : behavior,
    });
    setActiveDot(safeIndex);
  }

  function stopAutoplay() {
    if (autoplayFrame !== null) window.cancelAnimationFrame(autoplayFrame);
    autoplayFrame = null;
    autoplayLastTime = null;
    autoplayPosition = null;
    marquee.classList.remove("is-autoplaying");
  }

  function canAutoplay() {
    return desktopMedia.matches
      && !reduceMotionMedia.matches
      && !document.hidden
      && isVisible
      && !isManuallyPaused;
  }

  function recyclePassedSlides() {
    const viewportRect = viewport.getBoundingClientRect();
    const paddingLeft = Number.parseFloat(window.getComputedStyle(viewport).paddingLeft) || 0;
    const targetX = viewportRect.left + paddingLeft;
    let rotations = 0;

    while (rotations < slides.length) {
      const firstSlide = track.firstElementChild;
      const nextSlide = firstSlide?.nextElementSibling;
      if (!firstSlide || !nextSlide || firstSlide.getBoundingClientRect().right > targetX) break;

      const nextLeftBefore = nextSlide.getBoundingClientRect().left;
      track.appendChild(firstSlide);
      const nextLeftAfter = nextSlide.getBoundingClientRect().left;
      setScrollLeftInstant(viewport.scrollLeft + nextLeftAfter - nextLeftBefore);
      autoplayPosition = viewport.scrollLeft;
      rotations += 1;
    }

  }

  function renderAutoplay(time) {
    if (!canAutoplay()) {
      stopAutoplay();
      return;
    }

    if (autoplayLastTime === null) autoplayLastTime = time;
    if (autoplayPosition === null) autoplayPosition = viewport.scrollLeft;
    const delta = Math.min(64, time - autoplayLastTime);
    autoplayLastTime = time;

    autoplayPosition += (delta / 1000) * autoplaySpeed;
    viewport.scrollLeft = autoplayPosition;
    recyclePassedSlides();
    autoplayFrame = window.requestAnimationFrame(renderAutoplay);
  }

  function scheduleAutoplay() {
    stopAutoplay();
    if (!canAutoplay()) return;

    marquee.classList.add("is-autoplaying");
    autoplayFrame = window.requestAnimationFrame(renderAutoplay);
  }

  function setManualPause(nextValue) {
    isManuallyPaused = nextValue;
    updateToggle();
    scheduleAutoplay();
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setManualPause(true);
      goToSlide(index);
    });
  });

  toggle.addEventListener("pointerdown", () => {
    skipNextFocusPause = true;
  });

  toggle.addEventListener("pointercancel", () => {
    skipNextFocusPause = false;
  });

  toggle.addEventListener("click", () => {
    skipNextFocusPause = true;
    setManualPause(!isManuallyPaused);
    window.requestAnimationFrame(() => {
      skipNextFocusPause = false;
    });
  });

  viewport.addEventListener("scroll", () => {
    if (scrollFrame !== null) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = null;
      updateActiveDotFromScroll();
    });
  }, { passive: true });

  viewport.addEventListener("wheel", (event) => {
    const isHorizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (desktopMedia.matches && isHorizontalIntent) setManualPause(true);
  }, { passive: true });

  viewport.addEventListener("pointerdown", (event) => {
    if (desktopMedia.matches && event.pointerType !== "touch") setManualPause(true);
  }, { passive: true });

  marquee.addEventListener("focusin", () => {
    if (focusPauseFrame !== null) window.cancelAnimationFrame(focusPauseFrame);
    focusPauseFrame = window.requestAnimationFrame(() => {
      focusPauseFrame = null;
      if (!skipNextFocusPause) setManualPause(true);
    });
  });

  const visibilityObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      isVisible = entries.some((entry) => entry.isIntersecting);
      scheduleAutoplay();
    }, { threshold: 0.1 })
    : null;

  if (visibilityObserver) visibilityObserver.observe(marquee);
  else isVisible = true;

  document.addEventListener("visibilitychange", scheduleAutoplay);

  window.addEventListener("resize", () => {
    goToSlide(activeIndex, "auto");
    updateToggle();
    scheduleAutoplay();
  });

  desktopMedia.addEventListener("change", () => {
    goToSlide(activeIndex, "auto");
    scheduleAutoplay();
  });

  reduceMotionMedia.addEventListener("change", () => {
    updateToggle();
    scheduleAutoplay();
  });

  setActiveDot(0);
  updateToggle();
  scheduleAutoplay();
}

document.querySelectorAll("[data-review-marquee]").forEach(initReviewMarquee);

function scrollContactsIntoView(behavior = "smooth") {
  if (!contactsSection) return;

  const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0;
  const contactItems = Array.from(contactsSection.children);
  const contactsTop = window.scrollY + Math.min(
    ...contactItems.map((item) => item.getBoundingClientRect().top),
  );
  const motoSection = motoImage?.closest(".moto-strip");
  const contentBottom = window.scrollY + (
    motoSection && window.getComputedStyle(motoSection).display !== "none"
      ? motoSection.getBoundingClientRect().bottom
      : contactsSection.getBoundingClientRect().bottom
  );
  const availableHeight = window.innerHeight - headerBottom;
  const contentHeight = contentBottom - contactsTop;
  const freeSpace = Math.max(0, availableHeight - contentHeight);
  const topGap = Math.min(48, freeSpace);

  const scrollTop = contactsTop - headerBottom - topGap;

  window.scrollTo({
    top: Math.max(0, scrollTop),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : behavior,
  });
}

document.querySelectorAll('a[href="#contacts"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (window.location.hash !== "#contacts") {
      window.history.pushState(null, "", "#contacts");
    }
    scrollContactsIntoView();
  });
});

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#contacts") scrollContactsIntoView();
});

window.addEventListener("load", () => {
  if (window.location.hash === "#contacts") scrollContactsIntoView("auto");
});

document.querySelectorAll(".task-card button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".task-card");
    const action = card?.dataset.action;

    if (action === "telegram") {
      const message = telegramTemplates[card.dataset.template];
      if (message) openTelegramMessage(message);
      return;
    }

    if (card && typeSelect && action === "quote") {
      typeSelect.value = card.dataset.type || typeSelect.value;
    }
    document.querySelector("#quote").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

function openTelegramFromForm(form) {
  const values = Array.from(new FormData(form).entries())
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${telegramFieldLabels[key] || key}: ${String(value).trim()}`);

  const message = [
    "Здравствуйте!",
    "",
    "Хочу получить расчет доставки из Грузии в Россию через Mark’n’Post.",
    "",
    "Маршрут: Грузия → Россия",
    ...(values.length ? ["Данные отправления:", ...values, ""] : []),
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n");

  openTelegramMessage(message);
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    openTelegramFromForm(quoteForm);
  });
}

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    openTelegramFromForm(requestForm);
  });
}

window.addEventListener("resize", () => {
  if (window.location.hash === "#contacts") scrollContactsIntoView("auto");
});
