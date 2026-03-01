import fs from 'fs';
import path from 'path';
import { compareImages } from 'resemblejs';
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
    new winston.transports.File({ filename: 'logs/visual-regression.log' })
  ]
});

const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
const baselineDir = path.join(process.cwd(), 'public', 'baseline-screenshots');
const diffDir = path.join(process.cwd(), 'public', 'diff-screenshots');

if (!fs.existsSync(diffDir)) {
  fs.mkdirSync(diffDir);
}

function getScreenshots(directory) {
  return fs.readdirSync(directory).filter((file) => file.endsWith('.png'));
}

async function compareScreenshots() {
  try {
    const baselineScreenshots = getScreenshots(baselineDir);
    const currentScreenshots = getScreenshots(screenshotsDir);

    for (const screenshot of baselineScreenshots) {
      if (currentScreenshots.includes(screenshot)) {
        const baselinePath = path.join(baselineDir, screenshot);
        const currentPath = path.join(screenshotsDir, screenshot);
        const diffPath = path.join(diffDir, `diff-${screenshot}`);

        const baselineImage = fs.readFileSync(baselinePath);
        const currentImage = fs.readFileSync(currentPath);

        const result = await compareImages(baselineImage, currentImage, {
          output: {
            errorColor: {
              red: 255,
              green: 0,
              blue: 255
            },
            errorType: 'movement',
            transparency: 0.5,
            largeImageThreshold: 1200
          },
        });

        if (result.rawMisMatchPercentage > 0) {
          fs.writeFileSync(diffPath, result.getBuffer());
          logger.warn(`Visual difference detected: ${screenshot} (Mismatch: ${result.rawMisMatchPercentage.toFixed(2)}%)`);
        } else {
          logger.info(`No visual difference: ${screenshot}`);
        }
      } else {
        logger.warn(`Missing current screenshot for baseline: ${screenshot}`);
      }
    }

    logger.info('Visual regression testing completed.');
  } catch (error) {
    logger.error(`Failed to perform visual regression testing: ${error.message}`);
    process.exit(1);
  }
}

compareScreenshots();