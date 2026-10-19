# Steg 1 · Första komponenten

## Mål

Visa de sex böckerna som kort under sidhuvudet, med två egna komponenter: `BookList` och `BookCard`.

## Det här har du sett i klippet

- Vite-projekt: `npm run dev` startar appen och sidan uppdateras när du sparar
- JSX: `className` i stället för `class`, en rot per komponent, måsvingar `{ }` för JavaScript-uttryck
- En komponent är en funktion som returnerar JSX
- Props: data som skickas in i en komponent
- Listor med `map` och `key`
- Villkor med `&&`

## Appen ska

- Rendera komponenten `BookList` under sidhuvudet i `app/src/App.jsx`. Sidhuvudet som redan finns (`<h1 data-testid="app-title">Bokhyllan</h1>`) ska stå kvar.
- `BookList` (`app/src/components/BookList.jsx`) visar ett `BookCard` per bok i `app/src/data/books.js`, i samma ordning som i filen.
- `BookCard` (`app/src/components/BookCard.jsx`) tar emot en bok som prop och visar:
  - kortet som ett `<article>` med `data-testid="book-card"`
  - titeln med `data-testid="book-title"`, till exempel `Röde Orm`
  - författare och år med `data-testid="book-meta"`, exakt så här: `Frans G. Bengtsson · 1941` (mellanslag, en mittpunkt `·`, mellanslag)
  - badgen `Läst` med `data-testid="badge-read"`, men bara när bokens `read` är `true`

Testerna i `e2e/steg-1.spec.js` kontrollerar:

- det finns 6 kort
- första kortets titel är `Röde Orm`
- första kortets meta är `Frans G. Bengtsson · 1941`
- det finns 3 badges med texten `Läst`
- kort 3 (Aniara) har ingen badge

## Så här kan du börja

Öppna en terminal i rotmappen och kör `npm run dev`. Appen finns på http://localhost:5173. I steg 1 behövs inte API:t: böckerna kommer från `app/src/data/books.js`.

Alla filer du skriver ligger i `app/src/`. Står du i rotmappen, skapa alltså inte en egen `src/` där.

Skapa mappen `app/src/components/` och filerna `BookCard.jsx` och `BookList.jsx`. Böckerna hämtar du i `BookList` med `import { books } from '../data/books.js';`. I `app/src/index.css` finns färdiga klasser som du kan använda med `className`: `book-list` runt korten, `book-card` på kortet och `badge` på badgen.

```jsx
// app/src/components/BookCard.jsx
const BookCard = ({ book }) => (
  <article className="book-card" data-testid="book-card">
    {/* titel, "författare · år" och badgen Läst */}
  </article>
);

export default BookCard;
```

## Du är klar när

`npm run check:1` är grönt (5 tester).

## Om du fastnar

- Testet hittar inte ett element: kontrollera att `data-testid` är stavat exakt som ovan och sitter på rätt element, och att texten stämmer tecken för tecken. Kopiera gärna `·` härifrån. Högerklicka i webbläsaren och välj Inspektera för att se vad som faktiskt renderas.
- Sidan är tom: öppna webbläsarens konsol (F12) och titta i terminalen där `npm run dev` körs. Vanliga orsaker är en glömd `export default` eller en import med fel sökväg (glöm inte `.jsx`).
