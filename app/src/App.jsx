
import { Routes, Route } from 'react-router';
import BookList from './components/BookList.jsx';
import BookDetail from './components/BookDetail.jsx';
import NewBookPage from './components/NewBookPage.jsx';
import AppHeader from './components/AppHeader.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { BooksProvider } from './context/BooksContext.jsx';

const App = () => (
  <BooksProvider>
    <FavoritesProvider>
      <header>
        <AppHeader />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/new" element={<NewBookPage />} />
        </Routes>
      </main>
    </FavoritesProvider>
  </BooksProvider>
);

export default App;
