
const up = document.querySelector("#btn-summary-toggle");
const aside = document.querySelector("aside");

up.addEventListener("click", (e) => {
  aside.classList.toggle("open");
});
