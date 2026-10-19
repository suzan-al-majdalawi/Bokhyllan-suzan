// Steg 3: Effekter och egna hooks. Kör med: npm run check:3
// Playwright startar API:t själv om det inte redan är igång.
import { test, expect } from '@playwright/test';
import { openForm, resetBooks } from './helpers.js';

test.beforeEach(async ({ request }) => {
  await resetBooks(request);
});

test('laddningstexten syns medan böckerna hämtas', async ({
  page,
}) => {
  // Fördröj svaret från API:t med 500 ms så att
  // laddningstexten hinner synas.
  await page.route('**/api/books', async (route) => {
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );
    await route.continue();
  });

  await page.goto('/');

  await expect(page.getByTestId('loading')).toHaveText(
    'Laddar böcker…'
  );
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(6);
  await expect(page.getByTestId('loading')).toHaveCount(
    0
  );
});

test('böckerna hämtas från /api/books', async ({
  page,
}) => {
  const response = page.waitForResponse('**/api/books');

  await page.goto('/');

  expect((await response).ok()).toBe(true);
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(6);
});

test('läst-markeringen sparas i API:t och finns kvar efter omladdning', async ({
  page,
}) => {
  await page.goto('/');
  const aniara = page
    .getByTestId('book-card')
    .filter({ hasText: 'Aniara' });

  const patch = page.waitForResponse(
    (res) => res.request().method() === 'PATCH'
  );
  await aniara.getByTestId('toggle-read').click();
  await patch;
  await expect(
    aniara.getByTestId('badge-read')
  ).toBeVisible();

  await page.reload();

  await expect(
    aniara.getByTestId('badge-read')
  ).toBeVisible();
});

test('felmeddelande visas när API-anropet misslyckas', async ({
  page,
}) => {
  await page.route('**/api/books', (route) =>
    route.abort()
  );

  await page.goto('/');

  await expect(page.getByTestId('error')).toHaveText(
    'Kunde inte hämta böcker'
  );
});

test('ny bok sparas i API:t och finns kvar efter omladdning', async ({
  page,
}) => {
  await page.goto('/');
  await openForm(page);

  await page
    .getByTestId('input-title')
    .fill('Pippi Långstrump');
  await page
    .getByTestId('input-author')
    .fill('Astrid Lindgren');
  await page.getByTestId('input-year').fill('1945');
  const post = page.waitForResponse(
    (res) => res.request().method() === 'POST'
  );
  await page.getByTestId('submit-book').click();
  await post;
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(7);

  await page.reload();

  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(7);
  await expect(
    page.getByTestId('book-title').last()
  ).toHaveText('Pippi Långstrump');
});
