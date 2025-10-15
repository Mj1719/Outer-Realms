
Outer Realms — Starter Gallery
----------------------------

What's included:
- index.html
- style.css (medieval / dark vellum look)
- script.js (loads images.json and handles filtering)
- images.json (manifest listing card files)
- cards/ (placeholder card images to show how layout works)
- fonts/ (empty; the site uses Google Fonts by default)

How it works:
1. images.json is a simple manifest containing objects with:
   { "filename": "cards/W01.png", "title": "White Example 01", "type": "W" }

   - Allowed type codes: W, U, B, R, G, M (Multicolor), A (Artifact), NB (Non-Basic Land), BL (Basic Land)
   - The script loads images.json and dynamically creates the gallery.
   - To add your own cards, add the image files to the /cards folder, and update images.json accordingly.

2. Naming convention (recommended):
   - White: W01.png, W02.png, ...
   - Blue: U01.png, ...
   - Black: B01.png, ...
   - Red: R01.png, ...
   - Green: G01.png, ...
   - Multicolor: M01.png, ...
   - Artifact: A01.png, ...
   - Non-Basic Land: NB01.png, ...
   - Basic Land: BL01.png, ...

3. Publishing on GitHub Pages (brief):
   - Create a new repo (e.g., OuterRealms).
   - Upload all files and folders (index.html at repo root).
   - In the GitHub repo Settings -> Pages, select the main branch and / (root) as the site source.
   - Visit https://<your-username>.github.io/<repo-name>/

If you'd like, I can also:
- Generate an images.json automatically from the files you later upload (I can create a small script to do that).
- Help you push this package to GitHub via guided steps.
