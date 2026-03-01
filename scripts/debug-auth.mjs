import { chromium } from 'playwright';
import dotenv from 'dotenv';
import winston from 'winston';
import fs from 'node:fs/promises';
import path from 'node:path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

console.log(`Loaded environment variables from ${envFile}`);

const REPO_ROOT = path.resolve(process.cwd());
const LOCAL_ENV_PATH = path.join(REPO_ROOT, '.env.screenshots.local');

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

await loadLocalEnvFile();

if (!process.env.APP_ORIGIN && process.env.ADMIN_PANEL_APP_ORIGIN) process.env.APP_ORIGIN = process.env.ADMIN_PANEL_APP_ORIGIN;
if (!process.env.QUESTERIX_TEACHER_EMAIL && process.env.MENTOR_EMAIL) process.env.QUESTERIX_TEACHER_EMAIL = process.env.MENTOR_EMAIL;
if (!process.env.QUESTERIX_TEACHER_PASSWORD && process.env.MENTOR_PASSWORD) process.env.QUESTERIX_TEACHER_PASSWORD = process.env.MENTOR_PASSWORD;
if (!process.env.QUESTERIX_ADMIN_EMAIL && process.env.SUPER_ADMIN_EMAIL) process.env.QUESTERIX_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
if (!process.env.QUESTERIX_ADMIN_PASSWORD && process.env.SUPER_ADMIN_PASSWORD) process.env.QUESTERIX_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

const REQUIRED_ENV_VARS = [
  'APP_ORIGIN',
  'QUESTERIX_STUDENT_EMAIL',
  'QUESTERIX_STUDENT_PASSWORD',
  'QUESTERIX_TEACHER_EMAIL',
  'QUESTERIX_TEACHER_PASSWORD',
  'QUESTERIX_ADMIN_EMAIL',
  'QUESTERIX_ADMIN_PASSWORD',
];

REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/debug-auth.log' })
  ]
});

logger.info('Starting debug-auth script');

// Replace console.log and console.error with logger
console.log = (msg) => logger.info(msg);
console.error = (msg) => logger.error(msg);

async function main() {
  try {
    const headed = process.argv.includes('--headed');
    const browser = await chromium.launch({ headless: !headed });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    await page.goto(process.env.APP_ORIGIN, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);

    console.log('Page URL:', page.url());
    console.log('Frames:', page.frames().length);
  } catch (error) {
    console.error('Error during authentication debugging:', error.message);
    process.exit(1);
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

