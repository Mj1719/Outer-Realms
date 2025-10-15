// ===== OUTER REALMS GALLERY SCRIPT =====

// This is your full card list — edit it as you add images.
const cards = [
  // ===== WHITE =====
  // Example: { name: "Radiant Paladin", color: "white", img: "cards/Radiant_Paladin.jpg" },

  // ===== BLUE =====
  // Example: { name: "Oath of the Outer Realms", color: "blue", img: "cards/Oath_of_the_Outer_Realms.jpg" },

  // ===== BLACK =====
  // Example: { name: "Infernal Gatebreaker", color: "black", img: "cards/Infernal_Gatebreaker.png" },

  // ===== RED =====
  // Example: { name: "Flameborn Ritualist", color: "red", img: "cards/Flameborn_Ritualist.jpg" },

  // ===== GREEN =====
  // Example: { name: "Sylvan Envoy", color: "green", img: "cards/Sylvan_Envoy.jpg" },

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
const filterButtons = document.querySelectorAll(".filter-btn");

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

// Handle filter clicks
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const color = button.dataset.color;
    if (color === "all") {
      displayCards(cards);
    } else {
      const filtered = cards.filter(card => card.color === color);
      displayCards(filtered);
    }
  });
});

// Show all cards by default
displayCards(cards);
