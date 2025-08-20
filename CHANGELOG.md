# Changelog

## Improvements for LCP & CLS
- LCP element: hero gallery image (`assets/gallery/1.webp`) now eagerly loaded.
- Preloaded images: hero wordmark and gallery-1 hero image.
- Added explicit dimensions:
  - `index.html` gallery thumbnails (lines 199-260) and hero image (lines 174-183).
  - `js/main.js` gallery thumb builder and video (lines 200-209, 223-231).
  - `links.html` top icons (lines 66-91).
- Below-the-fold images still using `loading="lazy"`:
  - Gallery thumbnails in `index.html`
  - Release covers and contact icons in `index.html`
  - Release covers and footer mark in `links.html`
  - Dock icons and footer marks in `404.html`, `privacy.html`, and `tos.html`
