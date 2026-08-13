const quoteForm = document.querySelector(".quote-strip");
const requestForm = document.querySelector(".request-form");
const typeSelect = document.querySelector("#type");

document.querySelectorAll(".task-card button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".task-card");
    if (card && typeSelect) {
      typeSelect.value = card.dataset.type || typeSelect.value;
    }
    document.querySelector("#quote").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

function openTelegramFromForm(form) {
  const values = Array.from(new FormData(form).entries())
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");

  const message = values
    ? `Здравствуйте! Хочу получить расчет доставки Mark’n’Post. ${values}`
    : "Здравствуйте! Хочу получить расчет доставки Mark’n’Post.";

  window.open(`https://t.me/MarknPost?text=${encodeURIComponent(message)}`, "_blank", "noopener");
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
