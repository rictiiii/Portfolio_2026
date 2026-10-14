# Ricky Liu Portfolio

Static portfolio with four complete case studies, a contact page, and an interactive folder identity. The revised homepage introduces Ricky’s practice and shows all projects without requiring visitors to open the folder.

## Preview locally

Run from this folder:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Visit http://127.0.0.1:4173.

## Quality checks

```sh
python3 qa/check_site.py
node --check home.js
node --check navigation.js
node --check case-study-nav.js
```

See `qa/REVIEW.md` for the review, browser checks, and remaining limitations. The site is published from `main` through GitHub Pages at https://rickyliudesign.com.

## Structure

- `index.html`, `home.css`, `home.js`: homepage, responsive layout, appearance control, progressive motion.
- `navigation.css`, `navigation.js`, `case-study-nav.js`: shared navigation and case-study reading controls.
- `fonts.css`, `assets/fonts/`: locally served Outfit and its license.
- `media.css`, `assets/previews/`: intrinsic image proportions and responsive WebP previews.
- Case-study routes and original assets remain available. Previously hidden legacy Koto and kiosk markup is preserved in inert templates, which do not execute scripts or load their media.
