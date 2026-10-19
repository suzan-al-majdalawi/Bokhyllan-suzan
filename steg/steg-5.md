# Steg 5 · Tester och nästa steg

## Mål

Skriv minst tre komponenttester med Vitest och React Testing Library, och visa att hela E2E-sviten fortfarande är grön.

## Det här har du sett i klippet

- Vitest och React Testing Library: `render`, `screen.getByRole`, `userEvent`
- Testa som en användare: hitta element via roll, label och text, inte via hur komponenten är byggd
- Vad som är värt att testa
- E2E-sviten som regression
- Utblick: TypeScript, Next.js och var du letar vidare

## Appen ska

- Ha minst tre komponenttester i `app/src/`, i filer vars namn slutar på `.test.jsx` (till exempel `app/src/components/BookCard.test.jsx` och `app/src/components/NewBook.test.jsx`):
  1. `BookCard` visar badgen `Läst` när `read` är `true`, och ingen badge när `read` är `false`.
  2. `NewBook` visar felmeddelandet `Fyll i titel och författare` (elementet med `role="alert"`) när formuläret skickas tomt.
  3. `NewBook` anropar `onAdd` med rätt objekt när formuläret är korrekt ifyllt, till exempel `{ title: 'Pippi Långstrump', author: 'Astrid Lindgren', year: 1945 }`.
- Klara alla komponenttester och hela E2E-sviten, steg 1 till 5. `e2e/steg-5.spec.js` går igenom hela appen som en användare: filtrerar, öppnar en bok, gör den till favorit, markerar den som läst, lägger till en bok och laddar om sidan.

Allt är redan installerat i `app/`: `vitest`, `@testing-library/react`, `@testing-library/user-event` och `jsdom`. `app/vitest.config.js` kör testerna i jsdom med `globals: true`, så `test`, `expect` och `vi` finns utan import. Vitest läser bara `*.test.jsx` i `app/src/`, och Playwright läser bara `e2e/`.

## Så här kan du börja

Kör `npm test` (i rotmappen eller i `app/`). Vitest står då och väntar och kör om testerna varje gång du sparar. Avsluta med `q` eller Ctrl+C. Skapa den första testfilen bredvid komponenten:

```jsx
// app/src/components/BookCard.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import BookCard from './BookCard.jsx';

const book = { id: 3, title: 'Aniara', author: 'Harry Martinson', year: 1956, read: false };

test('visar badgen Läst när boken är läst', () => {
  // rendera BookCard med { ...book, read: true } inuti <MemoryRouter>, och förvänta dig texten Läst
});
```

## Du är klar när

`npm run check:5` är grönt. Kommandot kör först Vitest i `app/` och kräver minst tre godkända komponenttester, och kör sedan hela E2E-sviten (alla fem stegen).

## Om du fastnar

- `npm run check:5` skriver att Vitest inte kunde starta, eller du ser `ERR_REQUIRE_ESM` eller `Failed to start forks worker`: din Node är för gammal. Kontrollera med `node -v`. Steg 5 kräver Node 20.19 eller senare, helst Node 22 (`nvm install 22` och `nvm use 22`). Starta sedan om `npm run api` och `npm run dev`.

- Felet "Cannot destructure property 'basename' of 'React.useContext(...)' as it is null" (eller "useHref() may be used only in the context of a <Router> component"): `BookCard` innehåller en `Link`, och en `Link` behöver en router. Rendera kortet inuti `<MemoryRouter>` i testet.
- Testet för "ingen badge" går inte att skriva med `getByText`: `getBy...` kastar ett fel när elementet saknas. Använd `queryByText`, som ger `null`, och `expect(...).toBeNull()`. Kom också ihåg att `userEvent` är asynkront: `const user = userEvent.setup()` och sedan `await user.click(...)`.
