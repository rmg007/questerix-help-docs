import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const APP_ORIGIN = 'https://app.questerix.com';
const REPO_ROOT = path.resolve(process.cwd());
const SCREENSHOTS_DIR = path.join(REPO_ROOT, 'public', 'screenshots');
const CATALOG_PATH = path.join(REPO_ROOT, 'SCREENSHOT_CATALOG.md');
const AUTH_DIR = path.join(REPO_ROOT, '.playwright', 'auth');
const LOCAL_ENV_PATH = path.join(REPO_ROOT, '.env.screenshots.local');

const DEFAULT_VIEWPORT = { width: 2560, height: 1440 };
const DEFAULT_SCALE = 2;

async function loadLocalEnvFile() {
  try {
    const raw = await fs.readFile(LOCAL_ENV_PATH, 'utf8');
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx <= 0) continue;

      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();

      // Strip optional surrounding quotes.
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!key) continue;
      if (process.env[key] == null || process.env[key] === '') {
        process.env[key] = value;
      }
    }
  } catch {
    // No local env file; ignore.
  }
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  return {
    // Default to headed because Cloudflare/Flutter often blocks headless.
    headless: args.has('--headless'),
    manualLogin: args.has('--manual-login'),
    skipAuthCache: args.has('--no-auth-cache'),
    manualLoginTimeoutMs: (() => {
      const v = argv.find((a) => a.startsWith('--manual-login-timeout-ms='));
      if (!v) return 15 * 60_000;
      const n = Number(v.slice('--manual-login-timeout-ms='.length));
      return Number.isFinite(n) && n > 0 ? n : 15 * 60_000;
    })(),
    only: (() => {
      const onlyArg = argv.find((a) => a.startsWith('--only='));
      if (!onlyArg) return null;
      return new Set(
        onlyArg
          .slice('--only='.length)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      );
    })(),
  };
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function waitForAppReady(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => {});

  const elevating = page.getByText('Elevating Authority', { exact: false });
  if (await elevating.count()) {
    await elevating.first().waitFor({ state: 'hidden', timeout: 60_000 }).catch(() => {});
  }

  // Give glass/blur layers a beat to settle.
  await page.waitForTimeout(750);
}

async function applyCapturePolish(page) {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });
}

async function gotoApp(page, pathname = '/') {
  const url = new URL(pathname, APP_ORIGIN).toString();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await ensureFlutterSemantics(page);
  await waitForAppReady(page);
}

async function ensureFlutterSemantics(page) {
  // Flutter Web: UI is not discoverable until semantics are enabled.
  const hasHost = page.locator('flt-semantics-host');
  const hasNodes = page.locator('flt-semantics');
  if ((await hasNodes.count()) > 0) return;

  // Wait for Flutter to bootstrap enough to show the placeholder.
  const enableA11y = page.locator('flt-semantics-placeholder[aria-label*="Enable accessibility" i]').first();
  const flutterView = page.locator('flutter-view').first();
  await Promise.race([
    enableA11y.waitFor({ state: 'attached', timeout: 15_000 }).catch(() => {}),
    flutterView.waitFor({ state: 'attached', timeout: 15_000 }).catch(() => {}),
  ]);

  if ((await enableA11y.count()) > 0) {
    // Flutter needs a keyboard activation to fully enable semantics.
    await enableA11y.click().catch(() => {});
    await page.waitForTimeout(500);
    await enableA11y.focus().catch(() => {});
    await enableA11y.press('Enter').catch(() => {});
    await page.keyboard.press('Space').catch(() => {});
    await page.waitForTimeout(750);
  }

  // Wait briefly for semantics tree to appear.
  await page
    .locator('flt-semantics')
    .first()
    .waitFor({ state: 'attached', timeout: 5000 })
    .catch(() => {});
}

