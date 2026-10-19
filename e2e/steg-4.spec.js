// Steg 4: Delat tillstånd och routing. Kör med: npm run check:4
import { test, expect } from '@playwright/test';
import { resetBooks } from './helpers.js';

test.beforeEach(async ({ request }) => {
  await resetBooks(request);
});

test('sidhuvudet har navigering och favoriträknare', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.getByTestId('nav-list')).toHaveText(
    'Böcker'
  );
  await expect(page.getByTestId('nav-new')).toHaveText(
    'Lägg till bok'
  );
  await expect(
    page.getByTestId('favorites-count')
  ).toHaveText('Favoriter: 0');
});

test('klick på Aniara öppnar detaljsidan /books/3', async ({
  page,
}) => {
  await page.goto('/');

  await page
    .getByTestId('book-title')
    .filter({ hasText: 'Aniara' })
    .click();

  await expect(page).toHaveURL('/books/3');
  const detail = page.getByTestId('book-detail');
  await expect(
    detail.getByTestId('detail-title')
  ).toHaveText('Aniara');
  await expect(
    detail.getByTestId('book-meta')
  ).toHaveText('Harry Martinson · 1956');
});

test('detaljsidan kan markera boken som läst', async ({
  page,
}) => {
  await page.goto('/books/3');
  const detail = page.getByTestId('book-detail');
  await expect(
    detail.getByTestId('badge-read')
  ).toHaveCount(0);

  await detail.getByTestId('toggle-read').click();

  await expect(
    detail.getByTestId('badge-read')
  ).toBeVisible();
  await expect(
    detail.getByTestId('toggle-read')
  ).toHaveText('Markera som oläst');
});

test('favoritknappen räknar upp favoriter i sidhuvudet', async ({
  page,
}) => {
  await page.goto('/books/3');
  await expect(
    page.getByTestId('toggle-favorite')
  ).toHaveText('Lägg till som favorit');

  await page.getByTestId('toggle-favorite').click();

  await expect(
    page.getByTestId('favorites-count')
  ).toHaveText('Favoriter: 1');
  await expect(
    page.getByTestId('toggle-favorite')
  ).toHaveText('Ta bort favorit');
});

test('Tillbaka leder till listan och räknaren står kvar', async ({
  page,
}) => {
  await page.goto('/books/3');
  await page.getByTestId('toggle-favorite').click();

  await page.getByTestId('back-link').click();

  await expect(page).toHaveURL('/');
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(6);
  await expect(
    page.getByTestId('favorites-count')
  ).toHaveText('Favoriter: 1');
});

test('Lägg till bok på /new skickar tillbaka till listan med sju böcker', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByTestId('nav-new').click();
  await expect(page).toHaveURL('/new');
  await expect(
    page.getByTestId('favorites-count')
  ).toHaveText('Favoriter: 0');

  await page
    .getByTestId('input-title')
    .fill('Pippi Långstrump');
  await page
    .getByTestId('input-author')
    .fill('Astrid Lindgren');
  await page.getByTestId('input-year').fill('1945');
  await page.getByTestId('submit-book').click();

  await expect(page).toHaveURL('/');
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(7);
});

test('en bok som inte finns visar Boken finns inte', async ({
  page,
}) => {
  await page.goto('/books/99');

  await expect(
    page.getByTestId('not-found')
  ).toHaveText('Boken finns inte');
});
