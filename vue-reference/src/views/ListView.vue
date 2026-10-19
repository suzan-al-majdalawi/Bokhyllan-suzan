<script setup>
import BookList from '../components/BookList.vue';
import { useBooks } from '../composables/useBooks.js';

const { books, loading, error, toggleRead } =
  useBooks();
</script>

<template>
  <p v-if="loading" data-testid="loading">
    Laddar böcker…
  </p>
  <p v-else-if="error" data-testid="error">
    Kunde inte hämta böcker
  </p>
  <BookList
    v-else
    :books="books"
    @toggle="toggleRead"
  />
</template>
