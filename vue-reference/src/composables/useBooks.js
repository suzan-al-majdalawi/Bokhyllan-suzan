import { onMounted, ref } from 'vue';

export const useBooks = () => {
  const books = ref([]);
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      const response = await fetch('/api/books');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      books.value = await response.json();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  });

  const addBook = async (newBook) => {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    const created = await response.json();
    books.value = [...books.value, created];
  };

  const toggleRead = async (id) => {
    const book = books.value.find((b) => b.id === id);
    const response = await fetch(`/api/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !book.read }),
    });
    const updated = await response.json();
    books.value = books.value.map((b) =>
      b.id === id ? updated : b
    );
  };

  return { books, loading, error, addBook, toggleRead };
};
