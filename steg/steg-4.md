# Steg 4 · Delat tillstånd och routing

## Mål

Dela upp appen i tre sidor med React Router och räkna favoriter med Context och `useReducer`.

## Det här har du sett i klippet

- Prop drilling och varför Context finns
- `createContext` och `useContext`
- `useReducer`: ett state som ändras med actions
- React Router: `BrowserRouter`, `Routes`, `Route`, `Link`, `useParams`, `useNavigate`

## Appen ska

- Fortfarande klara allt från steg 1, 2 och 3. Formuläret flyttar till `/new`, och testerna från steg 2 och 3 hittar det där via länken `Lägg till bok`.
- Använda React Router, som redan är installerat (paketet `react-router`). `BrowserRouter` läggs runt `<App />` i `app/src/main.jsx`.
- Ha tre routes:
  - `/` visar listan (`BookList`, nu utan formuläret)
  - `/books/:id` visar `BookDetail` (`app/src/components/BookDetail.jsx`)
  - `/new` visar formuläret `NewBook` och navigerar till `/` när boken är sparad i API:t (till exempel via en sidkomponent `app/src/components/NewBookPage.jsx`)
- Visa samma sidhuvud på alla sidor:
  - `Bokhyllan` (`data-testid="app-title"`)
  - en `<nav>` med länkarna `Böcker` till `/` (`data-testid="nav-list"`) och `Lägg till bok` till `/new` (`data-testid="nav-new"`)
  - `Favoriter: N` med `data-testid="favorites-count"`, där N är antalet favoriter (`Favoriter: 0` från början)
- Göra titeln i varje bokkort till en `Link` till `/books/:id`. `data-testid="book-title"` sitter på länken.
- Visa detaljsidan som ett element med `data-testid="book-detail"` som innehåller
  - titeln i en `<h2>` med `data-testid="detail-title"`
  - författare och år med `data-testid="book-meta"`, till exempel `Harry Martinson · 1956`
  - badgen `Läst` (`data-testid="badge-read"`) när boken är läst, och knappen `toggle-read` med samma texter som i kortet
  - knappen `Lägg till som favorit` / `Ta bort favorit` med `data-testid="toggle-favorite"`
  - länken `Tillbaka` till `/` med `data-testid="back-link"`
- Visa `Boken finns inte` med `data-testid="not-found"` när det inte finns någon bok med id:t i adressen.
- Ha favoriterna i `FavoritesContext` (`app/src/context/FavoritesContext.jsx`) med `useReducer` och en action med `type: 'toggle'`, som lägger till bokens id om det saknas och tar bort det annars.
- Inte spara favoriterna någonstans: de försvinner när sidan laddas om. Det är avsiktligt.

Testerna i `e2e/steg-4.spec.js` kontrollerar:

- sidhuvudet har `Böcker`, `Lägg till bok` och `Favoriter: 0`
- klick på `Aniara` ger adressen `/books/3`, `detail-title` är `Aniara` och meta är `Harry Martinson · 1956`
- `toggle-read` på detaljsidan ger badgen `Läst` och texten `Markera som oläst`
- klick på `toggle-favorite` ger `Favoriter: 1` och knapptexten `Ta bort favorit`
- `Tillbaka` leder till listan med 6 kort och räknaren står kvar på `Favoriter: 1`
- `Lägg till bok` leder till `/new`, och en ny bok skickar dig tillbaka till `/` med 7 kort
- adressen `/books/99` visar `Boken finns inte`

## Så här kan du börja

Börja med routingen (`main.jsx`, `App.jsx`, länken i kortet och `BookDetail`), och lägg till favoriterna sist. En bra uppdelning är en egen komponent för sidhuvudet, eftersom det ska läsa favoriterna ur Context, och en liten sidkomponent för `/new` som anropar `addBook` och sedan `navigate('/')`. `app/src/index.css` har klassen `book-detail` för detaljsidan.

```jsx
// app/src/context/FavoritesContext.jsx
import { createContext, useContext, useReducer } from 'react';

const FavoritesContext = createContext(null);

const favoritesReducer = (state, action) => {
  // action.type === 'toggle': lägg till eller ta bort action.id
};
```

### Viktigt: hookarna överst i BookDetail

Samma regel som i steg 3: alla hooks före varje tidig `return`. I `BookDetail` betyder det att `useFavorites()` anropas överst, tillsammans med `useParams()` och `useBooks()`, och att bara uträkningen som använder `book.id` står efter `if (!book)`. Vänta också tills böckerna är hämtade innan du säger att boken saknas, annars blinkar `Boken finns inte` förbi medan böckerna laddas.

```jsx
// app/src/components/BookDetail.jsx (början)
import { Link, useParams } from 'react-router';
import { useBooks } from '../hooks/useBooks.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

const BookDetail = () => {
  const { id } = useParams();
  const { books, loading, error, toggleRead } = useBooks();
  const { favorites, dispatch } = useFavorites(); // hooks överst

  if (loading) {
    return <p data-testid="loading">Laddar böcker…</p>;
  }
  if (error) {
    return <p data-testid="error">Kunde inte hämta böcker</p>;
  }

  const book = books.find((b) => b.id === Number(id));
  if (!book) {
    return <p data-testid="not-found">Boken finns inte</p>;
  }
  const isFavorite = favorites.includes(book.id); // ingen hook, får stå här
  // ...
```

Lägg till `FavoritesProvider` i `App.jsx` först när du kommer till favoriterna. Innan filen finns ger importen ett fel.

## Du är klar när

`npm run check:4` är grönt (7 tester). Kör också `npm run check:1-4`, som kör steg 1 till 4 tillsammans. Kör du hela sviten med `npm run test:e2e` ska även `e2e/steg-5.spec.js` vara grönt redan nu, eftersom det bara går igenom appen du har byggt. Det som återstår i steg 5 är dina egna komponenttester.

## Om du fastnar

- `useContext` ger `null` (felet "Cannot destructure property"): komponenten ligger utanför providern. Providern måste omsluta både sidhuvudet och `<Routes>`.
- Konsolen säger `React has detected a change in the order of Hooks called by BookDetail`: `useFavorites()` står efter `if (!book)`. Se "Viktigt: hookarna överst i BookDetail" ovan.
- Detaljsidan visar `Boken finns inte` fast boken finns: `useParams` ger id:t som en sträng, så jämför med `Number(id)`. Vänta också tills böckerna är hämtade (`loading` är `false`) innan du bestämmer att boken saknas.
