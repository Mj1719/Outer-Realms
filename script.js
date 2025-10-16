// ===== OUTER REALMS GALLERY SCRIPT =====

// This is your full card list — edit it as you add images.
const cards = [
  // ===== WHITE =====
  // Example: { name: "Radiant Paladin", color: "white", img: "cards/Radiant_Paladin.jpg" },

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
  // Example: { name: "Prophet of the Rift", color: "multicolor", img: "cards/Prophet_of_the_Rift.jpg" },

  // ===== ARTIFACT =====
  // Example: { name: "Obsidian Compass", color: "artifact", img: "cards/Obsidian_Compass.jpg" },

  // ===== NON-BASIC LAND =====
  // Example: { name: "The Shattered Isle", color: "nonbasic", img: "cards/The_Shattered_Isle.jpg" },

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
// ===== LIGHTBOX WITH ARROWS + MOBILE SWIPE =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let currentIndex = -1;
let galleryImages = [];

// --- Open Lightbox (works for tap or click) ---
document.addEventListener('click', handleImageClick);
document.addEventListener('touchstart', handleImageClick);

function handleImageClick(e) {
  const clickedImg = e.target.closest('.card');
  if (clickedImg) {
    galleryImages = Array.from(document.querySelectorAll('.card'));
    currentIndex = galleryImages.indexOf(clickedImg);
    showImage(currentIndex);
    lightbox.style.display = 'flex';
  } else if (e.target === lightbox) {
    closeLightbox();
  }
}

// --- Display selected image ---
function showImage(index) {
  if (index >= 0 && index < galleryImages.length) {
    lightboxImg.src = galleryImages[index].src;
  }
}

// --- Close Lightbox ---
function closeLightbox() {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
  currentIndex = -1;
}

// --- Arrow Navigation ---
prevBtn.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentIndex);
});

nextBtn.addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showImage(currentIndex);
});

// --- Keyboard Navigation (Desktop) ---
document.addEventListener('keydown', e => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'Escape') closeLightbox();
  }
});

// --- Mobile Swipe Support ---
let startX = 0;
let endX = 0;

lightbox.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener('touchend', e => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const swipeDistance = endX - startX;
  if (Math.abs(swipeDistance) > 50) {
    if (swipeDistance > 0) {
      prevBtn.click(); // swipe right → previous
    } else {
      nextBtn.click(); // swipe left → next
    }
  } else {
    closeLightbox(); // short tap → close
  }
}
