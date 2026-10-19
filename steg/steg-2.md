# Steg 2 · Tillstånd och händelser

## Mål

Gör listan interaktiv: filtrera fram olästa böcker, växla läst och lägg till nya böcker med ett formulär.

## Det här har du sett i klippet

- `useState`
- Event handlers: `onClick`, `onChange`, `onSubmit`
- Lyfta state till föräldern och skicka handlers som props
- Controlled inputs (`value` och `onChange`)
- `event.preventDefault()`
- Immutabla uppdateringar: `map` ger en ny array, `[...books, newBook]` lägger till sist

## Appen ska

- Fortfarande klara allt från steg 1.
- Ha böckerna i state i `BookList` (startvärdet är böckerna i `app/src/data/books.js`). Funktionerna som ändrar böckerna skickas ner som props.
- Visa en checkbox ovanför listan med label `Visa bara olästa` och `data-testid="filter-unread"`. När den är ikryssad visas bara de olästa böckerna (Aniara, Utvandrarna, Kallocain).
- Ha en knapp på varje kort med `data-testid="toggle-read"`. Texten är `Markera som läst` när boken är oläst och `Markera som oläst` när den är läst. Ett klick växlar bokens `read`, så att badgen `Läst` dyker upp eller försvinner.
- Visa komponenten `NewBook` (`app/src/components/NewBook.jsx`) under listan: ett `<form>` med `data-testid="new-book-form"` som innehåller
  - ett input med label `Titel` och `data-testid="input-title"`
  - ett input med label `Författare` och `data-testid="input-author"`
  - ett input med label `År` och `data-testid="input-year"`
  - en knapp `Lägg till` med `data-testid="submit-book"`
- Validera vid inlämning: titel och författare krävs (efter `trim()`). År är valfritt, men om det är ifyllt måste det vara exakt fyra siffror. Är något fel visas `Fyll i titel och författare` i ett element med `role="alert"` och `data-testid="form-error"`, och ingen bok läggs till.
- Låta `NewBook` ta emot en prop `onAdd` och anropa den med `{ title, author, year }`: trimmade strängar, och `year` som ett tal (till exempel `1945`) eller `null` om fältet är tomt.
- Lägga till den nya boken sist i listan, med `id` = största befintliga id + 1 och `read: false`.
- Tömma alla tre fälten efter en lyckad inlämning (och ta bort felmeddelandet om det syntes).

Testerna i `e2e/steg-2.spec.js` kontrollerar:

- klick på `Visa bara olästa` ger 3 kort: Aniara, Utvandrarna, Kallocain
- klick på `toggle-read` på Aniara ger badgen `Läst` och knapptexten `Markera som oläst`
- formuläret har fälten med labels `Titel`, `Författare` och `År` och knappen `Lägg till`
- ett tomt formulär ger `form-error` med texten `Fyll i titel och författare`
- året `45` ger samma `form-error`
- `Pippi Långstrump`, `Astrid Lindgren`, `1945` ger 7 kort, sista kortets titel är `Pippi Långstrump` och fälten är tomma efteråt

## Så här kan du börja

Kör `npm run dev` och ha appen öppen på http://localhost:5173. Gör om `BookList` så att böckerna ligger i state, och skapa sedan `app/src/components/NewBook.jsx` med ett state per fält.

```jsx
// app/src/components/BookList.jsx
import { useState } from 'react';
import { books as initialBooks } from '../data/books.js';

const BookList = () => {
  const [books, setBooks] = useState(initialBooks);
  // const toggleRead = (id) => ...
```

## Du är klar när

`npm run check:2` är grönt (6 tester). Kör också `npm run check:1-2`, som kör steg 1 och 2 tillsammans, så att steg 1 fortfarande är grönt.

## Om du fastnar

- Sidan laddas om när du klickar på `Lägg till`: formuläret skickas på det vanliga sättet. Anropa `event.preventDefault()` först i din `onSubmit`-handler.
- Listan uppdateras inte efter ett klick: du ändrar troligen den befintliga arrayen eller boken (`push`, `book.read = ...`). React ritar bara om när du ger state ett nytt värde, så skapa en ny array med `map` eller `[...books, newBook]` och nya objekt med `{ ...book, read: !book.read }`.
