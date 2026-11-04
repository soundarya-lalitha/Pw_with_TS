import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import { fileURLToPath } from 'url';
/**
 * Collected across all row tests so the Analytics block at the
 * bottom of this file can crunch numbers once every row has run.
 * Populated inside each row test, read by the Analytics tests.
 */
interface RowResult {
  row: number;
  name: string;
  status: number;
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


//function to extract the first 5 digtis of zip code from each row of csv file
function extractZipCode(zipCode: string): string {
  return zipCode.substring(0, 5);
}

test.describe.serial('Credit Report API', () => {
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
          zipCode: extractZipCode(row.ZIPCODE),
        }
      },
      permissiblePurpose: '3F',
      addOns: ['BASE_PROFILE'],
      includeProductCodes: true
    };

    console.log(`\n===== Row ${rowNum}: ${row.firstName} ${row.lastName} =====`);
    console.log('--- Request Body ---');
    console.log(JSON.stringify(requestBody, null, 2));

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

    console.log(`--- Response (status ${status}) ---`);
    console.log(JSON.stringify(responseBody, null, 2));

    // Pull out product codes for the Analytics block below.
    // Recorded before the assertion so a failed row still counts.
    const productCodes: string[] =
      (responseBody as any)?.report?.productCodes ?? [];

    allResults.push({
      row: rowNum,
      name: `${row.firstName} ${row.lastName}`,
      status,
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
// test.describe.serial), then crunches numbers over every response's
// productCodes array collected in `allResults`.
test.describe.serial('Analytics', () => {
  test('Product code analytics', async () => {
    const totalRecords = allResults.length;

    const has = (r: RowResult, code: string) => r.productCodes.includes(code);

    const count2065 = allResults.filter(r => has(r, '2065')).length;
    const count3437 = allResults.filter(r => has(r, '3437')).length;
    const countBoth2065And2424 = allResults.filter(
      r => has(r, '2065') && has(r, '2424')
    ).length;

    const pct3437 = totalRecords > 0 ? (count3437 / totalRecords) * 100 : 0;

    console.log('\n===== Analytics =====');
    console.log(`Total records: ${totalRecords}`);
    console.log(`1) Responses with product code 2065: ${count2065}`);
    console.log(
      `2) Responses with product code 3437: ${count3437} / ${totalRecords} ` +
      `(${pct3437.toFixed(2)}%)`
    );
    console.log(
      `3) Responses with BOTH 2065 and 2424: ${countBoth2065And2424}`
    );

    // Show which rows matched each condition, for quick investigation.
    console.log(
      '2065 rows:',
      allResults.filter(r => has(r, '2065')).map(r => `${r.row}:${r.name}`)
    );
    console.log(
      '3437 rows:',
      allResults.filter(r => has(r, '3437')).map(r => `${r.row}:${r.name}`)
    );
    console.log(
      '2065+2424 rows:',
      allResults
        .filter(r => has(r, '2065') && has(r, '2424'))
        .map(r => `${r.row}:${r.name}`)
    );

    // Sanity check only — fails loudly if row tests didn't run before
    // this (e.g. someone used --grep to run Analytics in isolation).
    expect(
      totalRecords,
      'No results collected — run the full file (not a filtered subset) so Analytics has data to work with.'
    ).toBeGreaterThan(0);
  });
});
