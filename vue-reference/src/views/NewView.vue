<script setup>
import { useRouter } from 'vue-router';
import NewBook from '../components/NewBook.vue';
import { useBooks } from '../composables/useBooks.js';

const router = useRouter();
const { addBook } = useBooks();

const handleAdd = async (book) => {
  await addBook(book);
  router.push('/');
};
</script>

<template>
  <NewBook @add="handleAdd" />
</template>
