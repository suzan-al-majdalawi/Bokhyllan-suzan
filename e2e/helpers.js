import { expect } from '@playwright/test';

// Återställer mock-API:t till de sex startböckerna.
export const resetBooks = async (request) => {
  const response = await request.post(
    'http://localhost:4000/reset'
  );
  expect(response.ok()).toBe(true);
};

// Går till formuläret för ny bok. I steg 2 och 3 ligger
// det på startsidan,
// från steg 4 på sidan /new (då klickar vi på länken
// "Lägg till bok").
export const openForm = async (page) => {
  await expect(
    page.getByTestId('app-title')
  ).toBeVisible();
  const navNew = page.getByTestId('nav-new');
  if ((await navNew.count()) > 0) {
    await navNew.click();
  }
  await expect(
    page.getByTestId('new-book-form')
  ).toBeVisible();
};
