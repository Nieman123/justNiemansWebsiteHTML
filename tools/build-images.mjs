import fg from 'fast-glob';
import sharp from 'sharp';
import pc from 'picocolors';
import { mkdirSync } from 'fs';
import { dirname, join, extname, basename } from 'path';

const SRC_DIR = 'assets';     // originals live here (png/jpg/webp)
const OUT_DIR = 'optimized';  // generated sizes+formats go here
const SIZES   = [150, 300, 512, 640, 800, 1024, 1375]; // tweak per need

const formats = {
  avif: { quality: 40 },                // 30–45 is a good range
  webp: { quality: 85 },                // 80–90 is typical
  jpg:  { quality: 85, progressive: true }
};

const files = await fg([`${SRC_DIR}/**/*.{png,jpg,jpeg,webp}`], { dot:false });

if (!files.length) {
  console.log(pc.yellow('No source images found under'), SRC_DIR);
  process.exit(0);
}

for (const file of files) {
  const relDir = dirname(file).replace(/^assets\/?/, ''); // keep subfolders
  const base = basename(file, extname(file));
  let sourceWidth = 0;

  try {
    const metadata = await sharp(file).metadata();
    sourceWidth = metadata.width || 0;
  } catch (err) {
    console.error(pc.red('✗'), `Unable to read metadata for ${file}:`, err.message);
  }

  const candidateSizes = sourceWidth
    ? SIZES.filter((w) => w <= sourceWidth)
    : [...SIZES];
  const targetSizes = candidateSizes.length
    ? candidateSizes
    : sourceWidth
      ? [sourceWidth]
      : [...SIZES];

  for (const w of targetSizes) {
    const basePipe = sharp(file).resize({ width: w, withoutEnlargement: true });
    for (const [fmt, opts] of Object.entries(formats)) {
      const outDir = join(OUT_DIR, relDir);
      mkdirSync(outDir, { recursive: true });
      const outPath = join(outDir, `${base}-${w}.${fmt}`);
      try {
        let p = basePipe.clone();
        if (fmt === 'avif') p = p.avif(opts);
        if (fmt === 'webp') p = p.webp(opts);
        if (fmt === 'jpg')  p = p.jpeg(opts);
        await p.toFile(outPath);
        console.log(pc.green('✓'), outPath);
      } catch (err) {
        console.error(pc.red('✗'), outPath, err.message);
      }
    }
  }
}
