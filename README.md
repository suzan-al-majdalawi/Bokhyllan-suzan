# React från grunden

En minikurs där du bygger en liten React-app, **Bokhyllan**, i fem steg. Bokhyllan är en lista med böcker: du kan filtrera fram olästa, markera en bok som läst, lägga till en bok, öppna en bok på en egen sida och markera favoriter som räknas i sidhuvudet.

Varje steg har ett klipp, en beskrivning i `steg/` och ett kvitto: en testsvit med Playwright. När testerna för steget är gröna är steget klart.

| Steg | Innehåll | Beskrivning | Kvitto |
|---|---|---|---|
| 1 | Första komponenten: JSX, props, listor | `steg/steg-1.md` | `npm run check:1` |
| 2 | Tillstånd och händelser: `useState`, formulär | `steg/steg-2.md` | `npm run check:2` |
| 3 | Effekter och egna hooks: `useEffect`, `fetch`, `useBooks` | `steg/steg-3.md` | `npm run check:3` |
| 4 | Delat tillstånd och routing: Context, `useReducer`, React Router | `steg/steg-4.md` | `npm run check:4` |
| 5 | Tester: Vitest och React Testing Library | `steg/steg-5.md` | `npm run check:5` |

## Det här finns i repot

```
app/             din React-app (Vite). Här bygger du.
api/             ett litet mock-API (Express) på port 4000. Färdigt.
vue-reference/   samma app byggd i Vue, som referens. Färdig.
e2e/             Playwright-testerna, en fil per steg
steg/            beskrivningen av varje steg
scripts/         kvittot för steg 5
```

## Kom igång

Du behöver git och Node 22 (Node 20.19 eller senare fungerar också). Kontrollera din version:

```bash
node -v
```

