<script setup>
import { computed, ref } from 'vue';
import BookCard from './BookCard.vue';

const props = defineProps({
  books: { type: Array, required: true },
});

const emit = defineEmits(['toggle']);

const showUnread = ref(false);

const visibleBooks = computed(() =>
  showUnread.value
    ? props.books.filter((book) => !book.read)
    : props.books
);
</script>

<template>
  <label>
    <input
      type="checkbox"
      v-model="showUnread"
      data-testid="filter-unread"
    />
    Visa bara olästa
  </label>
  <section class="book-list">
    <BookCard
      v-for="book in visibleBooks"
      :key="book.id"
      :book="book"
      @toggle="emit('toggle', $event)"
    />
  </section>
</template>
