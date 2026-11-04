import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


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

interface CreditReportResponse {
  productCodes?: string[];
}

// ---- Load & parse the CSV once, up front ----
//const csvPath = path.join(__dirname, '..', 'test-data', 'consumer-report-data2.csv');
const csvPath = path.join( path.dirname(fileURLToPath(import.meta.url)),  '../../test-data','consumer-report-data2.csv');

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

    const parsedResponse: CreditReportResponse = typeof responseBody === 'string'
      ? JSON.parse(responseBody)
      : responseBody as CreditReportResponse;
    const productCodes = parsedResponse.productCodes;
    console.log('--- Product Codes ---', productCodes);
    

    // Adjust this assertion to match whatever the API actually
    // returns on success. 200 is assumed here.
    expect(status, `Expected 200 for row ${rowNum} but got ${status}`).toBe(200);
  });
});