Står det något lägre än `v20.19`, uppgradera först. Med [nvm](https://github.com/nvm-sh/nvm) räcker `nvm install 22` och `nvm use 22`; i repot finns en `.nvmrc`, så `nvm use` i rotmappen väljer rätt version. Med äldre Node fungerar steg 1–4 med varningar, men komponenttesterna i steg 5 startar inte.

1. Skapa ditt eget repo från mallen (knappen "Use this template" på GitHub) och klona det, eller klona mallen direkt:

   ```bash
   git clone <adressen till repot> react-fran-grunden
   cd react-fran-grunden
   ```

2. Installera allt. Kommandot installerar även i `api/`, `app/` och `vue-reference/`:

   ```bash
   npm install
   ```

3. Installera webbläsaren som Playwright kör testerna i:

   ```bash
   npx playwright install chromium
   ```

4. Starta API:t i en terminal:

   ```bash
   npm run api
   ```

   Du ser `API på http://localhost:4000`.

5. Starta appen i en annan terminal:

   ```bash
   npm run dev
   ```

6. Öppna http://localhost:5173. Från början visar appen bara sidhuvudet `Bokhyllan`.

## Så jobbar du

1. Titta på klippet och läs `steg/steg-N.md`. Där står exakt vad appen ska göra, med texter och `data-testid`.
2. Bygg i `app/src/`. Alla sökvägar i steg-filerna börjar med `app/src/`. Kör kommandona nedan i rotmappen.
3. Kör kvittot för steget, till exempel `npm run check:1`.

Testerna ligger i `e2e/steg-N.spec.js`. Läs dem gärna: de visar precis vad som kontrolleras. Playwright startar API:t och appen själv om de inte redan är igång, och testerna nollställer API:t till de sex böckerna före varje test.

Stegen bygger på varandra. Appen i steg N ska också klara testerna för alla tidigare steg, så kör `npm run check:1-N` när du är klar med ett steg. Hela sviten (`npm run test:e2e`) är röd tills du har gjort steg 4, eftersom den också kör testerna för stegen du inte har kommit till.

| Kommando | Vad det gör |
|---|---|
| `npm run check:1` till `npm run check:4` | kör testerna för ett steg |
| `npm run check:1-2`, `check:1-3`, `check:1-4` | kör steg 1 till och med steg N, alltså regressionen |
| `npm run check:5` | kör komponenttesterna i `app/` (minst tre ska vara gröna) och sedan hela E2E-sviten |
| `npm run test:e2e` | kör alla E2E-tester, steg 1 till 5 |
| `npm test` | kör komponenttesterna i `app/` med Vitest och kör om dem när du sparar (steg 5) |
| `npx playwright test e2e/steg-2.spec.js --headed` | kör ett steg med synlig webbläsare |
| `npx playwright test --ui` | Playwrights grafiska läge, bra för att se vad som händer steg för steg |

## Vue-referensen

I `vue-reference/` finns hela Bokhyllan byggd i Vue 3 (`<script setup>`, Pinia och Vue Router), med samma texter och `data-testid` som din React-app ska ha. Den är en referens, inte en startpunkt: när du undrar hur något du kan i Vue ser ut i React kan du jämföra med motsvarande fil där.

| React | Vue |
|---|---|
| `BookCard.jsx`, `BookList.jsx`, `NewBook.jsx` | `src/components/BookCard.vue`, `BookList.vue`, `NewBook.vue` |
| `hooks/useBooks.js` | `src/composables/useBooks.js` |
| `context/FavoritesContext.jsx` | `src/stores/favorites.js` (Pinia) |
| routes i `App.jsx` | `src/router.js` och `src/views/` |

Starta den med API:t igång:

```bash
npm run dev:vue
```

och öppna http://localhost:5174. Samma tester kan köras mot Vue-versionen:

```bash
BASE_URL=http://localhost:5174 npm run test:e2e
```

## Felsökning

**Fel Node-version.** Ser du `npm warn EBADENGINE Unsupported engine` vid `npm install`, eller `Vite requires Node.js version 20.19+` när appen startar, är din Node för gammal. I steg 5 visar det sig som `ERR_REQUIRE_ESM` eller `Failed to start forks worker`. Kontrollera med `node -v` och uppgradera till Node 22 (`nvm install 22` och `nvm use 22`). Starta sedan om `npm run api` och `npm run dev`. Någon ny `npm install` behövs inte.

**Sidan blir tom och konsolen säger `Rendered more hooks than during the previous render`.** En hook (`useState`, `useFavorites` eller liknande) anropas efter en tidig `return`, till exempel efter `if (loading)`. Alla hooks ska stå överst i komponenten. Se steg 3, "Viktigt: alla hooks överst i komponenten".

**Porten är upptagen.** Ser du `Port 5173 is already in use` eller `EADDRINUSE` för port 4000 kör redan en server, kanske i en annan terminal. Stäng den med Ctrl+C. Hittar du den inte, leta upp processen med `lsof -i :5173` (eller `:4000`) och avsluta den med `kill <PID>`.

**API:t är inte igång.** Appen visar `Kunde inte hämta böcker` och terminalen med `npm run dev` skriver `http proxy error` eller `ECONNREFUSED`. Starta API:t med `npm run api` i en egen terminal.

**Playwrights webbläsare saknas.** Testerna avbryts med `Executable doesn't exist` eller `Looks like Playwright was just installed`. Kör `npx playwright install chromium`.

**Testet hittar inte ett element.** Ett test som väntar på `getByTestId('book-card')` och sedan ger upp betyder att elementet inte finns eller inte har rätt `data-testid`. Kontrollera stavningen exakt som i steg-filen, och att texten stämmer tecken för tecken: mittpunkten i `Frans G. Bengtsson · 1941` och ellipsen i `Laddar böcker…` är egna tecken, kopiera dem. Kör testet med `--headed` eller `--ui` för att se vad som händer, eller öppna spåret som Playwright sparar i `test-results/` med `npx playwright show-trace <sökväg till trace.zip>`.

**Ändringar i API:t ligger kvar.** Data i API:t ligger i minnet. Starta om `npm run api` för att komma tillbaka till de sex böckerna. Testerna gör det automatiskt.
