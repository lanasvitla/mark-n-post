(() => {
  const storageKey = "marknpost_cookie_consent_v1";
  const analyticsChoice = "analytics";
  const necessaryChoice = "necessary";
  const gtmId = "GTM-TQNMDCQS";
  const yandexId = 111840782;

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });

  function readChoice() {
    try {
      const choice = window.localStorage.getItem(storageKey);
      return choice === analyticsChoice || choice === necessaryChoice ? choice : null;
    } catch {
      return null;
    }
  }

  function saveChoice(choice) {
    try {
      window.localStorage.setItem(storageKey, choice);
    } catch {
      return false;
    }
    return true;
  }

  function loadGoogleTagManager() {
    if (document.querySelector(`script[data-gtm-id="${gtmId}"]`)) return;

    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js",
    });

    const script = document.createElement("script");
    script.async = true;
    script.dataset.gtmId = gtmId;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.append(script);
  }

  function loadYandexMetrika() {
    if (window.__marknpostYandexLoaded) return;
    window.__marknpostYandexLoaded = true;
    window.ym = window.ym || function yandexQueue() {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = Date.now();

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${yandexId}`;
    document.head.append(script);

    window.ym(yandexId, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: document.referrer,
      url: window.location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }

  function enableAnalytics() {
    if (window.__marknpostAnalyticsLoaded) return;
    window.__marknpostAnalyticsLoaded = true;
    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    loadGoogleTagManager();
    loadYandexMetrika();
  }

  function createBanner() {
    const banner = document.createElement("section");
    banner.className = "cookie-consent";
    banner.hidden = true;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-labelledby", "cookie-consent-title");
    banner.innerHTML = `
      <div class="cookie-consent__copy">
        <h2 id="cookie-consent-title">
          <svg class="cookie-consent__icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M28.7 18.1A12.8 12.8 0 1 1 13.9 3.3a6.4 6.4 0 0 0 8.8 8.8 6.4 6.4 0 0 0 6 6Z" />
            <circle cx="10.2" cy="11.2" r="1.5" />
            <circle cx="15.1" cy="19.7" r="1.7" />
            <circle cx="8.5" cy="22.4" r="1.2" />
          </svg>
          <span>Мы используем файлы cookie</span>
        </h2>
        <p>
          Для&nbsp;вашего удобства пользования сайтом и&nbsp;повышения качества рекомендаций.
          <a class="cookie-consent__details" href="/privacy/">Подробнее</a>
        </p>
      </div>
      <div class="cookie-consent__actions">
        <button class="cookie-consent__necessary" type="button" data-cookie-choice="necessary">
          Только необходимые
        </button>
        <button class="cookie-consent__button" type="button" data-cookie-choice="analytics">
          Принять и&nbsp;закрыть
        </button>
      </div>
    `;
    document.body.append(banner);

    const acceptButton = banner.querySelector('[data-cookie-choice="analytics"]');
    const necessaryButton = banner.querySelector('[data-cookie-choice="necessary"]');
    let closeTimer = null;

    function showBanner(focusChoice = false) {
      window.clearTimeout(closeTimer);
      banner.hidden = false;
      window.requestAnimationFrame(() => banner.classList.add("is-visible"));
      if (focusChoice) acceptButton.focus();
    }

    function hideBanner() {
      banner.classList.remove("is-visible");
      closeTimer = window.setTimeout(() => {
        banner.hidden = true;
      }, 220);
    }

    function applyChoice(choice) {
      const analyticsWasLoaded = Boolean(window.__marknpostAnalyticsLoaded);
      saveChoice(choice);

      if (choice === analyticsChoice) {
        enableAnalytics();
      } else {
        gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }

      hideBanner();
      window.dispatchEvent(new CustomEvent("marknpost:cookie-consent", {
        detail: { choice },
      }));
      if (choice === necessaryChoice && analyticsWasLoaded) {
        window.setTimeout(() => window.location.reload(), 230);
      }
    }

    acceptButton.addEventListener("click", () => applyChoice(analyticsChoice));
    necessaryButton.addEventListener("click", () => applyChoice(necessaryChoice));

    document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
      button.addEventListener("click", () => showBanner(true));
    });

    const settingsRequested = new URLSearchParams(window.location.search).has("cookie-settings");
    if (settingsRequested) {
      showBanner(true);
    } else if (!readChoice()) {
      showBanner();
    }
  }

  if (readChoice() === analyticsChoice) enableAnalytics();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBanner, { once: true });
  } else {
    createBanner();
  }
})();
