// ===== OUTER REALMS CARD DATABASE =====
// Shared by the gallery, spell table, deckbuilder, and later game systems.
// `supertypes` is where Legendary belongs when a card needs it, e.g. ["Legendary"].

window.OUTER_REALMS_CARDS = [
  { id: "archeologists", name: "Archeologists", color: "W", colors: ["W"], img: "cards/Archeologists.png", manaCost: "{1}{W}", manaValue: 2, supertypes: [], types: ["Creature"], subtypes: ["Human", "Spellshaper"], rarity: "", power: 1, toughness: 1, rulesText: "{W}, {T}, Discard a card: Return target artifact or enchantment card from your graveyard to your hand.", mechanics: ["Spellshaper"], keywords: [], abilities: [{ kind: "activated", cost: ["{W}", "{T}", "discardCard"], target: "artifactOrEnchantmentCardInYourGraveyard", effect: "returnTargetToHand" }] },
  { id: "reavow", name: "Reavow", color: "W", colors: ["W"], img: "cards/Reavow.png", manaCost: "{W}", manaValue: 1, supertypes: [], types: ["Instant"], subtypes: [], rarity: "", rulesText: "Return target enchantment card from your graveyard to your hand.\n\nFlashback {2}{W}", mechanics: ["Flashback"], keywords: [], flashbackCost: "{2}{W}", abilities: [{ kind: "spell", target: "enchantmentCardInYourGraveyard", effect: "returnTargetToHand" }] },
  { id: "angel-form", name: "Angel Form", color: "W", colors: ["W"], img: "cards/Angel Form.png", manaCost: "{3}{W}{W}", manaValue: 5, supertypes: [], types: ["Enchantment"], subtypes: ["Manifestation"], rarity: "", rulesText: "Manifestation (When this enchantment enters, it becomes an Aura with enchant creature. Manifest the top card of your library and attach this enchantment to it.)\n\nEnchanted creature has flying and lifelink.", mechanics: ["Manifestation", "Manifest"], keywords: ["Flying", "Lifelink"], abilities: [{ kind: "keyword", name: "Manifestation" }, { kind: "static", effect: "modifyEnchantedCreature", power: 2, toughness: 2, grantKeywords: ["Flying", "Lifelink"] }] },
  { id: "disavow", name: "Disavow", color: "W", colors: ["W"], img: "cards/Disavow.png", manaCost: "{W}", manaValue: 1, supertypes: [], types: ["Instant"], subtypes: [], rarity: "", rulesText: "Destroy target enchantment.\n\nFlashback {1}{B}, Pay 2 life.", mechanics: ["Flashback"], keywords: [], flashbackCost: { mana: "{1}{B}", payLife: 2 }, abilities: [{ kind: "spell", target: "enchantment", effect: "destroyTarget" }] },
  { id: "soul-weaver", name: "Soul Weaver", color: "W", colors: ["W"], img: "cards/Soul Weaver.png", manaCost: "{2}{W}", manaValue: 3, supertypes: [], types: ["Creature"], subtypes: ["Human", "Cleric"], rarity: "", power: 1, toughness: 3, rulesText: "Whenever you cast a noncreature spell, manifest the top card of your library.", mechanics: ["Manifest"], keywords: [], abilities: [{ kind: "triggered", event: "castNoncreatureSpell", effect: "manifestTopCard" }] },
  { id: "radiant-emergence", name: "Radiant Emergence", gameStatus: "implemented", color: "W", colors: ["W"], img: "cards/Radiant Emergence.png", manaCost: "{W}{W}", manaValue: 2, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "You gain 4 life.\n\nManifest the top card of your library.", mechanics: ["Manifest"], keywords: [], abilities: [{ kind: "spell", effects: [{ effect: "gainLife", amount: 4 }, { effect: "manifestTopCard" }] }] },
  { name: "Atral Prison", color: "W", img: "cards/astral prison3.png" },
  { id: "ambush-squad", name: "Ambush Squad", color: "W", colors: ["W"], img: "cards/Ambush Squad.png", manaCost: "{1}{W}{W}", manaValue: 3, supertypes: [], types: ["Creature"], subtypes: ["Human", "Rebel"], rarity: "", power: 3, toughness: 4, rulesText: "Morph {W}\n\nWhen Ambush Squad is turned face up, untap all creatures you control.", mechanics: ["Morph"], keywords: [], morphCost: "{W}", abilities: [{ kind: "triggered", event: "turnedFaceUp", effect: "untapAllCreaturesYouControl" }] },
  { id: "exorcize", name: "Exorcize", gameStatus: "implemented", color: "W", colors: ["W"], img: "cards/Exorcize.png", manaCost: "{W}", manaValue: 1, supertypes: [], types: ["Instant"], subtypes: [], rarity: "", rulesText: "Exile target card from a graveyard.\n\nDraw a card.", mechanics: [], keywords: [], abilities: [{ kind: "spell", target: "cardInAGraveyard", effects: [{ effect: "exileTarget" }, { effect: "drawCards", amount: 1 }] }] },
  { id: "daybreak", name: "Daybreak", color: "W", colors: ["W"], img: "cards/Daybreak.png", manaCost: "{1}{W}", manaValue: 2, supertypes: [], types: ["Instant"], subtypes: [], rarity: "", rulesText: "Prevent all combat damage that would be dealt this turn.\n\nTerramorph {1}{W}", mechanics: ["Terramorph"], keywords: [], terramorphCost: "{1}{W}", abilities: [{ kind: "spell", effect: "preventAllCombatDamageThisTurn" }] },
  { id: "emissary-of-the-sands", name: "Emissary of the Sands", color: "W", colors: ["W"], img: "cards/Emissary of the Sands.png", manaCost: "{W}", manaValue: 1, supertypes: [], types: ["Creature"], subtypes: ["Human", "Nomad"], rarity: "", power: 1, toughness: 1, rulesText: "{T}: Prevent the next 1 damage that would be dealt to any target this turn.\n\nThreshold — Emissary of the Sands gets +1/+1 and has vigilance.", mechanics: ["Threshold"], keywords: ["Vigilance"], abilities: [{ kind: "activated", cost: ["{T}"], target: "anyTarget", effect: "preventNextDamage", amount: 1 }, { kind: "static", condition: "threshold", effect: "modifySelf", power: 1, toughness: 1, grantKeywords: ["Vigilance"] }] },
  { id: "guardianform", name: "Guardianform", color: "W", colors: ["W"], img: "cards/Guardianform.png", manaCost: "{3}{W}", manaValue: 4, supertypes: [], types: ["Enchantment"], subtypes: [], rarity: "", rulesText: "Manifestation (When this enchantment enters, it becomes an Aura with enchant creature. Manifest the top card of your library and attach this enchantment to it.)\n\nEnchanted creature has vigilance.", mechanics: ["Manifestation", "Manifest"], keywords: ["Vigilance"], abilities: [{ kind: "keyword", name: "Manifestation" }, { kind: "static", effect: "modifyEnchantedCreature", power: 2, toughness: 3, grantKeywords: ["Vigilance"] }] },
  { id: "purity", name: "Purity", color: "W", colors: ["W"], img: "cards/Purity.png", manaCost: "{3}{W}{W}", manaValue: 5, supertypes: [], types: ["Creature"], subtypes: ["Incarnation"], rarity: "", power: 5, toughness: 5, rulesText: "When Purity enters, exile target player's graveyard.\n\nYou may cast Purity from your graveyard by exiling seven other cards from your graveyard in addition to paying its other costs.", mechanics: [], keywords: [], abilities: [{ kind: "triggered", event: "entersBattlefield", target: "player", effect: "exileTargetPlayersGraveyard" }, { kind: "alternativeCastPermission", from: "graveyard", additionalCost: { exileOtherCardsFromYourGraveyard: 7 } }] },
  { id: "selfless-saint", name: "Selfless Saint", color: "W", colors: ["W"], img: "cards/Selfless Saint.png", manaCost: "{1}{W}", manaValue: 2, supertypes: [], types: ["Creature"], subtypes: ["Human", "Cleric"], rarity: "", power: 2, toughness: 2, rulesText: "Discard a card: Prevent the next 2 damage that would be dealt to any target this turn.\n\nThreshold — Sacrifice Selfless Saint: Gain 4 life.", mechanics: ["Threshold"], keywords: [], abilities: [{ kind: "activated", cost: ["discardCard"], target: "anyTarget", effect: "preventNextDamage", amount: 2 }, { kind: "activated", condition: "threshold", cost: ["sacrificeSelf"], effect: "gainLife", amount: 4 }] },
  { id: "soul-summoner", name: "Soul Summoner", gameStatus: "implemented", color: "W", colors: ["W"], img: "cards/Soul Summoner.png", manaCost: "{W}", manaValue: 1, supertypes: [], types: ["Creature"], subtypes: ["Human", "Spellshaper"], rarity: "", power: 1, toughness: 1, rulesText: "{1}{W}, {T}, Discard a card: Manifest the top card of your library.", mechanics: ["Manifest", "Spellshaper"], keywords: [], abilities: [{ kind: "activated", cost: ["{1}{W}", "{T}", "discardCard"], effect: "manifestTopCard" }] },
//Black
  { id: "ensoul", name: "Ensoul", gameStatus: "implemented", color: "B", colors: ["B"], img: "cards/Ensoul.png", manaCost: "{B}", manaValue: 1, supertypes: [], types: ["Instant"], subtypes: [], rarity: "", rulesText: "Exile target creature card from a graveyard.\n\nManifest the top card of your library.", mechanics: ["Manifest"], keywords: [], abilities: [{ kind: "spell", target: "creatureCardInAGraveyard", effects: [{ effect: "exileTarget" }, { effect: "manifestTopCard" }] }] },
  { id: "bloodmoth", name: "Bloodmoth", color: "B", colors: ["B"], img: "cards/Bloodmoth.png", manaCost: "{1}{B}", manaValue: 2, supertypes: [], types: ["Creature"], subtypes: ["Faerie", "Vampire"], rarity: "", power: 1, toughness: 2, rulesText: "Flying, lifelink\n\nThreshold — Bloodmoth gets +2/+0.", mechanics: ["Threshold"], keywords: ["Flying", "Lifelink"], abilities: [{ kind: "static", condition: "threshold", effect: "modifySelf", power: 2, toughness: 0 }] },
  { id: "eyeblight-interrogator", name: "Eyeblight Interrogator", color: "B", colors: ["B"], img: "cards/Eyeblight Interrogator.png", manaCost: "{B}", manaValue: 1, supertypes: [], types: ["Creature"], subtypes: ["Human"], rarity: "", power: 1, toughness: 1, rulesText: "Whenever this creature deals combat damage to an opponent, you may sacrifice it. If you do, look at that player’s hand. Choose a nonland card from it. That player discards that card.", mechanics: [], keywords: [], abilities: [{ kind: "triggered", event: "dealsCombatDamageToOpponent", optionalCost: "sacrificeSelf", target: "damagedOpponent", effect: "lookAtHandAndDiscardChosenNonlandCard" }] },
  { id: "divide-spirit-and-flesh", name: "Divide Spirit and Flesh", gameStatus: "implemented", color: "B", colors: ["B"], img: "cards/Divide Spirit and Flesh.png", manaCost: "{1}{B}{B}", manaValue: 3, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "As an additional cost to cast this spell, sacrifice a creature or pay 5 life.\n\nManifest the top two cards of your library.", mechanics: ["Manifest"], keywords: [], additionalCost: { choose: ["sacrificeCreature", { payLife: 5 }] }, abilities: [{ kind: "spell", effect: "manifestTopCards", amount: 2 }] },
  { id: "haunting-edict", name: "Haunting Edict", color: "B", colors: ["B"], img: "cards/Haunting Edict.png", manaCost: "{1}{B}", manaValue: 2, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "Target player loses 1 life and sacrifices a creature.\n\nSpellmorph {B}", mechanics: ["Spellmorph"], keywords: [], spellmorphCost: "{B}", abilities: [{ kind: "spell", target: "player", effects: [{ effect: "loseLife", amount: 1 }, { effect: "sacrificeCreature", amount: 1 }] }] },
  { name: "Ray of Disintegration", color: "B", img: "cards/Ray of Disintegration.png" },
  { name: "Sacraficial Beast", color: "B", img: "cards/Sacraficial Beast.png" },
  {
    id: "astral-possession", name: "Astral Possession", color: "B", colors: ["B"],
    img: "cards/astral possession.png", manaCost: "{1}{B}{B}", manaValue: 3,
    supertypes: [], types: ["Enchantment"], subtypes: ["Aura"], rarity: "",
    rulesText: "Enchant creature\nWhen enchanted creature dies, return that card to the battlefield under your control.\n\nSpellmorph {B}",
    mechanics: ["Spellmorph"], keywords: ["Enchant"], spellmorphCost: "{B}",
    abilities: [{ kind: "triggered", event: "enchantedCreatureDies", effect: "returnThatCardToBattlefield", controller: "you" }]
  },
  { id: "biezels-plague", name: "Biezel’s Plague", color: "B", colors: ["B"], img: "cards/Biezels Plague.png", manaCost: "{X}{1}{B}{B}", manaValue: 3, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "All creatures get two times -X/-X until end of turn.\n\nSpellmorph {X}{B}", mechanics: ["Spellmorph"], keywords: [], spellmorphCost: "{X}{B}", abilities: [{ kind: "spell", effect: "modifyAllCreaturesUntilEndOfTurn", powerExpression: "-2X", toughnessExpression: "-2X" }] },
  { id: "crypt-breaker", name: "Crypt Breaker", color: "B", colors: ["B"], img: "cards/Crypt Breaker.png", manaCost: "{1}{B}", manaValue: 2, supertypes: [], types: ["Creature"], subtypes: ["Zombie", "Wizard"], rarity: "", power: 1, toughness: 3, rulesText: "{1}, {T}, Sacrifice a land: Return target creature card from your graveyard to your hand.", mechanics: [], keywords: [], abilities: [{ kind: "activated", cost: ["{1}", "{T}", "sacrificeLand"], target: "creatureCardInYourGraveyard", effect: "returnTargetToHand" }] },
  { name: "Restless Earth", color: "B", img: "cards/Restless Earth.png" },
  { name: "Nethervoid Sorceress", color: "B", img: "cards/nethervoid sorceress.png" },
  { name: "Desecrate", color: "B", img: "cards/Desecrate.png" },
//Blue
  {
    id: "rite-of-reclamation", name: "Rite of Reclamation", gameStatus: "implemented", color: "G", colors: ["G"],
    img: "cards/Rite of Reclamationalt.png", manaCost: "{2}{G}", manaValue: 3,
    supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "",
    rulesText: "Destroy up to one target artifact or enchantment.\n\nManifest the top card of your library.",
    mechanics: ["Manifest"], keywords: [],
    abilities: [{ kind: "spell", effects: [
      { effect: "destroyTarget", target: "upToOneArtifactOrEnchantment" },
      { effect: "manifestTopCard" }
    ] }]
  },
  { name: "Force Mage", color: "U", img: "cards/Force Mage.png" },
  { name: "Nautilus", color: "U", img: "cards/Nautilus.png" },
  { name: "Runic Inscriptions", color: "U", img: "cards/Runic Inscriptions3.png" },
  { name: "Fathom Caster", color: "U", img: "cards/Fathom Caster.png" },
  { name: "Cryptic Writings", color: "U", img: "cards/Cryptic Writings.png" },
  { name: "Faeries Trick", color: "U", img: "cards/Faeries Trick.png" },
  { name: "Ocean Mists", color: "U", img: "cards/Ocean Mists.png" },
  { name: "Recirculate", color: "U", img: "cards/Recirculate.png" },
  { name: "Spying Familiar", color: "U", img: "cards/Spying Familiar.png" },
  { name: "Stormbound Spirit", color: "U", img: "cards/Stormbound Spirit.png" },
  {
    id: "flame-birth", name: "Flame Birth", gameStatus: "implemented", color: "R", colors: ["R"],
    img: "cards/Flame_Birth.png", manaCost: "{1}{R}{R}", manaValue: 3,
    supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "",
    rulesText: "Manifest the top card of your library. It gains haste until end of turn.\n\nMadness {R}",
    mechanics: ["Manifest", "Madness"], keywords: ["Haste"], madnessCost: "{R}",
    abilities: [{ kind: "spell", effects: ["manifestTopCard", "grantHasteUntilEndOfTurn"] }]
  },
  { name: "Vision of Fire", color: "R", img: "cards/Vision of Fire.png" },
  { name: "Erupt", color: "R", img: "cards/Erupt.png" },
  { name: "Geomancer", color: "R", img: "cards/Geomancer.png" },
  { name: "Lightning Orb", color: "R", img: "cards/Lightning Orb.png" },
  { name: "Earth Baron", color: "R", img: "cards/Earth Baron.png" },
  {
    id: "hidden-strength", name: "Hidden Strength", color: "G", colors: ["G"],
    img: "cards/Hidden Strength.png", manaCost: "{1}{G}", manaValue: 2,
    supertypes: [], types: ["Enchantment"], subtypes: ["Aura"], rarity: "",
    rulesText: "Enchant creature\nEnchanted creature gets +2/+2 and has trample.\n\nSpellmorph {G}",
    mechanics: ["Spellmorph"], keywords: ["Enchant", "Trample"], spellmorphCost: "{G}",
    abilities: [{ kind: "static", effect: "modifyEnchantedCreature", power: 2, toughness: 2, grantKeywords: ["Trample"] }]
  },
  {
    id: "lost-horizon", name: "Lost Horizon", color: "G", colors: ["G"],
    img: "cards/Lost Horizon.png", manaCost: "{G}", manaValue: 1,
    supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "",
    rulesText: "Search your library for a Forest card, reveal it, put it into your hand, then shuffle.\n\nMadness {0}",
    mechanics: ["Madness"], keywords: [], madnessCost: "{0}",
    abilities: [{ kind: "spell", effect: "searchLibrary", search: "ForestCard", reveal: true, destination: "hand", then: "shuffle" }]
  },
  {
    id: "moss-knight", name: "Moss Knight", color: "G", colors: ["G"],
    img: "cards/Moss Knight.png", manaCost: "{1}{G}", manaValue: 2,
    supertypes: [], types: ["Creature"], subtypes: ["Elemental", "Knight"], rarity: "", power: 2, toughness: 2,
    rulesText: "Trample\n\nMorph—Discard a green card.\n\nWhen Moss Knight is turned face up, target creature gets +3/+3 until end of turn.",
    mechanics: ["Morph"], keywords: ["Trample"], morphCost: { discard: "greenCard" },
    abilities: [{ kind: "triggered", event: "turnedFaceUp", target: "creature", effect: "modifyUntilEndOfTurn", power: 3, toughness: 3 }]
  },
  { name: "Spirit Call", color: "G", img: "cards/Spirit Call.png" },
  { name: "Woodform", color: "G", img: "cards/Woodform.png" },
  { name: "Earthbound Satyr", color: "G", img: "cards/Earthbound Satyr.png" },
  { name: "Evogenesis", color: "G", img: "cards/Evogenesis.png" },
  { name: "Earten Elemental", color: "G", img: "cards/Earthen Elemental.png" },
  {
    id: "kolani-beastmaster", name: "Kolani Beastmaster", color: "G", colors: ["G"],
    img: "cards/Kolani Beastmaster.png", manaCost: "{G}{G}", manaValue: 2,
    supertypes: [], types: ["Creature"], subtypes: ["Human"], rarity: "", power: 3, toughness: 2,
    rulesText: "{1}{G}: Target land becomes a 3/3 green Beast creature with haste until end of turn. It's still a land.",
    mechanics: [], keywords: ["Haste"],
    abilities: [{ kind: "activated", cost: ["{1}{G}"], target: "land", effect: "animateLandUntilEndOfTurn", power: 3, toughness: 3, color: "G", subtype: "Beast", grantKeywords: ["Haste"], retainsTypes: true }]
  },
  {
    id: "leaf-turner", name: "Leaf Turner", color: "G", colors: ["G"],
    img: "cards/Leaf Turner.png", manaCost: "{G}", manaValue: 1,
    supertypes: [], types: ["Creature"], subtypes: ["Dryad", "Spellshaper"], rarity: "", power: 1, toughness: 1,
    rulesText: "{G}, {T}, Discard a card, Sacrifice a land: Search your library for a land card, put that card onto the battlefield, then shuffle.\n\n{1}{G}, {T}, Discard a card: Reveal the top four cards of your library. Put all land cards revealed this way into your hand and the rest into your graveyard.",
    mechanics: ["Spellshaper"], keywords: [],
    abilities: [
      { kind: "activated", cost: ["{G}", "{T}", "discardCard", "sacrificeLand"], effect: "searchLibrary", search: "landCard", destination: "battlefield", then: "shuffle" },
      { kind: "activated", cost: ["{1}{G}", "{T}", "discardCard"], effect: "revealTopCards", amount: 4, landDestination: "hand", otherDestination: "graveyard" }
    ]
  },
  { name: "Chameleon", color: "G", img: "cards/Chameleon.png" },
  { name: "Rootbound Dryads", color: "G", img: "cards/Rootbound Dryads.png" },
  { name: "Crown of Leaves", color: "G", img: "cards/Crown of Leaves.png" },
  { name: "Leaping Baloth", color: "G", img: "cards/Leaping Baloth.png" },
  {
    id: "wolf-form", name: "Wolf Form", color: "G", colors: ["G"],
    img: "cards/Wolf Form.png", manaCost: "{1}{G}", manaValue: 2,
    supertypes: [], types: ["Enchantment"], subtypes: ["Manifestation"], rarity: "",
    rulesText: "Manifestation (When this enchantment enters, it becomes an Aura with enchant creature. Manifest the top card of your library and attach this enchantment to it.)\n\nDiscard a card: Enchanted creature gets +1/+1 until end of turn.",
    mechanics: ["Manifestation", "Manifest"], keywords: [],
    abilities: [
      { kind: "keyword", name: "Manifestation" },
      { kind: "activated", cost: ["discardCard"], effect: "modifyEnchantedCreatureUntilEndOfTurn", power: 1, toughness: 1 }
    ]
  },
  {
    id: "vision-of-gaea", name: "Vision of Gaea", color: "G", colors: ["G"],
    img: "cards/Vision of Gaea.png", manaCost: "{2}{G}{G}", manaValue: 4,
    supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "",
    rulesText: "Draw two cards. Put a card from your hand onto the battlefield face down as a land with ‘{T}: Add {C}.’\n\nSpellmorph {1}{G}",
    mechanics: ["Spellmorph"], keywords: [], spellmorphCost: "{1}{G}",
    abilities: [{ kind: "spell", effects: [
      { effect: "drawCards", amount: 2 },
      { effect: "putCardFromHandFaceDownAsLand", manaAbility: "{T}: Add {C}" }
    ] }]
  },
  { name: "Valcos Beast", color: "G", img: "cards/Valcos Beast.png" },
  {
    id: "ygsoui-steed", name: "Ygsoui Steed", color: "G", colors: ["G"],
    img: "cards/Ygsoui Steed.png", manaCost: "{G}", manaValue: 1,
    supertypes: [], types: ["Artifact", "Creature"], subtypes: ["Horse"], rarity: "", power: 0, toughness: 1,
    rulesText: "{T}: Add {B}, {G}, or {U}.\n\nMorph {0}",
    mechanics: ["Morph"], keywords: [], morphCost: "{0}",
    abilities: [{ kind: "activated", cost: ["{T}"], effect: "addManaChoice", choices: ["B", "G", "U"], amount: 1 }]
  },
//Multicolor
  {
    id: "brimstone", name: "Brimstone", color: "M", colors: ["B", "R"],
    img: "cards/Brimstone.png", manaCost: "{1}{B}{R}", manaValue: 3,
    supertypes: [], types: ["Instant"], subtypes: [], rarity: "",
    rulesText: "Add five mana in any combination of {B} and/or {R}.\n\nTerramorph {3}",
    mechanics: ["Terramorph"], keywords: [], terramorphCost: "{3}",
    abilities: [{ kind: "spell", effect: "addManaCombination", amount: 5, choices: ["B", "R"] }]
  },
  { id: "aethersplice", name: "Aethersplice", gameStatus: "implemented", color: "M", colors: ["G", "U"], img: "cards/Aethersplice.png", manaCost: "{2}{G}{U}", manaValue: 4, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "Manifest the top two cards of your library.\n\nSpellmorph {G}{U}", mechanics: ["Manifest", "Spellmorph"], keywords: [], spellmorphCost: "{G}{U}", abilities: [{ kind: "spell", effect: "manifestTopCards", amount: 2 }] },
  {
    id: "bloodfire-witch", name: "Bloodfire Witch", color: "M", colors: ["B", "R"],
    img: "cards/Bloodfire Witch.png", manaCost: "{B}{R}", manaValue: 2,
    supertypes: [], types: ["Creature"], subtypes: ["Vampire", "Wizard"], rarity: "", power: 1, toughness: 3,
    rulesText: "{1}, Sacrifice another creature: Target instant or sorcery card in your graveyard gains flashback until end of turn. The flashback cost is equal to its mana cost.",
    mechanics: ["Flashback"], keywords: [],
    abilities: [{ kind: "activated", cost: ["{1}", "sacrificeAnotherCreature"], target: "instantOrSorceryCardInYourGraveyard", effect: "grantFlashbackUntilEndOfTurn", flashbackCost: "manaCost" }]
  },
  { name: "Arcane Conjurer", color: "M", img: "cards/arcane conjurer.png" },
  {
    id: "boon-giver", name: "Boon Giver", color: "M", colors: ["G", "W"],
    img: "cards/Boon Giver.png", manaCost: "{G}{W}", manaValue: 2,
    supertypes: [], types: ["Creature"], subtypes: ["Dryad"], rarity: "", power: 2, toughness: 2,
    rulesText: "Whenever you cast an Aura spell targeting Boon Giver, you may manifest the top card of your library. If you do, that creature becomes the target of that Aura.",
    mechanics: ["Manifest"], keywords: [],
    abilities: [{ kind: "triggered", event: "castAuraTargetingSelf", optional: true, effects: ["manifestTopCard", "retargetAuraToManifestedCreature"] }]
  },
  { id: "fireborn-sirens", name: "Fireborn Sirens", color: "M", colors: ["U", "R"], img: "cards/Fireborn Sirens.png", manaCost: "{U/R}{U/R}", manaValue: 2, supertypes: [], types: ["Creature"], subtypes: ["Siren"], rarity: "", power: 2, toughness: 2, rulesText: "Morph {U/R}\n\nWhen Fireborn Sirens is turned face up, if {U} was spent to do so, return target creature to its owner's hand. If {R} was spent, it deals 2 damage to any target.", mechanics: ["Morph"], keywords: [], morphCost: "{U/R}", abilities: [{ kind: "triggered", event: "turnedFaceUp", effectsByManaSpent: { U: "returnTargetCreatureToOwnersHand", R: "deal2DamageToAnyTarget" } }] },
  { id: "careful-looting", name: "Careful Looting", gameStatus: "implemented", color: "M", colors: ["U", "R"], img: "cards/Careful Looting.png", manaCost: "{U/R}", manaValue: 1, supertypes: [], types: ["Instant"], subtypes: [], rarity: "", rulesText: "Draw a card, then discard a card.\n\nFlashback {U/R}", mechanics: ["Flashback"], keywords: [], flashbackCost: "{U/R}", abilities: [{ kind: "spell", effects: [{ effect: "drawCards", amount: 1 }, { effect: "discardCards", amount: 1 }] }] },
  { id: "thought-form", name: "Thought Form", color: "M", colors: ["U", "B"], img: "cards/Thought Form.png", manaCost: "{U/B}", manaValue: 1, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "Look at target player's hand and any face-down permanents they control. Draw a card if {U} was spent to cast this spell. That player discards a card if {B} was spent to cast this spell.\n\nSpellmorph {X}", mechanics: ["Spellmorph"], keywords: [], spellmorphCost: "{X}", abilities: [{ kind: "spell", target: "player", effects: ["lookAtHandAndFaceDownPermanents", "blueSpentDrawCard", "blackSpentTargetPlayerDiscardsCard"] }] },
  {
    id: "ghastform", name: "Ghastform", color: "M", colors: ["W", "B"],
    img: "cards/Ghastform.png", manaCost: "{W}{B}", manaValue: 2,
    supertypes: [], types: ["Enchantment"], subtypes: [], rarity: "",
    rulesText: "Manifestation (When this enchantment enters, it becomes an Aura with enchant creature. Manifest the top card of your library and attach this enchantment to it.)\n\nEnchanted creature has deathtouch and lifelink.",
    mechanics: ["Manifestation", "Manifest"], keywords: ["Deathtouch", "Lifelink"],
    abilities: [{ kind: "keyword", name: "Manifestation" }, { kind: "static", effect: "grantKeywordsToEnchantedCreature", keywords: ["Deathtouch", "Lifelink"] }]
  },
  { id: "justify", name: "Justify", color: "W", colors: ["W"], img: "cards/Justify.png", manaCost: "{1}{W}{W}", manaValue: 3, supertypes: [], types: ["Instant"], subtypes: [], rarity: "", rulesText: "Destroy target attacking creature.\n\nMadness {W}", mechanics: ["Madness"], keywords: [], madnessCost: "{W}", abilities: [{ kind: "spell", target: "attackingCreature", effect: "destroyTarget" }] },
  { name: "Noctivarius", color: "M", img: "cards/Noctivarius.png" },
  { name: "Serpents Grasp", color: "M", img: "cards/Serpents Grasp.png" },
  { name: "Shadow of Nahaz", color: "M", img: "cards/shadow of nahaz1.png" },
  { id: "windform", name: "Windform", color: "M", colors: ["W", "U"], img: "cards/Windform.png", manaCost: "{W}{U}", manaValue: 2, supertypes: [], types: ["Enchantment"], subtypes: ["Manifestation"], rarity: "", rulesText: "Manifestation (When this enchantment enters, it becomes an Aura with enchant creature. Manifest the top card of your library and attach this enchantment to it.)\n\nEnchanted creature has flying.", mechanics: ["Manifestation", "Manifest"], keywords: ["Flying"], abilities: [{ kind: "keyword", name: "Manifestation" }, { kind: "static", effect: "grantKeywordsToEnchantedCreature", keywords: ["Flying"] }] },
  { id: "animize", name: "Animize", gameStatus: "implemented", color: "M", colors: ["R", "G"], img: "cards/Animize.png", manaCost: "{R/G}{G}", manaValue: 2, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "Manifest the top card of your library.\n\nAdd {R}{R} or {G}{G}.", mechanics: ["Manifest"], keywords: [], abilities: [{ kind: "spell", effects: [{ effect: "manifestTopCard" }, { effect: "addManaChoice", choices: ["RR", "GG"] }] }] },
  { name: "Crypt Stalker", color: "M", img: "cards/crypt stalker.png" },
  { id: "spiritguide-shaman", name: "Spiritguide Shaman", color: "M", colors: ["R", "G"], img: "cards/Spiritguide Shaman.png", manaCost: "{R/G}", manaValue: 1, supertypes: [], types: ["Creature"], subtypes: ["Human", "Shaman"], rarity: "", power: 1, toughness: 1, rulesText: "{T}, Discard a card: Add {R} or {G}.\n\nThreshold — {T}, Discard a card: Add {R}{G}. (Activate only if seven or more cards are in your graveyard.)", mechanics: ["Threshold"], keywords: [], abilities: [{ kind: "activated", cost: ["{T}", "discardCard"], effect: "addManaChoice", choices: ["R", "G"] }, { kind: "activated", condition: "threshold", cost: ["{T}", "discardCard"], effect: "addMana", mana: "RG" }] },
  { id: "valorform", name: "Valorform", color: "M", colors: ["G", "W"], img: "cards/Valorform.png", manaCost: "{G}{W}", manaValue: 2, supertypes: [], types: ["Enchantment"], subtypes: ["Manifestation"], rarity: "", rulesText: "Manifestation (When this enchantment enters, it becomes an Aura with enchant creature. Manifest the top card of your library and attach this enchantment to it.)", mechanics: ["Manifestation", "Manifest"], keywords: [], abilities: [{ kind: "keyword", name: "Manifestation" }] },
  { name: "Avaragos the Abyss", color: "M", img: "cards/avaragos the abyss.png" },
  { id: "cloudburst", name: "Cloudburst", color: "M", colors: ["W", "U"], img: "cards/Cloudburst.png", manaCost: "{W/U}", manaValue: 1, supertypes: [], types: ["Instant"], subtypes: [], rarity: "", rulesText: "Return target permanent you control to its owner's hand.\nFlashback {W}{U}", mechanics: ["Flashback"], keywords: [], flashbackCost: "{W}{U}", abilities: [{ kind: "spell", target: "permanentYouControl", effect: "returnToOwnersHand" }] },
  { name: "Shaper's Chant", color: "M", img: "cards/shapers chant.png" },
  { id: "ghost-blade-adept", name: "Ghost-Blade Adept", color: "M", colors: ["W", "U"], img: "cards/Ghost-Blade Adept.png", manaCost: "{W}{U}", manaValue: 2, supertypes: [], types: ["Creature"], subtypes: ["Human", "Wizard"], rarity: "", power: 0, toughness: 3, rulesText: "Whenever Ghost-Blade Adept attacks, manifest the top card of your library tapped and attacking. Put it on the top or bottom of its owner's library at end of combat.", mechanics: ["Manifest"], keywords: [], abilities: [{ kind: "triggered", event: "attacks", effects: ["manifestTopCardTappedAndAttacking", "putThatCardTopOrBottomAtEndOfCombat"] }] },
  { name: "Biezel's Masque", color: "M", img: "cards/biezels masque.png" },
  { name: "Mystify", color: "M", img: "cards/mystify.png" },
  { name: "Maddening Whispers", color: "M", img: "cards/maddening whispers.png" },
  { id: "dread-chant", name: "Dread Chant", gameStatus: "implemented", color: "M", colors: ["B", "R"], img: "cards/Dread Chant.png", manaCost: "{B}{R}", manaValue: 2, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "Manifest the top card of your library. It gets +1/+0 and gains trample and haste. Sacrifice it at end of turn.\n\nFlashback {1}{B}{R}", mechanics: ["Manifest", "Flashback"], keywords: ["Trample", "Haste"], flashbackCost: "{1}{B}{R}", abilities: [{ kind: "spell", effects: ["manifestTopCard", "grantPlus1Plus0TrampleHaste", "sacrificeItAtEndOfTurn"] }] },
  { id: "empower", name: "Empower", color: "M", colors: ["R", "W"], img: "cards/Empower.png", manaCost: "{R/W}{R/W}", manaValue: 2, supertypes: [], types: ["Enchantment"], subtypes: ["Aura"], rarity: "", rulesText: "Enchant creature\nEnchanted creature gets +2/+1 and has first strike.\n\nMadness {R/W}", mechanics: ["Madness"], keywords: ["Enchant", "First strike"], madnessCost: "{R/W}", abilities: [{ kind: "static", effect: "modifyEnchantedCreature", power: 2, toughness: 1, grantKeywords: ["First strike"] }] },
  { name: "Glorious Emergence", color: "M", img: "cards/glorious emergence2.png" },
  { name: "Alezhar Sorcerer", color: "M", img: "cards/alezhar sorcerer.png" },
  { name: "Aravel Soul Hunter", color: "M", img: "cards/Aravel Soul Hunter.png" },
  { name: "Al-Fazol", color: "M", img: "cards/al-fazol2.png" },
  { name: "Thaltar Vilewind", color: "M", img: "cards/thaltar vilewind2.png" },
// Artifacts
  { name: "Herbalists Relics", color: "A", img: "cards/Herbalists Relicsland.png" },
  { name: "Forgotten Tower", color: "A", img: "cards/Forgotten Tower.png" },
  { name: "Creation Lattice", color: "A", img: "cards/Creation Lattice.png" },
  {
    id: "ethereal-isle", name: "Ethereal Isle", color: "NB", colors: [],
    img: "cards/Ethereal Isle.png", manaCost: null, manaValue: 0,
    supertypes: [], types: ["Land"], subtypes: [], rarity: "",
    rulesText: "{T}, Exile Ethereal Isle: Put the top card of your library onto the battlefield face down and tapped as a Plains Island land with shroud and ‘{2}: Return this land to its owner’s hand.’",
    mechanics: ["Face-down land"], keywords: ["Shroud"],
    abilities: [{ kind: "activated", cost: ["{T}", "exileSelf"], effects: [{ effect: "putTopCardFaceDownAsLand", tapped: true, landTypes: ["Plains", "Island"], grantKeywords: ["Shroud"], grantAbilities: [{ kind: "activated", cost: ["{2}"], effect: "returnSelfToOwnersHand" }] }] }]
  },
  { name: "Isle of Night", color: "NB", img: "cards/Isle of Night.png" },
  { name: "Brimstone Crag", color: "NB", img: "cards/Brimstone Crag.png" },
  {
    id: "wooded-spire", name: "Wooded Spire", color: "NB", colors: [],
    img: "cards/Wooded Spire.png", manaCost: null, manaValue: 0,
    supertypes: [], types: ["Land"], subtypes: [], rarity: "",
    rulesText: "{T}, Exile Wooded Spire: Put the top card of your library onto the battlefield face down and tapped as a Mountain Forest land with shroud and ‘{2}: Return this land to its owner’s hand.’",
    mechanics: ["Face-down land"], keywords: ["Shroud"],
    abilities: [{ kind: "activated", cost: ["{T}", "exileSelf"], effects: [{ effect: "putTopCardFaceDownAsLand", tapped: true, landTypes: ["Mountain", "Forest"], grantKeywords: ["Shroud"], grantAbilities: [{ kind: "activated", cost: ["{2}"], effect: "returnSelfToOwnersHand" }] }] }]
  },
  { name: "Luminous Grove", color: "NB", img: "cards/Luminous Grove.png" },
  {
    id: "forest-2", name: "Forest", color: "BL", colors: [], img: "cards/Forest2.png",
    manaCost: null, manaValue: 0, supertypes: ["Basic"], types: ["Land"], subtypes: ["Forest"], rarity: "",
    rulesText: "{T}: Add {G}.", mechanics: [], keywords: [],
    abilities: [{ kind: "mana", cost: ["{T}"], effect: "addMana", mana: "G", amount: 1 }]
  },
  {
    id: "forest-7", name: "Forest", color: "BL", colors: [], img: "cards/forest7.png",
    manaCost: null, manaValue: 0, supertypes: ["Basic"], types: ["Land"], subtypes: ["Forest"], rarity: "",
    rulesText: "{T}: Add {G}.", mechanics: [], keywords: [],
    abilities: [{ kind: "mana", cost: ["{T}"], effect: "addMana", mana: "G", amount: 1 }]
  },
  {
    id: "forest-8", name: "Forest", color: "BL", colors: [], img: "cards/Forest8.png",
    manaCost: null, manaValue: 0, supertypes: ["Basic"], types: ["Land"], subtypes: ["Forest"], rarity: "",
    rulesText: "{T}: Add {G}.", mechanics: [], keywords: [],
    abilities: [{ kind: "mana", cost: ["{T}"], effect: "addMana", mana: "G", amount: 1 }]
  },
  {
    id: "swamp-1", name: "Swamp", color: "BL", colors: [], img: "cards/Swamp.png",
    manaCost: null, manaValue: 0, supertypes: ["Basic"], types: ["Land"], subtypes: ["Swamp"], rarity: "",
    rulesText: "{T}: Add {B}.", mechanics: [], keywords: [],
    abilities: [{ kind: "mana", cost: ["{T}"], effect: "addMana", mana: "B", amount: 1 }]
  },
  {
    id: "mountain-4", name: "Mountain", color: "BL", colors: [], img: "cards/Mountain4.png",
    manaCost: null, manaValue: 0, supertypes: ["Basic"], types: ["Land"], subtypes: ["Mountain"], rarity: "",
    rulesText: "{T}: Add {R}.", mechanics: [], keywords: [],
    abilities: [{ kind: "mana", cost: ["{T}"], effect: "addMana", mana: "R", amount: 1 }]
  },
  {
    id: "mountain-7", name: "Mountain", color: "BL", colors: [], img: "cards/Mountain7.png",
    manaCost: null, manaValue: 0, supertypes: ["Basic"], types: ["Land"], subtypes: ["Mountain"], rarity: "",
    rulesText: "{T}: Add {R}.", mechanics: [], keywords: [],
    abilities: [{ kind: "mana", cost: ["{T}"], effect: "addMana", mana: "R", amount: 1 }]
  },

  { id: "aeon", name: "Aeon", color: "M", colors: ["U", "W", "B"], img: "cards/Aeon.png", manaCost: "{3}{U}{W}{B}", manaValue: 6, supertypes: ["Legendary"], types: ["Creature"], subtypes: ["Avatar"], rarity: "", power: 5, toughness: 8, rulesText: "Whenever you would take damage, mill three times that many cards instead.\n\nWhenever you would gain life, put up to three times that many target cards from your graveyard on top of your library in any order instead.", mechanics: ["Replacement effect"], keywords: [], abilities: [{ kind: "replacement", event: "wouldTakeDamage", effect: "millTriple" }, { kind: "replacement", event: "wouldGainLife", effect: "putUpToTripleTargetCardsFromGraveyardOnTopOfLibrary" }] },
  { id: "colossus", name: "Colossus", color: "M", colors: ["R", "G", "W"], img: "cards/Colossus.png", manaCost: "{5}{R}{G}{W}", manaValue: 8, supertypes: ["Legendary"], types: ["Creature"], subtypes: ["Giant"], rarity: "", power: 10, toughness: 10, rulesText: "Trample, vigilance, reach\n\nWhen Colossus dies, destroy all lands.", mechanics: [], keywords: ["Trample", "Vigilance", "Reach"], abilities: [{ kind: "triggered", event: "dies", effect: "destroyAllLands" }] },
  { id: "grove-artisan", name: "Grove Artisan", color: "G", colors: ["G"], img: "cards/Grove Artisan.png", manaCost: "{2}{G}", manaValue: 3, supertypes: [], types: ["Creature"], subtypes: ["Elf", "Druid"], rarity: "", power: 2, toughness: 3, rulesText: "You may play cards from your hand face down as lands with ‘{T}: Add {C}.’\n\nFace-down lands are Forests in addition to their other types.", mechanics: ["Face-down land"], keywords: [], abilities: [{ kind: "static", effect: "allowCardsFromHandFaceDownAsLands", manaAbility: "{T}: Add {C}" }, { kind: "static", effect: "faceDownLandsGainSubtype", subtype: "Forest" }] },
  { id: "phantom-zarghol", name: "Phantom Zarghol", color: "M", colors: ["G", "W", "U"], img: "cards/Phantom Zarghol.png", manaCost: "{2}{G}{W}{U}", manaValue: 5, supertypes: ["Legendary"], types: ["Creature"], subtypes: ["Illusion", "Beast"], rarity: "", power: 5, toughness: 5, rulesText: "Flying, shroud\n\nWhen Phantom Zarghol enters, exile it and the top two cards of your library in a face down pile, shuffle that pile, then manifest those cards.", mechanics: ["Manifest"], keywords: ["Flying", "Shroud"], abilities: [{ kind: "triggered", event: "enters", effects: ["exileSelfAndTopTwoFaceDown", "shuffleThatPile", "manifestThoseCards"] }] },
  { id: "solegar", name: "Solegar", color: "M", colors: ["R", "G"], img: "cards/Solegar.png", manaCost: "{3}{R}{G}", manaValue: 5, supertypes: ["Legendary"], types: ["Creature"], subtypes: ["Human", "Shaman"], rarity: "", power: 3, toughness: 4, rulesText: "At the beginning of combat on your turn, manifest each card from your hand, then draw three cards. Those creatures gain haste. Sacrifice them at end of turn.", mechanics: ["Manifest"], keywords: ["Haste"], abilities: [{ kind: "triggered", event: "beginningOfCombatOnYourTurn", effects: ["manifestEachCardFromHand", "drawThreeCards", "grantThoseCreaturesHaste", "sacrificeThemAtEndOfTurn"] }] },
  { id: "undergrowth-summons", name: "Undergrowth Summons", gameStatus: "implemented", color: "M", colors: ["B", "G"], img: "cards/Undergrowth Summons.png", manaCost: "{B}{G}", manaValue: 2, supertypes: [], types: ["Sorcery"], subtypes: [], rarity: "", rulesText: "Look at the top four cards of your library. Manifest one of them. Put the rest into your graveyard.", mechanics: ["Manifest"], keywords: [], abilities: [{ kind: "spell", effect: "lookTopChooseManifestRestGraveyard", amount: 4 }] },
  { id: "yol-goro", name: "Yol Goro", color: "M", colors: ["G", "U"], img: "cards/Yol Goro.png", manaCost: "{4}{G}{U}", manaValue: 6, supertypes: ["Legendary"], types: ["Creature"], subtypes: ["Shapeshifter"], rarity: "", power: 5, toughness: 7, rulesText: "Exile a permanent you control: Yol Goro becomes a copy of the exiled permanent card for as long as that card remains exiled, except it has ‘{0}: Put the exiled card on the bottom of its owner's library.’", mechanics: ["Copy"], keywords: [], abilities: [{ kind: "activated", cost: ["exilePermanentYouControl"], effect: "copyExiledPermanentWhileExiled", grantAbility: "{0}: Put the exiled card on the bottom of its owner's library." }] },
  // ... (add all remaining cards here)
];
