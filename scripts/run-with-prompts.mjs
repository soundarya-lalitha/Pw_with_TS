// Interactively prompts for the product codes used by the Analytics
// tests, then runs Playwright with those values passed through as
// environment variables (SINGLE_PRODUCT_CODE, PCT_PRODUCT_CODE,
// COMBO_PRODUCT_CODES).
//
// Usage: npm run test:interactive

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { spawn } from 'node:child_process';

const rl = readline.createInterface({ input, output });

const singleCode = (
  await rl.question('Enter a product code to check (Analytics test 1 - count): ')
).trim();

const pctCode = (
  await rl.question('Enter a product code to check (Analytics test 2 - percentage, can be different from test 1): ')
).trim();

// Loop until the user gives between 1 and 4 codes.
let comboCodes = [];
while (comboCodes.length < 1 || comboCodes.length > 4) {
  const comboInput = await rl.question(
    'Enter 1 to 4 product codes for the combination check, comma-separated (Analytics test 3): '
  );

  comboCodes = comboInput
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);

  if (comboCodes.length < 1 || comboCodes.length > 4) {
    console.log(`  -> Got ${comboCodes.length} code(s). Please enter 1 to 4, separated by a comma.\n`);
  }
}

rl.close();

console.log(`\nUsing SINGLE_PRODUCT_CODE=${singleCode || '(none)'}`);
console.log(`Using PCT_PRODUCT_CODE=${pctCode || '(none)'}`);
console.log(`Using COMBO_PRODUCT_CODES=${comboCodes.join(',')}\n`);

const child = spawn('npx', ['playwright', 'test','ApiRepo.spec.ts','--project=APILead'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    SINGLE_PRODUCT_CODE: singleCode,
    PCT_PRODUCT_CODE: pctCode,
    COMBO_PRODUCT_CODES: comboCodes.join(',')
  }
});

child.on('exit', code => {
  process.exit(code ?? 1);
});