async function loginIfNeeded(page, { email, password }) {
  await gotoApp(page, '/');

  // Heuristic: if we have a sidebar/nav, we’re likely authenticated.
  const hasLogout =
    (await page.getByRole('button', { name: /log out|logout|sign out/i }).count()) > 0 ||
    (await page.getByRole('link', { name: /log out|logout|sign out/i }).count()) > 0;
  if (hasLogout) return;

  if (!email || !password) {
    throw new Error('Missing credentials for automated login (this script supports manual login mode).');
  }

  // Some tenants show auth in an iframe and/or a welcome screen first.
  await revealLoginForm(page);
  await ensureFlutterSemantics(page);
  await waitForAppReady(page);

  const { emailInput, passwordInput, submitBtnScope } = await findLoginFields(getScopes(page));

  await setFieldValue(page, emailInput, email);
  await setFieldValue(page, passwordInput, password);

  const submitBtn = submitBtnScope.getByRole('button', { name: /log in|login|sign in|continue/i }).first();
  const submitSemantics = submitBtnScope
    .locator('flt-semantics[aria-label*="log" i], flt-semantics[aria-label*="sign in" i], flt-semantics[aria-label*="continue" i]')
    .first();

  if (await submitBtn.count()) {
    await submitBtn.click();
  } else if (await submitSemantics.count()) {
    await submitSemantics.click();
  } else {
    await page.keyboard.press('Enter');
  }

  await waitForAppReady(page);
}

function getScopes(page) {
  return [page, ...page.frames().filter((f) => f !== page.mainFrame())];
}

async function revealLoginForm(page) {
  // Prefer Flutter semantics labels (most reliable).
  const semanticsAlready = page.locator('flt-semantics[aria-label*="already have an account" i]').first();
  if ((await semanticsAlready.count()) > 0) {
    await semanticsAlready.click().catch(() => {});
    return;
  }

  const already = /already have an account/i;
  const scopes = getScopes(page);
  for (const scope of scopes) {
    const locs = [
      scope.getByRole?.('button', { name: already })?.first?.(),
      scope.getByRole?.('link', { name: already })?.first?.(),
      scope.getByText?.(already)?.first?.(),
    ].filter(Boolean);

    for (const loc of locs) {
      if ((await loc.count()) > 0) {
        await loc.click().catch(() => {});
        return;
      }
    }
  }
}

async function pickFirstExisting(candidates) {
  for (const loc of candidates) {
    try {
      if ((await loc.count()) > 0) return loc.first();
    } catch {
      // ignore and keep trying
    }
  }
  return candidates[0].first();
}

async function findLoginFields(scopes) {
  for (const scope of scopes) {
    const emailCandidates = [
      scope.getByRole?.('textbox', { name: /email/i }),
      scope.getByLabel?.(/email/i),
      scope.getByPlaceholder?.(/email/i),
      scope.locator?.('input[type="email"]'),
      scope.locator?.('input[name*="email" i]'),
      scope.locator?.('input[autocomplete="email" i]'),
      scope.locator?.('input[type="text"][name*="email" i]'),
      scope.locator?.('input[type="text"][placeholder*="email" i]'),
    ].filter(Boolean);

    const passwordCandidates = [
      scope.getByRole?.('textbox', { name: /password/i }),
      scope.getByLabel?.(/password/i),
      scope.getByPlaceholder?.(/password/i),
      scope.locator?.('input[type="password"]'),
      scope.locator?.('input[name*="password" i]'),
      scope.locator?.('input[autocomplete="current-password" i]'),
      scope.locator?.('input[autocomplete="password" i]'),
    ].filter(Boolean);

    const emailInput = await pickFirstExisting(emailCandidates);
    const passwordInput = await pickFirstExisting(passwordCandidates);

    if ((await emailInput.count()) > 0 && (await passwordInput.count()) > 0) {
      return { emailInput, passwordInput, submitBtnScope: scope };
    }

    // Flutter fallback: some forms expose unlabeled textboxes.
    try {
      const textboxes = scope.getByRole?.('textbox');
      if (textboxes) {
        // Wait briefly for the two fields to appear.
        const start = Date.now();
        while (Date.now() - start < 15_000) {
          const c = await textboxes.count();
          if (c >= 2) {
            return { emailInput: textboxes.nth(0), passwordInput: textboxes.nth(1), submitBtnScope: scope };
          }
          await new Promise((r) => setTimeout(r, 250));
        }
      }
    } catch {
      // ignore
    }
  }

  // If we still couldn't find fields, throw a helpful error.
  throw new Error('Could not locate email/password fields on login screen (page or iframes).');
}

async function setFieldValue(page, locator, value) {
  try {
    await locator.fill(value, { timeout: 5000 });
    return;
  } catch {
    // Fall through for Flutter semantics-based fields (not real <input> elements).
  }

  await locator.click({ timeout: 10_000 });
  await page.keyboard.press('Control+A').catch(() => {});
  await page.keyboard.press('Backspace').catch(() => {});
  await page.keyboard.type(value, { delay: 10 });
}

