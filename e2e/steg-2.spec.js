// Steg 2: Tillstånd och händelser. Kör med: npm run check:2
import { test, expect } from '@playwright/test';
import { openForm, resetBooks } from './helpers.js';

test.beforeEach(async ({ page, request }) => {
  await resetBooks(request);
  await page.goto('/');
});

test('Visa bara olästa filtrerar listan till tre böcker', async ({
  page,
}) => {
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(6);

  await page.getByTestId('filter-unread').check();

  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(3);
  await expect(
    page.getByTestId('book-title')
  ).toHaveText(['Aniara', 'Utvandrarna', 'Kallocain']);
});

test('knappen på Aniara markerar boken som läst', async ({
  page,
}) => {
  const aniara = page
    .getByTestId('book-card')
    .filter({ hasText: 'Aniara' });
  await expect(
    aniara.getByTestId('badge-read')
  ).toHaveCount(0);
  await expect(
    aniara.getByTestId('toggle-read')
  ).toHaveText('Markera som läst');

  await aniara.getByTestId('toggle-read').click();

  await expect(
    aniara.getByTestId('badge-read')
  ).toBeVisible();
  await expect(
    aniara.getByTestId('toggle-read')
  ).toHaveText('Markera som oläst');
});

test('formuläret har fälten Titel, Författare och År', async ({
  page,
}) => {
  await openForm(page);

  await expect(
    page.getByLabel('Titel')
  ).toHaveAttribute('data-testid', 'input-title');
  await expect(
    page.getByLabel('Författare')
  ).toHaveAttribute('data-testid', 'input-author');
  await expect(page.getByLabel('År')).toHaveAttribute(
    'data-testid',
    'input-year'
  );
  await expect(
    page.getByTestId('submit-book')
  ).toHaveText('Lägg till');
});

test('tomt formulär visar ett felmeddelande', async ({
  page,
}) => {
  await openForm(page);

  await page.getByTestId('submit-book').click();

  await expect(
    page.getByTestId('form-error')
  ).toHaveText('Fyll i titel och författare');
});

test('år som inte är fyra siffror visar samma felmeddelande', async ({
  page,
}) => {
  await openForm(page);

  await page
    .getByTestId('input-title')
    .fill('Pippi Långstrump');
  await page
    .getByTestId('input-author')
    .fill('Astrid Lindgren');
  await page.getByTestId('input-year').fill('45');
  await page.getByTestId('submit-book').click();

  await expect(
    page.getByTestId('form-error')
  ).toHaveText('Fyll i titel och författare');
});

test('formuläret lägger till en bok sist i listan och töms', async ({
  page,
}) => {
  await openForm(page);

  await page
    .getByTestId('input-title')
    .fill('Pippi Långstrump');
  await page
    .getByTestId('input-author')
    .fill('Astrid Lindgren');
  await page.getByTestId('input-year').fill('1945');
  await page.getByTestId('submit-book').click();

  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(7);
  await expect(
    page.getByTestId('book-title').last()
  ).toHaveText('Pippi Långstrump');

  await openForm(page);
  await expect(
    page.getByTestId('input-title')
  ).toHaveValue('');
  await expect(
    page.getByTestId('input-author')
  ).toHaveValue('');
  await expect(
    page.getByTestId('input-year')
  ).toHaveValue('');
});
