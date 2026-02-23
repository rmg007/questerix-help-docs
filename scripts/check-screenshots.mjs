import fs from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = path.resolve(process.cwd());
const DOC_GLOBS = [
  'index.md',
  'README.md',
  'parents',
  'teachers',
  'admins',
  '_incoming',
];

const CATALOG_PATH = path.join(REPO_ROOT, 'SCREENSHOT_CATALOG.md');
const SCREENSHOTS_DIR = path.join(REPO_ROOT, 'public', 'screenshots');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listMarkdownFiles() {
  const files = [];

  async function walk(p) {
    const stat = await fs.stat(p);
    if (stat.isFile()) {
      if (p.toLowerCase().endsWith('.md')) files.push(p);
      return;
    }
    const entries = await fs.readdir(p);
    for (const e of entries) {
      await walk(path.join(p, e));
    }
  }

  for (const g of DOC_GLOBS) {
    const p = path.join(REPO_ROOT, g);
    if (await exists(p)) await walk(p);
  }

  return files;
}

function extractScreenshotRefs(markdown) {
  // Match markdown images: ![alt](/screenshots/file.png)
  const re = /!\[[^\]]*]\(\/screenshots\/([^)#?\s]+\.png)\)/gi;
  const out = [];
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(markdown))) out.push(m[1]);
  return out;
}

async function main() {
  const mdFiles = await listMarkdownFiles();
  const referenced = new Map(); // filename -> Set(files)

  for (const f of mdFiles) {
    const raw = await fs.readFile(f, 'utf8');
    const refs = extractScreenshotRefs(raw);
    for (const r of refs) {
      if (!referenced.has(r)) referenced.set(r, new Set());
      referenced.get(r).add(path.relative(REPO_ROOT, f));
    }
  }

  const missingFiles = [];
  for (const filename of referenced.keys()) {
    const p = path.join(SCREENSHOTS_DIR, filename);
    if (!(await exists(p))) missingFiles.push({ filename, path: p, referencedBy: [...referenced.get(filename)] });
  }

  const catalogRaw = (await exists(CATALOG_PATH)) ? await fs.readFile(CATALOG_PATH, 'utf8') : '';
  const missingFromCatalog = [];
  for (const filename of referenced.keys()) {
    const needle = `/screenshots/${filename}`;
    if (!catalogRaw.includes(needle)) {
      missingFromCatalog.push({ filename, referencedBy: [...referenced.get(filename)] });
    }
  }

  if (missingFiles.length || missingFromCatalog.length) {
    // eslint-disable-next-line no-console
    console.error('Screenshot reference check failed.\n');

    if (missingFiles.length) {
      // eslint-disable-next-line no-console
      console.error('Missing screenshot files in public/screenshots/:');
      for (const m of missingFiles) {
        // eslint-disable-next-line no-console
        console.error(`- ${m.filename}\n  expected: ${m.path}\n  referenced by: ${m.referencedBy.join(', ')}`);
      }
      // eslint-disable-next-line no-console
      console.error('');
    }

    if (missingFromCatalog.length) {
      // eslint-disable-next-line no-console
      console.error('Referenced screenshots missing from SCREENSHOT_CATALOG.md:');
      for (const m of missingFromCatalog) {
        // eslint-disable-next-line no-console
        console.error(`- ${m.filename}\n  referenced by: ${m.referencedBy.join(', ')}`);
      }
      // eslint-disable-next-line no-console
      console.error('');
    }

    process.exitCode = 1;
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`OK: ${referenced.size} screenshot(s) referenced, all present and cataloged.`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

