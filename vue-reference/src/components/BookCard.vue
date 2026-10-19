<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  book: { type: Object, required: true },
});

const emit = defineEmits(['toggle']);
</script>

<template>
  <article class="book-card" data-testid="book-card">
    <h2>
      <RouterLink
        :to="`/books/${book.id}`"
        data-testid="book-title"
        >{{ book.title }}</RouterLink
      >
    </h2>
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
      @click="emit('toggle', book.id)"
    >
      {{
        book.read
          ? 'Markera som oläst'
          : 'Markera som läst'
      }}
    </button>
  </article>
</template>
