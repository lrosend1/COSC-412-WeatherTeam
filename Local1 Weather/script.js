const openBtn = document.getElementById("onefav");
const confirmBtn = document.getElementById("confirmpopup");
const cancelBtn = document.getElementById("cancelpopup");
const popup = document.getElementById("favpopup");

openBtn.addEventListener("click", () => {
    popup.classList.add("open");
});

confirmBtn.addEventListener("click", () => {
    popup.classList.remove("open");
});

cancelBtn.addEventListener("click", () => {
    popup.classList.remove("open");
});