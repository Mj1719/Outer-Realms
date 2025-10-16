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

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentIndex = -1;
let startX = 0, startY = 0, endX = 0, endY = 0;
let hideArrowsTimeout;

// --- Tap-to-open (no instant open on scroll) ---
document.addEventListener('click', e => {
  const clickedImg = e.target.closest('.card');
  if (clickedImg) {
    galleryImages = Array.from(document.querySelectorAll('.card'));
    currentIndex = galleryImages.indexOf(clickedImg);
    showImage(currentIndex);
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // 🧱 Disable page scroll
  }
});

// --- Show image ---
function showImage(index) {
  if (index >= 0 && index < galleryImages.length) {
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.classList.remove('slide-left', 'slide-right');
  }
}

// --- Close lightbox ---
function closeLightbox() {
  lightbox.classList.remove('show');
  lightboxImg.src = '';
  currentIndex = -1;
  document.body.style.overflow = ''; // 🧱 Restore scrolling
}

// --- Arrows ---
prevBtn.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.classList.add('slide-left');
  showImage(currentIndex);
  showArrowsTemporarily(true); // 🪄 show arrows on swipe
});

nextBtn.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lightboxImg.classList.add('slide-right');
  showImage(currentIndex);
  showArrowsTemporarily(true); // 🪄 show arrows on swipe
});

// --- Keyboard ---
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'Escape') closeLightbox();
});

// --- Touch gestures (swipe left/right, swipe up to close) ---
lightbox.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

lightbox.addEventListener('touchend', e => {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (Math.abs(deltaY) > 80 && deltaY < 0) {
    closeLightbox(); // swipe up to close
  } else if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) prevBtn.click(); // swipe right
    else nextBtn.click(); // swipe left
  }
});

// ===== MOBILE ARROW FADE CONTROL =====
function showArrowsTemporarily(instant = false) {
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    prevBtn.classList.add('visible');
    nextBtn.classList.add('visible');
    if (instant) {
      prevBtn.style.transition = 'none';
      nextBtn.style.transition = 'none';
      requestAnimationFrame(() => {
        prevBtn.style.transition = '';
        nextBtn.style.transition = '';
      });
    }
    clearTimeout(hideArrowsTimeout);
    hideArrowsTimeout = setTimeout(() => {
      prevBtn.classList.remove('visible');
      nextBtn.classList.remove('visible');
    }, 2000); // hide again after 2 seconds
  }
}

// Show arrows when user taps or touches inside lightbox
lightbox.addEventListener('touchstart', showArrowsTemporarily);
lightbox.addEventListener('click', showArrowsTemporarily);

// Close lightbox on desktop click (image or backdrop)
lightbox.addEventListener('click', e => {
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return; // mobile only tap
  if (e.target === lightbox || e.target === lightboxImg) {
    closeLightbox();
  }
});
