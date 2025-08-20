# AGENTS.md

## Project overview
Static website for an EDM artist. Primarily HTML, CSS, and vanilla JS. A minimal Node-based image optimization step (sharp) exists; no bundlers or frameworks. Single entry page (`index.html`) with a featured gallery and light interactive behavior in `js/main.js`.

## Project structure
```
/
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ main.js
├─ assets/
│  ├─ gallery/      # images shown in the homepage gallery
│  ├─ video/        # site videos (e.g., shell.mp4) and generated thumbnails
│  ├─ *.png|*.webp  # logos, icons
│  └─ ...           # misc site assets
├─ optimized/       # generated responsive assets (avif/webp/jpg)
├─ tools/           # build scripts (e.g., build-images.mjs)
├─ .github/workflows/deploy.yaml  # CI workflow
├─ firebase.json    # Hosting config
└─ package.json     # scripts: img:build
```
Authoritative locations:
- Originals live under `/assets/`.
- Optimized, responsive outputs are written to `/optimized/` by the image build script.
- Gallery items and captions are defined in `js/main.js` via `GALLERY_ITEMS` (see “Gallery editing recipe”).

## How to run locally
Use a simple static file server. Recommended:
```bash
# from repo root
npx live-server .
# or
python -m http.server 8080
```
App has no JS bundling step. If optimized images are missing, run `npm run img:build` to generate `/optimized` assets.

## Deploy
Deployment is automated via GitHub Actions integrated with Firebase Hosting. When changes are pushed to the main branch, the workflow runs a Node.js script using sharp to generate optimized image assets automatically before deploying the site to Firebase Hosting.

## Code style and conventions
- **HTML:** semantic where possible; keep ARIA attributes where present.
- **CSS:** prefer one declaration per line for readability. Example:
  ```css
  .hero-gallery {
    display: grid;
    grid-template-rows: auto auto;
    gap: 14px;
    align-self: start;
    justify-self: end;
    width: min(960px, 100%);
  }
  ```
- **JavaScript:** keep everything in `js/main.js`. No bundlers, no transpilers, no external module systems.
  - Use plain functions and minimal global surface area.
  - Prefer descriptive names; avoid cleverness.
  - Don’t add new dependencies.

## Accessibility requirements
- All interactive controls must have a name/label and keyboard access. If you add a control, ensure:
  - It is reachable with Tab, operable with Enter/Space.
  - It has an accessible name (`aria-label`, visible text, or associated label).
  - Focus styles remain visible.
- All images require meaningful `alt` text; decorative images may use empty `alt`.
- Preserve existing ARIA attributes and roles in `index.html`.
- Do not remove reduced-motion checks; respect `prefers-reduced-motion`.

## Browser support
Target modern evergreen browsers. No workarounds for legacy Safari.

## Security considerations
- No secrets or private data in this repo; keep it public and simple.
- Load third-party scripts asynchronously; do not introduce new script origins.
- Avoid inline event handlers; prefer `addEventListener`.

## Testing
- No automated tests. Use a manual smoke check:
  - Page loads without console errors on a static server.
  - Hero gallery cycles images and captions correctly.
  - Thumbnails switch the main media.
  - Video thumb plays muted by default; Unmute control toggles audio and remains keyboard accessible.
  - Dock menu opens/closes on small screens and restores state on link click.
- If images referenced under `/optimized/` 404 locally, run `npm run img:build` once.

## Git workflow
- No branch rules. Keep commits focused. If changing UI behavior, include a brief summary in the commit message.

## Gallery editing recipe
To add or change items shown in the hero gallery:
1. Place media files under `assets/gallery/` (images) or `assets/video/` (videos).
2. Edit `js/main.js` and update `GALLERY_ITEMS`:
   ```js
   const GALLERY_ITEMS = [
     ['assets/gallery/1.jpg', 'Memories at The Getaway'],
     // image: [imagePath, caption]
     ['assets/video/shell-thumb.jpg', 'Shell crowd moment', 'assets/video/shell.mp4']
     // video:  [thumbPath, caption, videoPath]
   ];
   ```
3. For videos, generate a thumbnail and reference it as the first element; the third element is the `.mov` or `.mp4` path.
4. Keep captions short and meaningful; they’re used for accessibility and the visible figure caption.

## Don’ts (for agents)
- Don’t introduce new build tools or frameworks. Keep the existing minimal Node image pipeline (sharp) but don’t add bundlers or extra deps.
- Don’t split scripts into modules or add TypeScript.
- Don’t change directory structure or move assets outside `/assets/`.
- Don’t remove ARIA attributes, captions, or keyboard behaviors.
- Don’t add external analytics or scripts beyond those already present.

## Useful context for agentic tools
- This repository primarily serves a static HTML/CSS/JS site, but now includes a minimal Node-based build step for image optimization using sharp.
- Continuous integration and deployment are handled through GitHub Actions, which runs the build and deploy workflow automatically.
- If you need to serve locally, use a minimal static server as noted above.
- Prefer human-readable diffs over clever refactors.
