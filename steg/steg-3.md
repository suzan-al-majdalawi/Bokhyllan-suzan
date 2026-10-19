# Steg 3 · Effekter och egna hooks

## Mål

Hämta och spara böckerna via API:t med `useEffect`, samlat i en egen hook: `useBooks`.

## Det här har du sett i klippet

- `useEffect`: körs efter render, dependency-arrayen och varför `[]` betyder "en gång när komponenten visas"
- `fetch` med `async` och `await` inuti effekten
- Laddnings- och feltillstånd
- Custom hook: en egen funktion som börjar på `use` och använder andra hooks
- `PATCH` och `POST` från klienten

## Appen ska

- Fortfarande klara allt från steg 1 och 2, nu mot API:t.
- Ha all datalogik i `app/src/hooks/useBooks.js`, som exporterar `useBooks`. Hooken returnerar `{ books, loading, error, addBook, toggleRead }`, och `BookList` använder den. `app/src/data/books.js` används inte längre av appen (filen får ligga kvar).
- Hämta böckerna med `fetch('/api/books')`.
- Visa `Laddar böcker…` med `data-testid="loading"` medan hämtningen pågår. Obs: `…` är ett enda tecken (ellips), kopiera det härifrån.
- Visa `Kunde inte hämta böcker` med `data-testid="error"` om anropet misslyckas.
- Låta `toggle-read` skicka `PATCH /api/books/:id` med `{ read }` och uppdatera boken i listan med boken som API:t svarar med.
- Låta formuläret skicka `POST /api/books` med `{ title, author, year }` och lägga till boken som API:t svarar med. API:t sätter `id` och `read: false`.
- Behålla ändringarna när sidan laddas om, eftersom de nu sparas i API:t.

API:t (`api/server.js`) har de här endpointsen. I appen når du dem via `/api`, så `GET /books` blir `fetch('/api/books')`:

| Anrop | Body | Svar |
|---|---|---|
| `GET /books` | | alla böcker |
| `GET /books/:id` | | en bok, eller 404 (behövs först i steg 4) |
| `POST /books` | `{ title, author, year }` | 201 och den nya boken |
| `PATCH /books/:id` | `{ read }` | den uppdaterade boken |

Testerna i `e2e/steg-3.spec.js` nollställer API:t till de sex böckerna före varje test och kontrollerar:

- `Laddar böcker…` syns medan böckerna hämtas (testet fördröjer svaret 500 ms) och försvinner sedan
- de 6 korten kommer från `/api/books`
- klick på `toggle-read` på Aniara och sedan omladdning av sidan: badgen `Läst` finns kvar
- när anropet till `/api/books` avbryts syns `Kunde inte hämta böcker`
- en ny bok och sedan omladdning: 7 kort, och den sista är den nya boken

## Så här kan du börja

Nu behövs två terminaler i rotmappen: `npm run api` (visar `API på http://localhost:4000`) och `npm run dev`. Vite skickar allt under `/api` vidare till API:t, så du slipper CORS. Data i API:t ligger i minnet: starta om `npm run api` om du vill tillbaka till de sex böckerna.

```js
// app/src/hooks/useBooks.js
import { useEffect, useState } from 'react';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  // loading, error, en useEffect som hämtar, addBook och toggleRead
  return { books, loading, error, addBook, toggleRead };
};
```

### Viktigt: alla hooks överst i komponenten

När `BookList` får `if (loading) return …` och `if (error) return …` måste alla hooks stå **före** de här if-satserna. Det gäller också `useState` för `showUnread` från steg 2. React känner igen varje hook på i vilken ordning den anropas, och ordningen måste vara densamma vid varje render. Står `useState` efter en tidig `return` hoppas den över medan böckerna laddas, och sidan blir tom när laddningen är klar.

```jsx
// app/src/components/BookList.jsx
import { useState } from 'react';
import { useBooks } from '../hooks/useBooks.js';
import BookCard from './BookCard.jsx';
import NewBook from './NewBook.jsx';

const BookList = () => {
  const { books, loading, error, addBook, toggleRead } = useBooks();
  const [showUnread, setShowUnread] = useState(false); // före if-satserna

  if (loading) {
    return <p data-testid="loading">Laddar böcker…</p>;
  }
  if (error) {
    return <p data-testid="error">Kunde inte hämta böcker</p>;
  }
  // ... resten som i steg 2
```

Regeln är två delar: anropa hooks bara överst i en komponent (eller i en egen hook), och aldrig i en if-sats, en loop eller efter en tidig `return`. I Vue körs `<script setup>` en gång, men i React körs hela funktionen vid varje render. Därför spelar ordningen roll.

`import { books as initialBooks } from '../data/books.js'` från steg 2 ska bort ur `BookList`, men `import { useState }` behövs kvar för `showUnread`.

## Du är klar när

`npm run check:3` är grönt (5 tester). Kör också `npm run check:1-3`, som kör steg 1 till 3 tillsammans.

## Om du fastnar

- Sidan blir tom när böckerna har laddats, och konsolen säger `Rendered more hooks than during the previous render` eller `React has detected a change in the order of Hooks`: en hook (oftast `useState` för `showUnread`) står efter `if (loading)` eller `if (error)`. Flytta upp den, se "Viktigt: alla hooks överst i komponenten" ovan.
- Network-fliken visar två `GET books` när sidan laddas: det är väntat. `app/src/main.jsx` har `<StrictMode>`, som i utvecklingsläge kör effekterna två gånger med flit för att hitta buggar. I en byggd app (`npm run build`) körs effekten en gång.
- Funktionen du ger till `useEffect` får inte vara `async`. Skriv en `async`-funktion inuti effekten och anropa den direkt där.
- Felet visas aldrig, eller listan är tom: titta i Network-fliken i webbläsaren. Är API:t igång (`npm run api`)? Kom ihåg att `fetch` bara kastar fel vid nätverksfel. Kontrollera `response.ok` själv och kasta ett fel om det är `false`.
