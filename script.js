// ===== OUTER REALMS GALLERY SCRIPT =====

// This is your full card list — edit it as you add images.
const cards = [
  // ===== WHITE =====
  // Example: { name: "Radiant Paladin", color: "white", img: "cards/Radiant_Paladin.jpg" },

  // ===== BLUE =====
  // Example: { name: "Oath of the Outer Realms", color: "blue", img: "cards/Oath_of_the_Outer_Realms.jpg" },
  { name: "Force Mage", color: "blue", img: "cards/Force Mage.png" },

  // ===== BLACK =====
  // Example: { name: "Infernal Gatebreaker", color: "black", img: "cards/Infernal_Gatebreaker.png" },

  // ===== RED =====
  // Example: { name: "Flameborn Ritualist", color: "red", img: "cards/Flameborn_Ritualist.jpg" },
  { name: "Flame Birth", color: "red", img: "cards/Flame_Birth.png" },

  // ===== GREEN =====
  // Example: { name: "Sylvan Envoy", color: "green", img: "cards/Sylvan_Envoy.jpg" },
  { name: "Spirit Call", color: "green", img: "cards/Spirit Call.png" },

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
