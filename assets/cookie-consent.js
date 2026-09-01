(() => {
  const storageKey = "marknpost_cookie_notice_ack_v1";
  const acknowledgedValue = "acknowledged";
  const gtmId = "GTM-TQNMDCQS";
  const yandexId = 111840782;

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });

  function isAcknowledged() {
    try {
      return window.localStorage.getItem(storageKey) === acknowledgedValue;
    } catch {
      return false;
    }
  }

  function saveAcknowledgement() {
    try {
      window.localStorage.setItem(storageKey, acknowledgedValue);
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

  function loadAnalytics() {
    if (window.__marknpostAnalyticsLoaded) return;
    window.__marknpostAnalyticsLoaded = true;
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
          <span>Cookie и&nbsp;аналитика</span>
        </h2>
        <p>
          <span class="cookie-consent__message">На&nbsp;сайте используются cookie и&nbsp;системы аналитики для&nbsp;работы сайта и&nbsp;оценки эффективности.</span>
          <span class="cookie-consent__details-line">Подробнее&nbsp;– в&nbsp;<a
              class="cookie-consent__details"
              href="/privacy/"
            >Политике конфиденциальности</a>.</span>
        </p>
      </div>
      <div class="cookie-consent__actions">
        <button class="cookie-consent__button" type="button" data-cookie-acknowledge>
          Понятно
        </button>
      </div>
    `;
    document.body.append(banner);

    const acknowledgeButton = banner.querySelector("[data-cookie-acknowledge]");
    let closeTimer = null;

    function showBanner() {
      window.clearTimeout(closeTimer);
      banner.hidden = false;
      window.requestAnimationFrame(() => banner.classList.add("is-visible"));
    }

    function hideBanner() {
      banner.classList.remove("is-visible");
      closeTimer = window.setTimeout(() => {
        banner.hidden = true;
      }, 220);
    }

    function acknowledgeNotice() {
      saveAcknowledgement();
      hideBanner();
      window.dispatchEvent(new CustomEvent("marknpost:cookie-notice-acknowledged"));
    }

    acknowledgeButton.addEventListener("click", acknowledgeNotice);

    if (!isAcknowledged()) {
      showBanner();
    }
  }

  loadAnalytics();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBanner, { once: true });
  } else {
    createBanner();
  }
})();
