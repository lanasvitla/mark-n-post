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
    "Хочу обсудить перевозку личных вещей с Mark’n’Post.",
    "",
    "Данные отправления:",
    "Что отправить: личные вещи при переезде",
    "Откуда: Грузия",
    "Куда: [страна / город]",
    "Примерный объем / вес: [указать]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  shop: [
    "Здравствуйте!",
    "",
    "Хочу узнать условия доставки заказа из интернет-магазина через Mark’n’Post.",
    "",
    "Данные отправления:",
    "Магазин: [Ozon / другой]",
    "Что нужно получить: [указать]",
    "Куда доставить: [страна / город]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "delivery-details": [
    "Здравствуйте!",
    "",
    "Хочу получить расчет доставки Mark’n’Post.",
    "",
    "Данные отправления:",
    "Направление: [откуда → куда]",
    "Тип отправления: [посылка / документы / переезд / заказ / упаковка]",
    "Примерный вес: [указать]",
    "Размеры: [указать]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "service-contact": [
    "Здравствуйте!",
    "",
    "Хочу уточнить услугу Mark’n’Post.",
    "",
    "Интересует доставка из Грузии. Подскажите, пожалуйста, какой формат подойдет для моей задачи.",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "direction-check": [
    "Здравствуйте!",
    "",
    "Хочу уточнить направление доставки Mark’n’Post.",
    "",
    "Данные отправления:",
    "Откуда: Грузия",
    "Куда: [страна / город]",
    "Тип отправления: [посылка / документы / переезд / заказ]",
    "",
    "Сообщение отправлено с сайта moving.marknpost.com",
  ].join("\n"),
  "handoff-contact": [
    "Здравствуйте!",
    "",
    "Хочу согласовать передачу отправления Mark’n’Post.",
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
    "Хочу заказать упаковку в Mark’n’Post.",
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
  const track = marquee.querySelector("[data-review-marquee-track]");
  const dotsHost = marquee.querySelector("[data-review-marquee-dots]");
  if (!track || !dotsHost) return;

  const slides = Array.from(track.querySelectorAll("[data-review-slide]"));
  if (slides.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  slides.forEach((slide, index) => {
    slide.dataset.reviewIndex = String(index);
    const clone = slide.cloneNode(true);
    clone.dataset.reviewClone = "true";
    clone.dataset.reviewIndex = String(index);
    clone.setAttribute("aria-hidden", "true");
    clone.tabIndex = -1;
    track.insertBefore(clone, slides[0]);
  });

  const allSlides = () => Array.from(track.querySelectorAll("[data-review-slide]"));
  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "review-marquee-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать материал ${index + 1}`);
    dotsHost.appendChild(dot);
    return dot;
  });

  let cycleWidth = 0;
  let firstOriginalLeft = 0;
  let offset = 0;
  let activeIndex = 0;
  let lastTime = null;
  let frameId = null;

  function setActiveDot(nextIndex) {
    if (nextIndex === activeIndex && dots[nextIndex]?.classList.contains("is-active")) return;
    dots[activeIndex]?.classList.remove("is-active");
    dots[nextIndex]?.classList.add("is-active");
    activeIndex = nextIndex;
  }

  function measure() {
    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];
    firstOriginalLeft = firstSlide.offsetLeft;
    cycleWidth = lastSlide.offsetLeft + lastSlide.offsetWidth - firstOriginalLeft;
    offset = -firstOriginalLeft;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    setActiveDot(0);
  }

  function updateActiveDot() {
    if (!cycleWidth) return;

    let nextIndex = activeIndex;
    let closest = Number.POSITIVE_INFINITY;

    allSlides().forEach((slide) => {
      const index = Number(slide.dataset.reviewIndex);
      const x = slide.offsetLeft + offset;
      const distance = Math.abs(x);
      if (Number.isInteger(index) && distance < closest) {
        closest = distance;
        nextIndex = index;
      }
    });

    setActiveDot(nextIndex);
  }

  function render(time) {
    if (lastTime === null) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;

    offset += delta * 0.012;
    if (offset >= 0) offset = -cycleWidth;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    updateActiveDot();
    frameId = window.requestAnimationFrame(render);
  }

  function start() {
    if (reduceMotion || frameId || !cycleWidth) return;
    lastTime = null;
    frameId = window.requestAnimationFrame(render);
  }

  function stop() {
    if (!frameId) return;
    window.cancelAnimationFrame(frameId);
    frameId = null;
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (!cycleWidth) return;
      offset = -slides[index].offsetLeft;
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      setActiveDot(index);
      lastTime = null;
    });
  });

  window.requestAnimationFrame(() => {
    measure();
    start();
  });

  window.addEventListener("resize", () => {
    stop();
    measure();
    start();
  });
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
    "Хочу получить расчет доставки Mark’n’Post.",
    "",
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
