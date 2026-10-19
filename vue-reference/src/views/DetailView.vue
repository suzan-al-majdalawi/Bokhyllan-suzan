<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useBooks } from '../composables/useBooks.js';
import { useFavoritesStore } from '../stores/favorites.js';

const route = useRoute();
const { books, loading, error, toggleRead } =
  useBooks();
const favorites = useFavoritesStore();

const book = computed(() =>
  books.value.find(
    (b) => b.id === Number(route.params.id)
  )
);
</script>

<template>
  <p v-if="loading" data-testid="loading">
    Laddar böcker…
  </p>
  <p v-else-if="error" data-testid="error">
    Kunde inte hämta böcker
  </p>
  <p v-else-if="!book" data-testid="not-found">
    Boken finns inte
  </p>
  <section
    v-else
    class="book-detail"
    data-testid="book-detail"
  >
    <h2 data-testid="detail-title">{{ book.title }}</h2>
    <p data-testid="book-meta">
      {{ book.author }} · {{ book.year }}
    </p>
    <span
      v-if="book.read"
      class="badge"
      data-testid="badge-read"
      >Läst</span
    >
    <button
      type="button"
      data-testid="toggle-read"
      @click="toggleRead(book.id)"
    >
      {{
        book.read
          ? 'Markera som oläst'
          : 'Markera som läst'
      }}
    </button>
    <button
      type="button"
      data-testid="toggle-favorite"
      @click="favorites.toggle(book.id)"
    >
      {{
        favorites.isFavorite(book.id)
          ? 'Ta bort favorit'
          : 'Lägg till som favorit'
      }}
    </button>
    <RouterLink to="/" data-testid="back-link"
      >Tillbaka</RouterLink
    >
  </section>
</template>
