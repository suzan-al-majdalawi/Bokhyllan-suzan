
import BookList from './components/BookList.jsx';

const App = () => (
  <>
    <header>
      <h1 data-testid="app-title">Bokhyllan</h1>
    </header>

    <main>
      <BookList />
    </main>
  </>
);

export default App;
