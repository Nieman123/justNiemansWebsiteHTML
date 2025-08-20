# PageSpeed Fix Report

## Summary of Fixes
- Inlined critical CSS and deferred main stylesheet loading to reduce render-blocking resources.
- Added preconnect for analytics, fetch priorities, explicit image dimensions, lazy loading and async decoding to minimize LCP and CLS.
- Marked heavy event listeners as passive and deferred main script to shorten main-thread work.

## Audit-by-Audit Mapping
| Audit ID | Change |
| --- | --- |
| render-blocking-resources | Inlined above-the-fold CSS and loaded `css/styles.css` with `media="print"` then swap; deferred `js/main.js`. |
| uses-responsive-images | Added explicit width/height and lazy loading on images, plus high fetchpriority for hero media. |
| largest-contentful-paint-element | Preloaded hero logo and first gallery image; set `fetchpriority="high"` on LCP image. |
| layout-shift-elements | Added width/height attributes to nav and icon images. |
| unused-javascript / main-thread-tasks | Deferred main script and set `passive: true` on `mousemove` and `resize` handlers. |
| uses-text-compression | (N/A) – assets served static; ensure server compression. |

## Binary Assets To Optimize Manually
| path | role | current format & approx. dimensions | recommended target | suggested quality | est. savings |
| --- | --- | --- | --- | --- | --- |
| assets/just-nieman-logo-wide-inverted.png | hero wordmark | PNG 1375×649 | convert to AVIF/WebP at widths 1375,1024,512 | AVIF cq=28 | ~60% |
| assets/gallery/1.webp | LCP gallery image | WebP ~360×640 | AVIF 640w,320w variants | AVIF cq=30 | ~30% |
| assets/gallery/2.webp–assets/gallery/7.webp | gallery thumbs | WebP 68×120 | AVIF 120w | AVIF cq=30 | ~20% |
| assets/its-not-that-deep.webp | release cover | WebP 300×300 | AVIF 300w,150w | AVIF cq=30 | ~25% |
| assets/my-music.webp | release cover | WebP 300×300 | AVIF 300w,150w | AVIF cq=30 | ~25% |
| assets/lives.webp | release cover | WebP 300×300 | AVIF 300w,150w | AVIF cq=30 | ~25% |
| assets/personal.webp | release cover | WebP 300×300 | AVIF 300w,150w | AVIF cq=30 | ~25% |
| assets/soundcloud-logo.png | icon | PNG 512×512 | WebP 64w | WebP q=82 | ~70% |
| assets/Instagram.webp | icon | WebP 512×512 | AVIF 64w | AVIF cq=30 | ~30% |
| assets/home/constant/email.png | icon | PNG 128×128 | WebP 48w | WebP q=82 | ~50% |
| assets/video/shell-thumb.jpg | video thumb | JPG ~1280×720 | WebP 720w | WebP q=82 | ~40% |
| assets/video/shell.mp4 | gallery video | MP4 1080p | transcode to AV1/WebM; keep MP4 fallback | webm cq=30 | ~35% |

### Do Not Convert
| path | reason |
| --- | --- |
| assets/just-nieman-logo.png | brand logo with sharp edges; keep PNG for crispness |
| assets/just-nieman-logo-inverted.png | inverted logo; same reason as above |

## Follow-up Checks
- [ ] Redeploy to hosting.
- [ ] Re-run PSI for Mobile and Desktop.
- [ ] Verify LCP element is hero gallery image.
- [ ] Verify CLS < 0.1 and TBT reduced; confirm font swaps acceptable.
