// Steg 5: hela appen från början till slut, som en användare.
// Det här testet körs av npm run check:5 tillsammans med dina komponenttester.
import { test, expect } from '@playwright/test';
import { resetBooks } from './helpers.js';

test.beforeEach(async ({ request }) => {
  await resetBooks(request);
});

test('hela flödet: filtrera, öppna, favorit, läst och ny bok', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(6);

  // Filtrera fram de olästa och öppna Kallocain.
  await page.getByTestId('filter-unread').check();
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(3);
  await page
    .getByTestId('book-title')
    .filter({ hasText: 'Kallocain' })
    .click();
  await expect(page).toHaveURL('/books/6');

  // Gör boken till favorit och markera den som läst.
  await page.getByTestId('toggle-favorite').click();
  await expect(
    page.getByTestId('favorites-count')
  ).toHaveText('Favoriter: 1');
  const patch = page.waitForResponse(
    (res) => res.request().method() === 'PATCH'
  );
  await page.getByTestId('toggle-read').click();
  await patch;
  await expect(
    page
      .getByTestId('book-detail')
      .getByTestId('badge-read')
  ).toBeVisible();

  // Tillbaka i listan: fyra lästa böcker nu, favoriten
  // räknas fortfarande.
  await page.getByTestId('back-link').click();
  await expect(
    page.getByTestId('badge-read')
  ).toHaveCount(4);
  await expect(
    page.getByTestId('favorites-count')
  ).toHaveText('Favoriter: 1');

  // Lägg till en bok.
  await page.getByTestId('nav-new').click();
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

  // Efter omladdning finns böckerna kvar (API:t), men
  // favoriterna är borta (bara i minnet).
  await page.reload();
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(7);
  await expect(
    page.getByTestId('badge-read')
  ).toHaveCount(4);
  await expect(
    page.getByTestId('favorites-count')
  ).toHaveText('Favoriter: 0');
});
