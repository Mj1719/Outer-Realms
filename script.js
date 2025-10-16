// ===== OUTER REALMS GALLERY SCRIPT =====

// This is your full card list — edit it as you add images.
const cards = [
  // ===== WHITE =====
  // Example: { name: "", color: "W", img: "cards/.png" },
  { name: "Archeologists", color: "W", img: "cards/Archeologists.png" },

  // ===== BLUE =====
  // Example: { name: "Oath of the Outer Realms", color: "blue", img: "cards/Oath_of_the_Outer_Realms.jpg" },
  { name: "Force Mage", color: "U", img: "cards/Force Mage.png" },

  // ===== BLACK =====
  // Example: { name: "Infernal Gatebreaker", color: "black", img: "cards/Infernal_Gatebreaker.png" },

  // ===== RED =====
  // Example: { name: "Flameborn Ritualist", color: "red", img: "cards/Flameborn_Ritualist.jpg" },
  { name: "Flame Birth", color: "R", img: "cards/Flame_Birth.png" },

  // ===== GREEN =====
  // Example: { name: "Sylvan Envoy", color: "green", img: "cards/Sylvan_Envoy.jpg" },
  { name: "Spirit Call", color: "G", img: "cards/Spirit Call.png" },
  { name: "Kolani Beastmaster", color: "G", img: "cards/Kolani Beastmaster.png" },
  { name: "Leaf Turner", color: "G", img: "cards/Leaf Turner.png" },
  { name: "Leaping Baloth", color: "G", img: "cards/Leaping Baloth.png" },
  
  // ===== MULTICOLOR =====
  // Example: { name: "", color: "M", img: "cards/.png" },
  { name: "Brimstone", color: "M", img: "cards/Brimstone2.png" },
  { name: "Careful Looting", color: "M", img: "cards/Careful Looting.png" },

  // ===== ARTIFACT =====
  // Example: { name: "", color: "A", img: "cards/.png" },
  { name: "Herbalists Relics", color: "A", img: "cards/Herbalists Relicsland.png" },

  // ===== NON-BASIC LAND =====
  // Example: { name: "", color: "NB", img: "cards/.png" },
   { name: "Wooded Spire", color: "NB", img: "cards/Wooded Spire.png" },

  // ===== BASIC LAND =====
  // Example: { name: "Plains", color: "basic", img: "cards/Plains.jpg" },
];

// ===== Filter + Display Logic =====

// Build the grid on page load
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

console.log("Buttons found:", filterButtons.length);

let galleryImages = [];

function displayCards(filteredCards) {
  gallery.innerHTML = "";
  filteredCards.forEach(card => {
    const img = document.createElement("img");
    img.src = card.img;
    img.alt = card.name;
    img.title = card.name;
    img.classList.add("card");
    gallery.appendChild(img);
  });
  
  // Refresh gallery images for lightbox navigation
galleryImages = Array.from(document.querySelectorAll('.card'));
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    console.log("Button clicked:", button.dataset.filter);

    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    if (filter === "all") {
      displayCards(cards);
      return;
    }

const filtered = cards.filter(card => {
  const colorName = colorMap[filter];
  return card.color === filter || card.color === colorName;
});

        console.log("Filtered cards:", filtered.length);
    displayCards(filtered);
  });
});

displayCards(cards);
// ===== LIGHTBOX WITH FADE + SWIPE ANIMATIONS =====

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let currentIndex = -1;

// --- Handle clicks (tap to open) ---
document.addEventListener('click', e => {
  const clickedImg = e.target.closest('.card');
  if (clickedImg) {
    galleryImages = Array.from(document.querySelectorAll('.card'));
    currentIndex = galleryImages.indexOf(clickedImg);
    showImage(currentIndex);
    openLightbox();
  }
});

// --- Open Lightbox ---
function openLightbox() {
  lightbox.classList.add('show');
  lightbox.style.display = 'flex';
  requestAnimationFrame(() => {
    lightbox.style.opacity = '1';
  });
}

// --- Show Image with slide animation ---
function showImage(index, direction = null) {
  if (index >= 0 && index < galleryImages.length) {
    const newSrc = galleryImages[index].src;
    lightboxImg.classList.remove('slide-left', 'slide-right');
    if (direction) {
      lightboxImg.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');
    }
    lightboxImg.src = newSrc;
  }
}

// --- Close Lightbox ---
function closeLightbox() {
  lightbox.style.opacity = '0';
  setTimeout(() => {
    lightbox.classList.remove('show');
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    currentIndex = -1;
  }, 300);
}

// --- Arrow Navigation ---
prevBtn.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentIndex, 'prev');
});

nextBtn.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showImage(currentIndex, 'next');
});

// --- Keyboard Navigation ---
document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('show')) {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'Escape') closeLightbox();
  }
});

// --- Mobile Swipe + Tap Up/Down to Close ---
let startX = 0, startY = 0, endX = 0, endY = 0;

lightbox.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

lightbox.addEventListener('touchend', e => {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;
  handleSwipe();
});

function handleSwipe() {
  const diffX = endX - startX;
  const diffY = endY - startY;

  // Horizontal swipe (next/prev)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) prevBtn.click(); else nextBtn.click();
    return;
  }

  // Vertical swipe (close)
  if (Math.abs(diffY) > 50) {
    closeLightbox();
  }
}