async function isLikelyLoggedIn(page) {
  const markers = [
    page.getByRole('button', { name: /log out|logout|sign out/i }),
    page.getByRole('link', { name: /log out|logout|sign out/i }),
    page.getByText(/dashboard/i),
    page.getByText(/groups/i),
    page.getByText(/questions/i),
    page.getByText(/settings/i),
    page.getByText(/progress/i),
  ];

  for (const loc of markers) {
    try {
      if ((await loc.count()) > 0) return true;
    } catch {
      // ignore
    }
  }
  return false;
}

async function waitForManualLogin(page, role, timeoutMs) {
  const started = Date.now();
  // eslint-disable-next-line no-console
  console.log(
    `[${role}] Manual login needed. A browser window should be open.\n` +
      `     Please log in now (we'll continue automatically when you're in). Timeout: ${Math.round(timeoutMs / 1000)}s`,
  );

  while (Date.now() - started < timeoutMs) {
    await ensureFlutterSemantics(page).catch(() => {});
    await revealLoginForm(getScopes(page)).catch(() => {});

    if (await isLikelyLoggedIn(page)) return;
    await page.waitForTimeout(1000);
  }
  throw new Error(`[${role}] Manual login timed out after ${Math.round(timeoutMs / 1000)}s.`);
}

async function clickNav(page, name, { timeout = 10_000 } = {}) {
  const candidates = [
    page.getByRole('link', { name: new RegExp(`^${escapeRegExp(name)}$`, 'i') }),
    page.getByRole('button', { name: new RegExp(`^${escapeRegExp(name)}$`, 'i') }),
    page.getByRole('link', { name: new RegExp(escapeRegExp(name), 'i') }),
    page.getByRole('button', { name: new RegExp(escapeRegExp(name), 'i') }),
  ];

  for (const loc of candidates) {
    if (await loc.count()) {
      await loc.first().click({ timeout });
      await waitForAppReady(page);
      return true;
    }
  }
  return false;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function capture(page, filename) {
  await ensureDir(SCREENSHOTS_DIR);
  const outPath = path.join(SCREENSHOTS_DIR, filename);
  await waitForAppReady(page);
  await page.screenshot({ path: outPath, fullPage: true });
  return outPath;
}

async function markCatalogChecked(filename) {
  if (!(await exists(CATALOG_PATH))) return false;
  const raw = await fs.readFile(CATALOG_PATH, 'utf8');
  const needle = `/screenshots/${filename}`;
  const lines = raw.split(/\r?\n/);
  let changed = false;

  const updated = lines.map((line) => {
    if (!line.includes(needle)) return line;
    changed = true;
    return line
      .replace(/^- \[\s?\]\s+/i, '- [x] ')
      .replace(/⚠️\s+\*\*MISSING\*\*\s+/i, '');
  });

  if (!changed) return false;
  await fs.writeFile(CATALOG_PATH, updated.join('\n'), 'utf8');
  return true;
}

const ROLE_ORDER = ['student', 'teacher', 'admin'];
const ROLE_CREDENTIALS = {
  // Default test accounts (email == password). Override via env vars if needed.
  student: {
    email: process.env.QUESTERIX_STUDENT_EMAIL ?? 'student@questerix.com',
    password: process.env.QUESTERIX_STUDENT_PASSWORD ?? (process.env.QUESTERIX_STUDENT_EMAIL ?? 'student@questerix.com'),
  },
  teacher: {
    email: process.env.QUESTERIX_TEACHER_EMAIL ?? 'teacher@questerix.com',
    password: process.env.QUESTERIX_TEACHER_PASSWORD ?? (process.env.QUESTERIX_TEACHER_EMAIL ?? 'teacher@questerix.com'),
  },
  admin: {
    email: process.env.QUESTERIX_ADMIN_EMAIL ?? 'admin@questerix.com',
    password: process.env.QUESTERIX_ADMIN_PASSWORD ?? (process.env.QUESTERIX_ADMIN_EMAIL ?? 'admin@questerix.com'),
  },
};

const SHOTS = [
  // Parents
  {
    id: 'parent-dashboard',
    role: 'student',
    filename: 'parent-dashboard.png',
    run: async (page) => {
      await gotoApp(page, '/');
    },
  },
  {
    id: 'parent-progress',
    role: 'student',
    filename: 'parent-progress.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Progress');
    },
  },
  {
    id: 'parent-mastery',
    role: 'student',
    filename: 'parent-mastery.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Progress');
      // Try to open a mastery explainer/modal if present.
      await clickNav(page, 'Mastery').catch(() => {});
      const info = page.getByRole('button', { name: /what is mastery|mastery score|learn more/i }).first();
      if (await info.count()) {
        await info.click();
        await waitForAppReady(page);
      }
    },
  },
  {
    id: 'parent-account-settings',
    role: 'student',
    filename: 'parent-account-settings.png',
    run: async (page) => {
      await gotoApp(page, '/');
      // Common patterns: avatar menu -> Settings / Account
      const avatar = page
        .getByRole('button', { name: /account|profile|settings|menu/i })
        .first();
      if (await avatar.count()) await avatar.click();
      await clickNav(page, 'Settings').catch(() => {});
      await clickNav(page, 'Account').catch(() => {});
    },
  },

  // Teachers
  {
    id: 'teacher-create-group',
    role: 'teacher',
    filename: 'teacher-create-group.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Groups');
      await clickNav(page, 'New Group');
      // Keep modal/screen open for the screenshot.
    },
  },
  {
    id: 'teacher-group-progress',
    role: 'teacher',
    filename: 'teacher-group-progress.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Groups');
      // Open first group row/card if present.
      const firstGroup = page.getByRole('link').filter({ hasText: /./ }).first();
      if (await firstGroup.count()) await firstGroup.click();
      await waitForAppReady(page);
    },
  },
  {
    id: 'teacher-group-report',
    role: 'teacher',
    filename: 'teacher-group-report.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Groups');
      const firstGroup = page.getByRole('link').filter({ hasText: /./ }).first();
      if (await firstGroup.count()) await firstGroup.click();
      await waitForAppReady(page);
      await clickNav(page, 'Reports').catch(() => {});
    },
  },
  {
    id: 'teacher-student-detail',
    role: 'teacher',
    filename: 'teacher-student-detail.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Groups');
      const firstGroup = page.getByRole('link').filter({ hasText: /./ }).first();
      if (await firstGroup.count()) await firstGroup.click();
      await waitForAppReady(page);
      const studentRow = page.getByRole('row').nth(1).getByRole('link').first();
      if (await studentRow.count()) await studentRow.click();
      await waitForAppReady(page);
    },
  },
  {
    id: 'teacher-session-drill',
    role: 'teacher',
    filename: 'teacher-session-drill.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Groups');
      const firstGroup = page.getByRole('link').filter({ hasText: /./ }).first();
      if (await firstGroup.count()) await firstGroup.click();
      await waitForAppReady(page);
      const studentRow = page.getByRole('row').nth(1).getByRole('link').first();
      if (await studentRow.count()) await studentRow.click();
      await waitForAppReady(page);
      await clickNav(page, 'Session History').catch(() => {});
      const firstSession = page.getByRole('link', { name: /session/i }).first();
      if (await firstSession.count()) await firstSession.click();
      await waitForAppReady(page);
    },
  },

  // Admins
  {
    id: 'admin-school-setup',
    role: 'admin',
    filename: 'admin-school-setup.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Settings');
    },
  },
  {
    id: 'admin-invite-teacher',
    role: 'admin',
    filename: 'admin-invite-teacher.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Users');
      await clickNav(page, 'Teachers').catch(() => {});
      await clickNav(page, 'Invite Teacher');
    },
  },
  {
    id: 'admin-bulk-import',
    role: 'admin',
    filename: 'admin-bulk-import.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Import').catch(() => clickNav(page, 'Bulk Import'));
    },
  },
  {
    id: 'admin-new-question',
    role: 'admin',
    filename: 'admin-new-question.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Questions');
      await clickNav(page, 'New Question');
      // If a question type picker exists, try MCQ.
      const mcq = page.getByRole('button', { name: /multiple choice|mcq/i }).first();
      if (await mcq.count()) await mcq.click();
      await waitForAppReady(page);
    },
  },
  {
    id: 'admin-new-question-short',
    role: 'admin',
    filename: 'admin-new-question-short.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Questions');
      await clickNav(page, 'New Question');
      const short = page.getByRole('button', { name: /short answer|free response/i }).first();
      if (await short.count()) await short.click();
      await waitForAppReady(page);
    },
  },
  {
    id: 'admin-question-list',
    role: 'admin',
    filename: 'admin-question-list.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Questions');
      // Try to open filter panel and select Skill.
      await clickNav(page, 'Filter').catch(() => {});
      const skill = page.getByRole('combobox', { name: /skill/i }).first();
      if (await skill.count()) {
        await skill.click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
      }
      await waitForAppReady(page);
    },
  },
  {
    id: 'admin-ai-generate',
    role: 'admin',
    filename: 'admin-ai-generate.png',
    run: async (page) => {
      await gotoApp(page, '/');
      await clickNav(page, 'Questions');
      await clickNav(page, 'AI').catch(() => clickNav(page, 'Generate'));
    },
  },
];

