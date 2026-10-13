(() => {
  const header = document.querySelector(".site-header");
  const toggle = header?.querySelector("[data-nav-toggle]");
  const navigation = header?.querySelector("[data-mobile-nav]");
  if (!header || !toggle || !navigation) return;

  const mobileLayout = window.matchMedia("(max-width: 1120px)");

  function setMenuState(open, returnFocus = false) {
    const shouldOpen = mobileLayout.matches && open;

    navigation.hidden = mobileLayout.matches && !shouldOpen;
    toggle.setAttribute("aria-expanded", String(shouldOpen));
    toggle.setAttribute("aria-label", shouldOpen ? "Закрыть меню" : "Открыть меню");

    if (returnFocus) toggle.focus();
  }

  function syncLayout() {
    setMenuState(false);
  }

  header.classList.add("is-nav-ready");
  syncLayout();

  toggle.addEventListener("click", () => {
    setMenuState(toggle.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuState(false);
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false, true);
    }
  });

  mobileLayout.addEventListener("change", syncLayout);
})();
