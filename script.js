// ===== OUTER REALMS GALLERY =====
const cards = window.OUTER_REALMS_CARDS || [];
const gallery = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filters button");
const searchInput = document.getElementById("card-search");

const colorMap = {
  W: "White", U: "Blue", B: "Black", R: "Red", G: "Green",
  M: "Multicolor", A: "Artifact", NB: "Non-Basic Land", BL: "Basic Land"
};

let currentFilter = "all";
let currentQuery = "";
let galleryImages = [];
let currentIndex = -1;
let startX = 0, startY = 0, endX = 0, endY = 0;

function searchableText(card) {
  return [
    card.name,
    colorMap[card.color],
    ...(card.colors || []),
    ...(card.supertypes || []),
    ...(card.types || []),
    ...(card.subtypes || []),
    card.manaCost,
    card.manaValue,
    card.rulesText,
    card.rarity,
    ...(card.mechanics || []),
    ...(card.keywords || [])
  ].filter(v => v !== undefined && v !== null).join(" ").toLowerCase();
}

function getFilteredCards() {
  return cards.filter(card => {
    const matchesColor = currentFilter === "all" ||
      card.color === currentFilter || colorMap[card.color] === currentFilter;
    const matchesSearch = !currentQuery || searchableText(card).includes(currentQuery);
    return matchesColor && matchesSearch;
  });
}

function displayCards() {
  gallery.innerHTML = "";
  getFilteredCards().forEach(card => {
    const img = document.createElement("img");
    img.src = card.img;
    img.alt = card.name;
    img.title = card.name;
    img.className = "card";
    img.loading = "lazy";
    img.dataset.cardId = card.id || "";
    gallery.appendChild(img);
  });
  galleryImages = Array.from(document.querySelectorAll(".card"));
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    displayCards();
  });
});

searchInput?.addEventListener("input", e => {
  currentQuery = e.target.value.trim().toLowerCase();
  displayCards();
});

displayCards();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

function showImage(index, direction = null) {
  if (index < 0 || index >= galleryImages.length) return;
  lightboxImg.classList.remove("slide-left", "slide-right");
  void lightboxImg.offsetWidth;
  lightboxImg.src = galleryImages[index].src;
  if (direction === "left") lightboxImg.classList.add("slide-left");
  if (direction === "right") lightboxImg.classList.add("slide-right");
}

function closeLightbox() {
  lightbox.classList.remove("show");
  lightboxImg.src = "";
  currentIndex = -1;
}

document.addEventListener("click", e => {
  const clickedImg = e.target.closest(".card");
  if (!clickedImg) return;
  e.preventDefault();
  galleryImages = Array.from(document.querySelectorAll(".card"));
  currentIndex = galleryImages.indexOf(clickedImg);
  showImage(currentIndex);
  lightbox.classList.add("show");
});

lightbox.addEventListener("click", e => {
  if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
});

prevBtn.addEventListener("click", e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentIndex, "right");
});
nextBtn.addEventListener("click", e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showImage(currentIndex, "left");
});

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("show")) return;
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "Escape") closeLightbox();
});

lightbox.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
lightbox.addEventListener("touchend", e => {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;
  const dx = endX - startX;
  const dy = endY - startY;
  if (Math.abs(dy) > 80 && dy < 0) closeLightbox();
  else if (Math.abs(dx) > 50 && Math.abs(dy) < 60) {
    currentIndex = dx > 0
      ? (currentIndex - 1 + galleryImages.length) % galleryImages.length
      : (currentIndex + 1) % galleryImages.length;
    showImage(currentIndex, dx > 0 ? "right" : "left");
  }
});
