import fs from 'fs';
import path from 'path';
import winston from 'winston';

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
    new winston.transports.File({ filename: 'logs/cleanup-screenshots.log' })
  ]
});

const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
const catalogPath = path.join(process.cwd(), 'SCREENSHOT_CATALOG.md');

function getCatalogScreenshots() {
  try {
    const catalogContent = fs.readFileSync(catalogPath, 'utf8');
    const matches = catalogContent.match(/\((\/screenshots\/.*?\.png)\)/g);
    return matches ? matches.map((match) => match.slice(1, -1)) : [];
  } catch (error) {
    logger.error(`Failed to read screenshot catalog: ${error.message}`);
    process.exit(1);
  }
}

function cleanupScreenshots() {
  try {
    const catalogScreenshots = getCatalogScreenshots();
    const allScreenshots = fs.readdirSync(screenshotsDir).map((file) => path.join('/screenshots', file));

    const outdatedScreenshots = allScreenshots.filter((screenshot) => !catalogScreenshots.includes(screenshot));

    outdatedScreenshots.forEach((screenshot) => {
      const fullPath = path.join(screenshotsDir, path.basename(screenshot));
      fs.unlinkSync(fullPath);
      logger.info(`Deleted outdated screenshot: ${screenshot}`);
    });

    logger.info('Screenshot cleanup completed successfully.');
  } catch (error) {
    logger.error(`Failed to clean up screenshots: ${error.message}`);
    process.exit(1);
  }
}

cleanupScreenshots();