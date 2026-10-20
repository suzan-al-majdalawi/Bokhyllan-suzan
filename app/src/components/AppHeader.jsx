
import { Link } from 'react-router';
import { useFavorites } from '../context/FavoritesContext.jsx';

const AppHeader = () => {
  const { favorites } = useFavorites();

  return (
    <>
      <h1 data-testid="app-title">Bokhyllan</h1>

      <nav>
        <Link to="/" data-testid="nav-list">
          Böcker
        </Link>
        <Link to="/new" data-testid="nav-new">
          Lägg till bok
        </Link>
      </nav>

      <p data-testid="favorites-count">
        Favoriter: {favorites.length}
      </p>
    </>
  );
};

export default AppHeader;
