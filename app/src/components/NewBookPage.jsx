
import { useNavigate } from 'react-router';
import NewBook from './NewBook.jsx';
import { useBooks } from '../hooks/useBooks.js';

const NewBookPage = () => {
  const navigate = useNavigate();
  const { addBook } = useBooks();

  const handleAdd = async (book) => {
    await addBook(book);
    navigate('/');
  };

  return <NewBook onAdd={handleAdd} />;
};

export default NewBookPage;