async function main() {
  await loadLocalEnvFile();
  const args = parseArgs(process.argv);

  await ensureDir(SCREENSHOTS_DIR);
  await ensureDir(AUTH_DIR);

  const browser = await chromium.launch({ headless: args.headless });

  const results = [];
  const startedAt = Date.now();

  const shotsToRun = SHOTS.filter(
    (s) => !args.only || args.only.has(s.id) || args.only.has(s.filename),
  );

  const byRole = new Map();
  for (const s of shotsToRun) {
    if (!byRole.has(s.role)) byRole.set(s.role, []);
    byRole.get(s.role).push(s);
  }

  const roles = ROLE_ORDER.filter((r) => byRole.has(r)).concat(
    Array.from(byRole.keys()).filter((r) => !ROLE_ORDER.includes(r)),
  );

  for (const role of roles) {
    const roleShots = byRole.get(role) ?? [];
    if (!roleShots.length) continue;

    const storageStatePath = path.join(AUTH_DIR, `${role}.json`);
    const useStorageState = !args.skipAuthCache && (await exists(storageStatePath));

    // eslint-disable-next-line no-console
    console.log(`\n=== Role: ${role} (${useStorageState ? 'using saved session' : 'manual login'}) ===`);

    const context = await browser.newContext({
      viewport: DEFAULT_VIEWPORT,
      deviceScaleFactor: DEFAULT_SCALE,
      storageState: useStorageState ? storageStatePath : undefined,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(30_000);
    page.setDefaultNavigationTimeout(45_000);
    await applyCapturePolish(page);

    try {
      if (!useStorageState) {
        const creds = ROLE_CREDENTIALS[role];

        if (args.manualLogin) {
          await gotoApp(page, '/');
          await waitForManualLogin(page, role, args.manualLoginTimeoutMs);
        } else if (creds) {
          try {
            await loginIfNeeded(page, creds);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(`[${role}] Auto-login failed (${String(e?.message ?? e)}). Falling back to manual login.`);
            await gotoApp(page, '/');
            await waitForManualLogin(page, role, args.manualLoginTimeoutMs);
          }
        } else {
          await gotoApp(page, '/');
          await waitForManualLogin(page, role, args.manualLoginTimeoutMs);
        }

        if (!args.skipAuthCache) {
          await context.storageState({ path: storageStatePath });
        }
      } else {
        await gotoApp(page, '/');
      }

      for (const shot of roleShots) {
        // eslint-disable-next-line no-console
        console.log(`\n[${role}] Capturing ${shot.filename} (${shot.id})...`);

        let ok = false;
        let outPath = null;
        let error = null;

        try {
          await shot.run(page);
          outPath = await capture(page, shot.filename);
          await markCatalogChecked(shot.filename);
          ok = true;
        } catch (e) {
          error = e;
          try {
            outPath = await capture(page, shot.filename.replace(/\.png$/i, '_FAILED.png'));
          } catch {
            // ignore
          }
        } finally {
          results.push({ ...shot, ok, outPath, error: error ? String(error?.message ?? error) : null });
        }

        // eslint-disable-next-line no-console
        console.log(
          `${ok ? 'OK  ' : 'FAIL'} ${shot.filename}${outPath ? ` -> ${outPath}` : ''}${
            !ok && error ? `\n     ${String(error?.message ?? error)}` : ''
          }`,
        );
      }
    } finally {
      await context.close();
    }
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  const succeeded = results.filter((r) => r.ok);

  // eslint-disable-next-line no-console
  console.log(
    `\nScreenshots complete: ${succeeded.length} ok, ${failed.length} failed in ${Math.round(
      (Date.now() - startedAt) / 1000,
    )}s`,
  );
  for (const r of results) {
    // eslint-disable-next-line no-console
    console.log(`${r.ok ? 'OK ' : 'FAIL'} ${r.filename} (${r.role})${r.outPath ? ` -> ${r.outPath}` : ''}`);
    if (!r.ok && r.error) {
      // eslint-disable-next-line no-console
      console.log(`     ${r.error}`);
    }
  }

  if (failed.length) process.exitCode = 1;
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

