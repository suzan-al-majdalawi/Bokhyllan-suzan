
import { createContext, useContext, useReducer } from 'react';

const FavoritesContext = createContext(null);

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'toggle':
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];

    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    []
  );

  return (
    <FavoritesContext.Provider value={{ favorites, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      'useFavorites måste användas inom FavoritesProvider'
    );
  }

  return context;
};
