// Kvitto för steg 5: npm run check:5
// 1. Kör komponenttesterna (Vitest) i app/ och kräver minst tre godkända tester.
// 2. Kör hela E2E-sviten (Playwright), steg 1 till 5.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const MIN_TESTS = 3;
const resultFile = join(tmpdir(), 'bokhyllan-vitest-results.json');
const isWindows = process.platform === 'win32';

const run = (command, args, cwd) =>
  spawnSync(command, args, { cwd, stdio: 'inherit', shell: isWindows }).status;

const fail = (message) => {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
};

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 20 || (major === 20 && minor < 19)) {
  fail(
    `Du kör Node ${process.versions.node}. Steg 5 kräver Node 20.19 eller senare, helst Node 22 (nvm install 22 och nvm use 22). Kontrollera med node -v.`,
  );
}

console.log('\nSteg 5, del 1: komponenttester med Vitest\n');
rmSync(resultFile, { force: true });
const vitestStatus = run(
  'npx',
  ['vitest', 'run', '--reporter=default', '--reporter=json', `--outputFile.json=${resultFile}`],
  'app',
);

const noTestsMessage = 'Vitest hittade inga komponenttester. Lägg dem i app/src/ med filnamn som slutar på .test.jsx.';
const crashMessage =
  'Vitest kunde inte starta, se felet ovan. Kontrollera Node-versionen med node -v (kräver 20.19 eller senare) och att npm install har körts.';
if (!existsSync(resultFile)) {
  fail(vitestStatus === 0 ? noTestsMessage : crashMessage);
}

const result = JSON.parse(readFileSync(resultFile, 'utf8'));
const passed = result.numPassedTests ?? 0;
const failed = result.numFailedTests ?? 0;

if (result.numTotalTests === 0) {
  fail(result.numFailedTestSuites > 0 ? crashMessage : noTestsMessage);
}

if (failed > 0) {
  fail(`${failed} komponenttest(er) misslyckades. Fixa dem först.`);
}
if (passed < MIN_TESTS) {
  fail(`${passed} godkända komponenttester. Det behövs minst ${MIN_TESTS}.`);
}
console.log(`\n✓ ${passed} godkända komponenttester (minst ${MIN_TESTS} krävs)\n`);

console.log('Steg 5, del 2: hela E2E-sviten med Playwright\n');
const e2eStatus = run('npx', ['playwright', 'test'], '.');
if (e2eStatus !== 0) {
  fail('E2E-sviten är inte grön.');
}

console.log('\n✓ Steg 5 klart: komponenttester och hela E2E-sviten är gröna.\n');
