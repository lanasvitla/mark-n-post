(function () {
  "use strict";

  const accessKey = "marknpost-private-access-v1";
  const expectedHash = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3";

  function hasAccess() {
    try {
      return window.sessionStorage.getItem(accessKey) === "granted";
    } catch (error) {
      return false;
    }
  }

  if (hasAccess()) {
    return;
  }

  document.documentElement.classList.add("private-page-locked");

  const gateStyles = document.createElement("style");
  gateStyles.textContent = `
    html.private-page-locked body { visibility: hidden !important; }
    html.private-page-locked .private-access-gate {
      visibility: visible !important;
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      padding: 24px;
      background: #f3f5f6;
      color: #111111;
      font-family: Arial, Helvetica, sans-serif;
    }
    .private-access-card {
      width: min(100%, 420px);
      box-sizing: border-box;
      padding: 32px;
      border: 1px solid #d8dee1;
      border-radius: 10px;
      background: #ffffff;
      box-shadow: 0 18px 50px rgba(17, 17, 17, 0.12);
    }
    .private-access-card h1 { margin: 0 0 10px; font-size: 28px; line-height: 1.1; }
    .private-access-card p { margin: 0 0 22px; color: #62676a; font-size: 16px; line-height: 1.5; }
    .private-access-card label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 700; }
    .private-access-card input {
      width: 100%;
      box-sizing: border-box;
      min-height: 48px;
      padding: 0 14px;
      border: 1px solid #aeb8bd;
      border-radius: 6px;
      color: #111111;
      font: inherit;
    }
    .private-access-card button {
      width: 100%;
      min-height: 48px;
      margin-top: 12px;
      border: 0;
      border-radius: 6px;
      background: #0784a3;
      color: #ffffff;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }
    .private-access-error { min-height: 21px; margin: 10px 0 0 !important; color: #e00014 !important; font-size: 14px !important; }
  `;
  document.head.appendChild(gateStyles);

  async function hash(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  window.addEventListener("DOMContentLoaded", function () {
    const gate = document.createElement("div");
    gate.className = "private-access-gate";
    gate.innerHTML = `
      <form class="private-access-card" autocomplete="off">
        <h1>Закрытый раздел</h1>
        <p>Введите пароль для просмотра журнала и архивных версий Mark’n’Post.</p>
        <label for="private-page-password">Пароль</label>
        <input id="private-page-password" name="password" type="password" inputmode="numeric" required />
        <button type="submit">Открыть</button>
        <p class="private-access-error" role="alert" aria-live="polite"></p>
      </form>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector("form");
    const input = gate.querySelector("input");
    const error = gate.querySelector(".private-access-error");

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const candidateHash = await hash(input.value);

      if (candidateHash !== expectedHash) {
        error.textContent = "Неверный пароль.";
        input.select();
        return;
      }

      try {
        window.sessionStorage.setItem(accessKey, "granted");
      } catch (storageError) {
        // Access still applies to the current page when session storage is unavailable.
      }

      gate.remove();
      document.documentElement.classList.remove("private-page-locked");
    });

    input.focus();
  });
})();
