import { chromium } from 'playwright';

const APP_ORIGIN = 'https://app.questerix.com';

async function main() {
  const headed = process.argv.includes('--headed');
  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  await page.goto(APP_ORIGIN, { waitUntil: 'domcontentloaded' });
  // Flutter bootstrap can take a few seconds (and Cloudflare may inject challenge scripts).
  await page.waitForTimeout(8000);

  // eslint-disable-next-line no-console
  console.log('Page URL:', page.url());
  // eslint-disable-next-line no-console
  console.log('Frames:', page.frames().length);

  // eslint-disable-next-line no-console
  console.log('canvas count:', await page.locator('canvas').count());
  // eslint-disable-next-line no-console
  console.log('iframe count:', await page.locator('iframe').count());
  // eslint-disable-next-line no-console
  console.log('body child tags:', await page.evaluate(() => Array.from(document.body?.children ?? []).map((n) => n.tagName)));
  console.log('flutter-view count:', await page.locator('flutter-view').count());
  console.log('flt-glass-pane count:', await page.locator('flt-glass-pane').count());

  const bodyText = await page.evaluate(() => document.body?.innerText ?? '');
  // eslint-disable-next-line no-console
  console.log('body.innerText (first 400 chars):', JSON.stringify(bodyText.slice(0, 400)));

  const htmlSnippet = await page.evaluate(() => document.body?.innerHTML?.slice(0, 800) ?? '');
  // eslint-disable-next-line no-console
  console.log('body.innerHTML (first 800 chars):', htmlSnippet.replace(/\s+/g, ' ').slice(0, 800));

  // Try enabling Flutter semantics.
  const enable = page.locator('flt-semantics-placeholder[aria-label*="Enable accessibility" i]').first();
  console.log('\nEnable accessibility placeholder present:', (await enable.count()) > 0);
  if (await enable.count()) {
    await enable.click().catch(() => {});
    await page.waitForTimeout(1000);
    await enable.focus().catch(() => {});
    await enable.press('Enter').catch(() => {});
    await page.keyboard.press('Space').catch(() => {});
    await page.waitForTimeout(3000);
  }

  const semanticsCount = await page.locator('flt-semantics').count();
  console.log('flt-semantics count after click:', semanticsCount);
  console.log('flt-semantics-host count:', await page.locator('flt-semantics-host').count());
  console.log('flt-semantics-container count:', await page.locator('flt-semantics-container').count());
  console.log('flt-semantics-node count:', await page.locator('flt-semantics-node').count());
  console.log('flt-semantics-role count:', await page.locator('flt-semantics[role]').count());
  const alreadyCount = await page.locator('flt-semantics[aria-label*="already have" i]').count();
  console.log('semantics nodes containing "already have":', alreadyCount);
  const labels = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('flt-semantics[aria-label]')).slice(0, 30);
    return nodes.map((n) => n.getAttribute('aria-label'));
  });
  console.log('First 30 aria-labels:', labels);

  const fltTags = await page.evaluate(() => {
    const tags = new Set();
    for (const el of Array.from(document.querySelectorAll('*'))) {
      const t = el.tagName.toLowerCase();
      if (t.startsWith('flt-') || t.startsWith('flutter-')) tags.add(t);
    }
    return Array.from(tags).sort();
  });
  console.log('All flutter/flt tags present:', fltTags);

  const semanticsShadowInfo = await page.evaluate(() => {
    const host = document.querySelector('flt-semantics-host');
    if (!host) return { hostFound: false };
    const sr = host.shadowRoot;
    if (!sr) return { hostFound: true, shadowRoot: null };
    const nodeCount = sr.querySelectorAll('*').length;
    const ariaCount = sr.querySelectorAll('[aria-label]').length;
    const sample = Array.from(sr.querySelectorAll('[aria-label]'))
      .slice(0, 30)
      .map((n) => n.getAttribute('aria-label'));
    const tags = Array.from(new Set(Array.from(sr.querySelectorAll('*')).map((n) => n.tagName.toLowerCase()))).slice(0, 40);
    return { hostFound: true, shadowRoot: { nodeCount, ariaCount, sample, tags } };
  });
  console.log('Semantics host shadow info:', semanticsShadowInfo);

  // Navigate into login flow to inspect field labels.
  const alreadyBtn = page.locator('flt-semantics[aria-label*="already have an account" i]').first();
  console.log('\nAlready-have-account semantics present:', (await alreadyBtn.count()) > 0);
  if (await alreadyBtn.count()) {
    await alreadyBtn.click().catch(() => {});
    await page.waitForTimeout(4000);

    const afterLabels = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('flt-semantics[aria-label]')).slice(0, 80);
      return nodes.map((n) => n.getAttribute('aria-label'));
    });
    console.log('After clicking already-have-account (first 80 aria-labels):', afterLabels);

    console.log('textbox roles count:', await page.getByRole('textbox').count().catch(() => -1));
    console.log('button roles count:', await page.getByRole('button').count().catch(() => -1));
  }

  const targets = [/already have an account/i, /get started/i, /email/i, /password/i, /log in|sign in/i];

  for (const frame of page.frames()) {
    // eslint-disable-next-line no-console
    console.log('\n---');
    // eslint-disable-next-line no-console
    console.log('Frame URL:', frame.url());

    for (const t of targets) {
      try {
        const count = await frame.getByText(t).count();
        if (count) {
          // eslint-disable-next-line no-console
          console.log(`text ${String(t)}: ${count}`);
        }
      } catch {
        // ignore
      }
    }
  }

  await browser.close();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

