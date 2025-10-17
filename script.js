// ===== OUTER REALMS GALLERY SCRIPT (Lazy Load + Lightbox + Pagination) =====

// ===== CARD DATA =====
const cards = [
  { name: "Archeologists", color: "W", img: "cards/Archeologists.png" },
  { name: "Reavow", color: "W", img: "cards/Reavow.png" },
  { name: "Disavow", color: "M", img: "cards/Disavow.png" },
  { name: "Ensoul", color: "B", img: "cards/Ensoul.png" },
  { name: "Haunting Edict", color: "B", img: "cards/Haunting Edict.png" },
  { name: "Biezels Plague", color: "B", img: "cards/Biezels Plague.png" },
  { name: "Rite Of Reclamation", color: "G", img: "cards/Rite Of Reclamationalt.png" },
  { name: "Force Mage", color: "U", img: "cards/Force Mage.png" },
  { name: "Flame Birth", color: "R", img: "cards/Flame_Birth.png" },
  { name: "Spirit Call", color: "G", img: "cards/Spirit Call.png" },
  { name: "Kolani Beastmaster", color: "G", img: "cards/Kolani Beastmaster.png" },
  { name: "Leaf Turner", color: "G", img: "cards/Leaf Turner.png" },
  { name: "Leaping Baloth", color: "G", img: "cards/Leaping Baloth.png" },
  { name: "Brimstone", color: "M", img: "cards/Brimstone2.png" },
  { name: "Careful Looting", color: "M", img: "cards/Careful Looting.png" },
  { name: "Herbalists Relics", color: "A", img: "cards/Herbalists Relicsland.png" },
  { name: "Forgotten Tower", color: "NB", img: "cards/Forgotten Tower.png" },
  { name: "Wooded Spire", color: "NB", img: "cards/Wooded Spire.png" },
  { name: "Forest1", color: "BL", img: "cards/Forest.png" },
  // ... (add all remaining cards here)
];

// ===== GLOBAL ELEMENTS =====
const gallery = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filters button");

const colorMap = {
  W: "White",
  U: "Blue",
  B: "Black",
  R: "Red",
  G: "Green",
  M: "Multicolor",
  A: "Artifact",
  NB: "Non-Basic Land",
  BL: "Basic Land"
};

// ===== PAGINATION SETTINGS =====
let currentPage = 1;
const cardsPerPage = 80;
let currentFilter = "all";
let galleryImages = [];

// ===== GALLERY DISPLAY =====
function displayCards(filteredCards, reset = true) {
  if (reset) gallery.innerHTML = "";

  const start = (currentPage - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const visibleCards = filteredCards.slice(0, end);

  visibleCards.forEach(card => {
    const img = document.createElement("img");
    img.src = card.img;
    img.alt = card.name;
    img.title = card.name;
    img.classList.add("card");
    img.loading = "lazy";
    gallery.appendChild(img);
  });

  galleryImages = Array.from(document.querySelectorAll('.card'));
}

// ===== FILTER BUTTONS =====
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    currentFilter = button.dataset.filter;
    currentPage = 1;

    const filtered = (currentFilter === "all")
      ? cards
      : cards.filter(card => card.color === currentFilter || colorMap[card.color] === currentFilter);

    displayCards(filtered);
  });
});

// ===== LOAD MORE BUTTON (AUTO) =====
window.addEventListener("scroll", () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
    const filtered = (currentFilter === "all")
      ? cards
      : cards.filter(card => card.color === currentFilter || colorMap[card.color] === currentFilter);

    if ((currentPage * cardsPerPage) < filtered.length) {
      currentPage++;
      displayCards(filtered, false);
    }
  }
});

// ===== INITIAL DISPLAY =====
displayCards(cards);

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentIndex = -1;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

// --- Tap to open (requires click-release) ---
document.addEventListener('click', e => {
  const clickedImg = e.target.closest('.card');
  if (clickedImg) {
    e.preventDefault();
    galleryImages = Array.from(document.querySelectorAll('.card'));
    currentIndex = galleryImages.indexOf(clickedImg);
    showImage(currentIndex);
    lightbox.classList.add('show');
  }
});

// --- Show image with smooth animation ---
function showImage(index, direction = null) {
  if (index < 0 || index >= galleryImages.length) return;

  const img = lightboxImg;
  img.classList.remove('slide-left', 'slide-right');

  // Trigger reflow so animation restarts
  void img.offsetWidth;

  img.src = galleryImages[index].src;

  // Apply animation direction if provided
  if (direction === 'left') img.classList.add('slide-left');
  else if (direction === 'right') img.classList.add('slide-right');
}

// --- Close lightbox ---
function closeLightbox() {
  lightbox.classList.remove('show');
  lightboxImg.src = '';
  currentIndex = -1;
}

// --- Close on click (desktop) ---
lightbox.addEventListener('click', e => {
  // Close only if user clicked background or the image itself
  if (e.target === lightbox || e.target === lightboxImg) {
    closeLightbox();
  }
});

// --- Arrows ---
prevBtn.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentIndex, 'right');
});

nextBtn.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showImage(currentIndex, 'left');
});

// --- Keyboard navigation ---
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'Escape') closeLightbox();
});

// --- Touch gestures (swipe left/right or up to close) ---
lightbox.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

lightbox.addEventListener('touchend', e => {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // Swipe up to close
  if (Math.abs(deltaY) > 80 && deltaY < 0) {
    closeLightbox();
  }
  // Swipe left/right to navigate
  else if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 60) {
    if (deltaX > 0) {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      showImage(currentIndex, 'right');
    } else {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      showImage(currentIndex, 'left');
    }
  }
});
