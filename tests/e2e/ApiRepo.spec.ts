import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Collected across all row tests so the CSV writer and the Analytics
 * block at the bottom of this file can work with every row's data
 * once all row tests have run.
 */
interface RowResult {
  row: number;
  firstName: string;
  lastName: string;
  status: number;
  requestBody: unknown;
  responseBody: unknown;
  productCodes: string[];
}
const allResults: RowResult[] = [];

/**
 * Shape of a single row coming out of the CSV file.
 * Headers must match the CSV exactly.
 */
interface ConsumerRow {
  firstName: string;
  lastName: string;
  dob: string;
  ssn: string;
  'STREET #': string;
  'STREET NAME': string;
  SUFFIX: string;
  city: string;
  state: string;
  ZIPCODE: string;
}

// ---- Load & parse the CSV once, up front ----
const csvPath = fileURLToPath(
  new URL('../../test-data/consumer-report-data2.csv', import.meta.url)
);
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const records: ConsumerRow[] = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

// Must stay in sync with CSV_COLUMNS in global-setup.ts.
const CSV_COLUMNS = [
  'row',
  'firstName',
  'lastName',
  'status',
  'productCodes',
  'requestBody',
  'responseBody'
];
const outputCsvPath = path.join(path.dirname(csvPath), 'consumer-report-results.csv');

/**
 * Reads the results CSV back off disk and reconstructs RowResult
 * entries from it. Used by the Analytics tests instead of the
 * in-memory `allResults` array, because `allResults` has the exact
 * same worker-restart blind spot the old afterAll writer had: if any
 * row failed earlier in the run, the worker that's now running
 * Analytics is a fresh process whose `allResults` only contains rows
 * from after the restart. The CSV file, built via appendRowToCsv, is
 * the only thing in this file guaranteed to hold every row from the
 * entire run — so Analytics reads from it instead.
 */
function loadAllResultsFromCsv(): RowResult[] {
  if (!fs.existsSync(outputCsvPath)) return [];

  const content = fs.readFileSync(outputCsvPath, 'utf-8');
  const rows: Array<Record<string, string>> = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return rows.map(r => ({
    row: Number(r.row),
    firstName: r.firstName,
    lastName: r.lastName,
    status: Number(r.status),
    requestBody: undefined,
    responseBody: undefined,
    productCodes: r.productCodes ? r.productCodes.split(';').filter(Boolean) : []
  }));
}

/**
 * Appends a single row to the results CSV immediately, regardless of
 * that row's status or pass/fail outcome. Writing per-row (instead of
 * collecting everything and writing once in afterAll) is what makes
 * this survive a worker restart: if any row fails, Playwright discards
 * the whole worker process and starts a fresh one for the remaining
 * rows (this happens even with retries disabled — it's default
 * behavior). A fresh worker means this file's module state, including
 * allResults, resets to empty. A single end-of-run afterAll write in
 * that new worker would only see its own rows and overwrite the file,
 * silently losing every row that ran before the restart. Appending
 * immediately, per row, means each row is durably on disk the moment
 * it completes, independent of whatever happens afterward.
 */
function appendRowToCsv(entry: RowResult) {
  const line = stringify(
    [
      {
        row: entry.row,
        firstName: entry.firstName,
        lastName: entry.lastName,
        status: entry.status,
        productCodes: entry.productCodes.join(';'),
        requestBody: JSON.stringify(entry.requestBody),
        responseBody: JSON.stringify(entry.responseBody)
      }
    ],
    { header: false, columns: CSV_COLUMNS }
  );
  fs.appendFileSync(outputCsvPath, line, 'utf-8');
}

/**
 * The CSV splits the street address across 3 columns
 * (STREET #, STREET NAME, SUFFIX). Some rows already have the
 * full address crammed into "STREET #" with the other two blank
 * (e.g. "1020 17TH AVE N"). Joining the non-empty parts handles
 * both cases correctly.
 */
function buildLine1(row: ConsumerRow): string {
  return [row['STREET #'], row['STREET NAME'], row['SUFFIX']]
    .map(part => (part ?? '').trim())
    .filter(part => part.length > 0)
    .join(' ');
}

// function to extract the first 5 digits of zip code from each row of csv file
function extractZipCode(zipCode: string): string {
  return zipCode.substring(0, 5);
}

