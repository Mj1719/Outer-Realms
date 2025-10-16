// ===== OUTER REALMS GALLERY SCRIPT (Lazy Load + Lightbox + Pagination) =====

// ===== CARD DATA =====
const cards = [
  { name: "Archeologists", color: "W", img: "cards/Archeologists.png" },
  { name: "Force Mage", color: "U", img: "cards/Force Mage.png" },
  { name: "Flame Birth", color: "R", img: "cards/Flame_Birth.png" },
  { name: "Spirit Call", color: "G", img: "cards/Spirit Call.png" },
  { name: "Kolani Beastmaster", color: "G", img: "cards/Kolani Beastmaster.png" },
  { name: "Leaf Turner", color: "G", img: "cards/Leaf Turner.png" },
  { name: "Leaping Baloth", color: "G", img: "cards/Leaping Baloth.png" },
  { name: "Brimstone", color: "M", img: "cards/Brimstone2.png" },
  { name: "Careful Looting", color: "M", img: "cards/Careful Looting.png" },
  { name: "Herbalists Relics", color: "A", img: "cards/Herbalists Relicsland.png" },
  { name: "Wooded Spire", color: "NB", img: "cards/Wooded Spire.png" },
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

/* === LIGHTBOX WITH MOMENTUM SWIPE (MOBILE OPTIMIZED) === */
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <span class="nav-arrow left">&#10094;</span>
  <img id="lightbox-img" src="" alt="Full view" />
  <span class="nav-arrow right">&#10095;</span>
`;
document.body.appendChild(lightbox);

const lightboxImg = document.getElementById('lightbox-img');
const leftArrow = document.querySelector('.nav-arrow.left');
const rightArrow = document.querySelector('.nav-arrow.right');
let currentIndex = 0;
let galleryImages = Array.from(document.querySelectorAll('.card'));
let startX = 0, startY = 0, endX = 0, endY = 0;
let isLightboxOpen = false;

// Tap to open (after release)
galleryImages.forEach((card, index) => {
  card.addEventListener('touchend', (e) => {
    e.preventDefault();
    openLightbox(index);
  });
  card.addEventListener('click', () => openLightbox(index));
});

function openLightbox(index) {
  currentIndex = index;
  const img = galleryImages[currentIndex].querySelector('img');
  if (!img) return;
  lightboxImg.src = img.src;
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden'; // Disable page scroll
  isLightboxOpen = true;
}

function closeLightbox() {
  lightbox.classList.remove('show');
  document.body.style.overflow = ''; // Re-enable scroll
  isLightboxOpen = false;
}

function showImage(index, direction = null) {
  if (index < 0) index = galleryImages.length - 1;
  if (index >= galleryImages.length) index = 0;
  const img = galleryImages[index].querySelector('img');
  if (!img) return;
  lightboxImg.classList.remove('slide-left', 'slide-right');
  void lightboxImg.offsetWidth; // Force reflow
  if (direction === 'left') lightboxImg.classList.add('slide-left');
  else if (direction === 'right') lightboxImg.classList.add('slide-right');
  lightboxImg.src = img.src;
  currentIndex = index;
}

leftArrow.addEventListener('click', () => showImage(currentIndex - 1, 'right'));
rightArrow.addEventListener('click', () => showImage(currentIndex + 1, 'left'));

// === Swipe Detection ===
lightbox.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchmove', (e) => {
  endX = e.touches[0].clientX;
  endY = e.touches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchend', () => {
  const diffX = endX - startX;
  const diffY = endY - startY;
  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);

  // Horizontal swipe for next/prev (momentum feel)
  if (absX > 40 && absX > absY) {
    if (diffX > 0) showImage(currentIndex - 1, 'right');
    else showImage(currentIndex + 1, 'left');
  }

  // Vertical swipe to close
  if (absY > 60 && absY > absX) {
    closeLightbox();
  }

  startX = startY = endX = endY = 0;
});

