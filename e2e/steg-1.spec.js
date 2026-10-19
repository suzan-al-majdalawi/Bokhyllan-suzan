// Steg 1: Första komponenten. Kör med: npm run check:1
import { test, expect } from '@playwright/test';
import { resetBooks } from './helpers.js';

test.beforeEach(async ({ page, request }) => {
  await resetBooks(request);
  await page.goto('/');
});

test('listan visar sex bokkort', async ({ page }) => {
  await expect(
    page.getByTestId('book-card')
  ).toHaveCount(6);
});

test('första kortet har titeln Röde Orm', async ({
  page,
}) => {
  const firstCard = page
    .getByTestId('book-card')
    .first();
  await expect(
    firstCard.getByTestId('book-title')
  ).toHaveText('Röde Orm');
});

test('första kortet visar författare och år', async ({
  page,
}) => {
  const firstCard = page
    .getByTestId('book-card')
    .first();
  await expect(
    firstCard.getByTestId('book-meta')
  ).toHaveText('Frans G. Bengtsson · 1941');
});

test('tre böcker har badgen Läst', async ({ page }) => {
  const badges = page.getByTestId('badge-read');
  await expect(badges).toHaveCount(3);
  await expect(badges.first()).toHaveText('Läst');
});

test('kort 3, Aniara, har ingen badge', async ({
  page,
}) => {
  const thirdCard = page
    .getByTestId('book-card')
    .nth(2);
  await expect(
    thirdCard.getByTestId('book-title')
  ).toHaveText('Aniara');
  await expect(
    thirdCard.getByTestId('badge-read')
  ).toHaveCount(0);
});
