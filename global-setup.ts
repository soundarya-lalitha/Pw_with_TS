import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stringify } from 'csv-stringify/sync';

// Must stay in sync with CSV_COLUMNS in the spec file.
const CSV_COLUMNS = [
  'row',
  'firstName',
  'lastName',
  'status',
  'productCodes',
  'requestBody',
  'responseBody'
];

/**
 * Runs exactly once for the entire `npx playwright test` invocation,
 * in the main process, before any worker is spawned — unlike
 * beforeAll/afterAll, which re-run in a fresh worker every time a
 * test fails (see: https://playwright.dev/docs/test-retries).
 *
 * This is the only safe place to reset the results CSV for a run:
 * it guarantees the file gets a clean header exactly once, and is
 * never touched again after that, no matter how many times a worker
 * restarts partway through the row tests.
 */
export default async function globalSetup() {
  const csvInputPath = fileURLToPath(
    new URL('./test-data/consumer-report-data2.csv', import.meta.url)
  );
  const outputPath = path.join(path.dirname(csvInputPath), 'consumer-report-results.csv');

  const header = stringify([], { header: true, columns: CSV_COLUMNS });
  fs.writeFileSync(outputPath, header, 'utf-8');

  console.log(`\n[global-setup] Results file reset for this run: ${outputPath}`);
}
