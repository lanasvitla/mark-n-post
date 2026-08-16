const quoteForm = document.querySelector(".quote-strip");
const requestForm = document.querySelector(".request-form");
const typeSelect = document.querySelector("#type");
const headerAction = document.querySelector(".header-action");
const heroPrimaryAction = document.querySelector(".hero-primary-action");
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
const reviewSets = {
  parcel: [
    {
      short:
        "Отправляли посылку из\u00a0Тбилиси в\u00a0Европу. Команда заранее подсказала по\u00a0упаковке, срокам и\u00a0документам.",
      full:
        "Отправляли посылку из\u00a0Тбилиси в\u00a0Европу. Команда заранее подсказала по\u00a0упаковке, срокам и\u00a0документам. Было спокойно, потому что на\u00a0каждом этапе отвечали в\u00a0Telegram и\u00a0объясняли, что происходит с\u00a0отправлением.",
    },
    {
      short:
        "Нужно было передать подарки близким за\u00a0границу. Получили расчет, согласовали коробку и\u00a0способ отправки.",
      full:
        "Нужно было передать подарки близким за\u00a0границу. Получили расчет, согласовали коробку и\u00a0способ отправки. Понравилось, что не\u00a0пришлось отдельно разбираться в\u00a0условиях и\u00a0искать упаковку.",
    },
    {
      short:
        "Перед отправкой проверили, что можно положить в\u00a0коробку, и\u00a0помогли выбрать формат доставки.",
      full:
        "Перед отправкой проверили, что можно положить в\u00a0коробку, и\u00a0помогли выбрать формат доставки. Для меня это было самым важным: быстро понять ограничения, срок и\u00a0примерную стоимость.",
    },
  ],
  documents: [
    {
      short:
        "Уточнили доступный способ доставки документов, объяснили сроки и\u00a0что нужно подготовить перед\u00a0передачей.",
      full:
        "Уточнили доступный способ доставки документов, объяснили сроки и\u00a0что нужно подготовить перед\u00a0передачей. Ответили без\u00a0лишней переписки и\u00a0сразу подсказали, какой вариант подойдет.",
    },
    {
      short:
        "Было важно отправить документы аккуратно и\u00a0без\u00a0задержек. Команда быстро рассчитала вариант.",
      full:
        "Было важно отправить документы аккуратно и\u00a0без\u00a0задержек. Команда быстро рассчитала вариант, уточнила детали и\u00a0оставалась на\u00a0связи до\u00a0передачи отправления.",
    },
    {
      short:
        "Не пришлось разбираться во\u00a0всем самостоятельно: написала задачу и\u00a0получила понятный ответ.",
      full:
        "Не пришлось разбираться во\u00a0всем самостоятельно: написала задачу и\u00a0получила понятный ответ по\u00a0сроку, стоимости и\u00a0подготовке документов к\u00a0отправке.",
    },
  ],
  moving: [
    {
      short:
        "Перевозили личные вещи при\u00a0переезде из\u00a0Грузии. Помогли оценить объем, подсказали по\u00a0коробкам.",
      full:
        "Перевозили личные вещи при\u00a0переезде из\u00a0Грузии. Помогли оценить объем, подсказали по\u00a0коробкам и\u00a0заранее согласовали передачу. Особенно помогло, что все шаги были понятны заранее.",
    },
    {
      short:
        "Для переезда было много вопросов: вес, упаковка, что можно отправлять. Все объяснили простым языком.",
      full:
        "Для переезда было много вопросов: вес, упаковка, что можно отправлять. Все объяснили простым языком, помогли подготовить вещи и\u00a0выбрать удобный формат передачи.",
    },
    {
      short:
        "Нужно было отправить несколько коробок с\u00a0личными вещами. Получили понятный порядок действий.",
      full:
        "Нужно было отправить несколько коробок с\u00a0личными вещами. Получили понятный порядок действий и\u00a0расчет до\u00a0передачи отправления, поэтому было проще спланировать переезд.",
    },
  ],
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

function setReviewContent(card, index, isExpanded, shouldAnimate = true) {
  const reviews = reviewSets[card.dataset.reviewCard];
  const quote = card.querySelector("[data-review-text]");
  const toggle = card.querySelector("[data-review-toggle]");
  if (!reviews || !quote || !toggle) return;

  const nextIndex = ((index % reviews.length) + reviews.length) % reviews.length;
  const nextReview = reviews[nextIndex];

  card.dataset.reviewIndex = String(nextIndex);
  card.classList.toggle("is-expanded", isExpanded);
  toggle.textContent = isExpanded ? "Свернуть" : "Читать полностью";
  toggle.setAttribute("aria-expanded", String(isExpanded));
  quote.textContent = isExpanded ? nextReview.full : nextReview.short;

  card.classList.remove("is-changing");
  if (shouldAnimate) {
    requestAnimationFrame(() => card.classList.add("is-changing"));
  }
}

document.querySelectorAll("[data-review-card]").forEach((card) => {
  const interval = Number(card.dataset.reviewInterval) || 14000;
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  setReviewContent(card, 0, false, false);

  if (supportsHover) {
    card.addEventListener("mouseenter", () => {
      card.dataset.paused = "true";
    });

    card.addEventListener("mouseleave", () => {
      if (!card.classList.contains("is-expanded")) card.dataset.paused = "false";
    });
  }

  card.querySelector("[data-review-toggle]")?.addEventListener("click", () => {
    const isExpanded = !card.classList.contains("is-expanded");
    card.dataset.paused = String(isExpanded);
    setReviewContent(card, Number(card.dataset.reviewIndex) || 0, isExpanded);
  });

  window.setInterval(() => {
    if (card.dataset.paused === "true" || card.classList.contains("is-expanded")) return;
    setReviewContent(card, (Number(card.dataset.reviewIndex) || 0) + 1, false);
  }, interval);
});

function setHeaderActionVisibility(isVisible) {
  if (!headerAction) return;

  headerAction.classList.toggle("is-visible", isVisible);
  headerAction.setAttribute("aria-hidden", String(!isVisible));
  headerAction.tabIndex = isVisible ? 0 : -1;
}

function updateHeaderActionVisibility() {
  if (!heroPrimaryAction) {
    setHeaderActionVisibility(true);
    return;
  }

  const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0;
  const heroActionBottom = heroPrimaryAction.getBoundingClientRect().bottom;
  setHeaderActionVisibility(heroActionBottom <= headerBottom);
}

function scrollContactsIntoView(behavior = "smooth") {
  if (!contactsSection || !motoImage) return;

  const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0;
  const contactItems = Array.from(contactsSection.children);
  const contactsTop = window.scrollY + Math.min(
    ...contactItems.map((item) => item.getBoundingClientRect().top),
  );
  const motoSection = motoImage.closest(".moto-strip");
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

updateHeaderActionVisibility();
window.addEventListener("scroll", updateHeaderActionVisibility, { passive: true });
window.addEventListener("resize", () => {
  updateHeaderActionVisibility();
  if (window.location.hash === "#contacts") scrollContactsIntoView("auto");
});