test.describe('Credit Report API', () => {

  records.forEach((row, index) => {
    const rowNum = index + 1;

    test(`Credit report API - row ${rowNum}: ${row.firstName} ${row.lastName}`, async ({ request }) => {
      const requestBody = {
        callerId: 'leadhouse-intake-web',
        // kept unique per row so the API doesn't see duplicate request IDs
        callerRequestId: `prod-smoke-004-${rowNum}`,
        consumer: {
          firstName: row.firstName,
          lastName: row.lastName,
          dob: row.dob,
          ssn: row.ssn,
          currentAddress: {
            line1: buildLine1(row),
            city: row.city,
            state: row.state,
            zipCode: extractZipCode(row.ZIPCODE)
          }
        },
        permissiblePurpose: '3F',
        addOns: ['BASE_PROFILE'],
        includeProductCodes: true
      };
      //commented by me-Lalitha
     // console.log(`\n===== Row ${rowNum}: ${row.firstName} ${row.lastName} =====`);
      //console.log('--- Request Body ---');
      //console.log(JSON.stringify(requestBody, null, 2));

      const response = await request.post('/v1/credit-reports', {
        data: requestBody
      });

      const status = response.status();
      let responseBody: unknown;
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text();
      }
      //commented by me-Lalitha
      console.log(`--- Response (status ${status}) ---`);
     console.log(JSON.stringify(responseBody, null, 2));

      // Pull out product codes for the Analytics block below.
      // Recorded before the assertion so a failed row still counts.
      const productCodes: string[] =
        (responseBody as any)?.report?.productCodes ?? [];

      allResults.push({
        row: rowNum,
        firstName: row.firstName,
        lastName: row.lastName,
        status,
        requestBody,
        responseBody,
        productCodes
      });

      // Written immediately, unconditionally — this row is now durably
      // on disk regardless of whether the assertion below passes,
      // fails, or a later row causes a worker restart.
      appendRowToCsv({
        row: rowNum,
        firstName: row.firstName,
        lastName: row.lastName,
        status,
        requestBody,
        responseBody,
        productCodes
      });

      // Adjust this assertion to match whatever the API actually
      // returns on success. 200 is assumed here.
      expect(status, `Expected 200 for row ${rowNum} but got ${status}`).toBe(200);
    });
  });
});

// =====================================================================
// Analytics
// =====================================================================
// Runs once all row tests above have completed (guaranteed by
// test.describe.serial on "Credit Report API" running first in file
// order). Reads product-code input from environment variables that
// are populated by scripts/run-with-prompts.mjs, which interactively
// asks the user for these values before spawning Playwright.
//
// Run via: npm run test:interactive
test.describe.serial('Analytics', () => {
  const singleCode = process.env.SINGLE_PRODUCT_CODE?.trim();
  const pctCode = process.env.PCT_PRODUCT_CODE?.trim();

  const comboCodes = (process.env.COMBO_PRODUCT_CODES ?? '')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean)
    .slice(0, 4);

  const has = (r: RowResult, code: string) => r.productCodes.includes(code);

  test('1) Responses with a specific product code (user-prompted)', async () => {
    test.skip(
      !singleCode,
      'No product code provided. Run "npm run test:interactive" and enter a code when prompted.'
    );

    const results = loadAllResultsFromCsv();
    const matches = results.filter(r => has(r, singleCode!));

    console.log(`\n===== Analytics 1: product code ${singleCode} =====`);
    console.log(`Responses with product code ${singleCode}: ${matches.length} / ${results.length}`);
    console.log(
      'Matching rows:',
      matches.map(r => `${r.row}:${r.firstName} ${r.lastName}`)
    );
  });

  test('2) Percentage of responses with a specific product code (user-prompted, separate from test 1)', async () => {
    test.skip(
      !pctCode,
      'No product code provided. Run "npm run test:interactive" and enter a code when prompted.'
    );

    const results = loadAllResultsFromCsv();
    const totalRecords = results.length;
    const matches = results.filter(r => has(r, pctCode!));
    const pct = totalRecords > 0 ? (matches.length / totalRecords) * 100 : 0;

    console.log(`\n===== Analytics 2: % with product code ${pctCode} =====`);
    console.log(
      `Responses with product code ${pctCode}: ${matches.length} / ${totalRecords} (${pct.toFixed(2)}%)`
    );

    // Informational only — Analytics tests report, they don't assert.
    // A code with zero matches (0.00%) is a valid, useful result, not
    // a failure, so this never throws — it just tells you so.
    if (totalRecords === 0) {
      console.warn('No results collected — run the full file, not a filtered subset.');
    }
  });

  test('3) Responses matching a combination of up to 4 product codes (user-prompted)', async () => {
    test.skip(
      !(comboCodes.length >= 1 && comboCodes.length <= 4),
      `Combination check requires 1 to 4 product codes; got ${comboCodes.length}. Run "npm run test:interactive" and enter 1-4 comma-separated codes when prompted.`
    );

    const results = loadAllResultsFromCsv();
    const matches = results.filter(r => comboCodes.every(code => has(r, code)));

    console.log(`\n===== Analytics 3: combination [${comboCodes.join(', ')}] =====`);
    console.log(`Responses matching ALL of [${comboCodes.join(', ')}]: ${matches.length} / ${results.length}`);
    console.log(
      'Matching rows:',
      matches.map(r => `${r.row}:${r.firstName} ${r.lastName}`)
    );
  });
});
