import fs from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = path.resolve(process.cwd());

const PERSONA_DIRS = ['parents', 'teachers', 'admins'];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listMdFiles(dir) {
  const abs = path.join(REPO_ROOT, dir);
  if (!(await exists(abs))) return [];

  const out = [];
  async function walk(p) {
    const stat = await fs.stat(p);
    if (stat.isFile()) {
      if (p.toLowerCase().endsWith('.md')) out.push(p);
      return;
    }
    const entries = await fs.readdir(p);
    for (const e of entries) await walk(path.join(p, e));
  }
  await walk(abs);
  return out;
}

function isHowToGuide(markdown) {
  // Heuristic: any page with at least one numbered list is likely a how-to.
  return /^\s*\d+\.\s+/m.test(markdown);
}

function hasLastUpdatedTop(markdown) {
  // Must be near the top of file.
  const top = markdown.split(/\r?\n/).slice(0, 5).join('\n');
  return /<!--\s*Last updated:\s*\d{4}-\d{2}-\d{2}\s*-->/.test(top);
}

function hasProblemSolutionVerification(markdown) {
  const hasProblem = /\*\*Problem:\*\*/i.test(markdown);
  const hasSolution = /\*\*Solution:\*\*/i.test(markdown);
  const hasVerification = /\*\*Verification:\*\*/i.test(markdown);
  return hasProblem && hasSolution && hasVerification;
}

function extractIssues(file, markdown) {
  const rel = path.relative(REPO_ROOT, file);
  const issues = [];

  if (!hasLastUpdatedTop(markdown)) {
    issues.push('Missing `<!-- Last updated: YYYY-MM-DD -->` in first 5 lines.');
  }

  if (isHowToGuide(markdown) && !hasProblemSolutionVerification(markdown)) {
    issues.push('How-to content detected but missing **Problem → Solution → Verification** blocks.');
  }

  return { rel, issues };
}

async function main() {
  const files = [];
  for (const d of PERSONA_DIRS) files.push(...(await listMdFiles(d)));

  const results = [];
  for (const f of files) {
    const raw = await fs.readFile(f, 'utf8');
    const { rel, issues } = extractIssues(f, raw);
    if (issues.length) results.push({ rel, issues });
  }

  if (results.length) {
    // eslint-disable-next-line no-console
    console.error('Documentation rules check failed.\n');
    for (const r of results) {
      // eslint-disable-next-line no-console
      console.error(`- ${r.rel}`);
      for (const i of r.issues) {
        // eslint-disable-next-line no-console
        console.error(`  - ${i}`);
      }
    }
    process.exitCode = 1;
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`OK: ${files.length} doc page(s) checked.`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

