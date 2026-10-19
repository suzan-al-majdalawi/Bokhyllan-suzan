<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add']);

const title = ref('');
const author = ref('');
const year = ref('');
const showError = ref(false);

const handleSubmit = () => {
  const trimmedTitle = title.value.trim();
  const trimmedAuthor = author.value.trim();
  const trimmedYear = year.value.trim();
  const yearIsValid =
    trimmedYear === '' || /^\d{4}$/.test(trimmedYear);

  if (!trimmedTitle || !trimmedAuthor || !yearIsValid) {
    showError.value = true;
    return;
  }

  emit('add', {
    title: trimmedTitle,
    author: trimmedAuthor,
    year:
      trimmedYear === '' ? null : Number(trimmedYear),
  });
  title.value = '';
  author.value = '';
  year.value = '';
  showError.value = false;
};
</script>

<template>
  <form
    data-testid="new-book-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <label>
      Titel
      <input
        v-model="title"
        data-testid="input-title"
      />
    </label>
    <label>
      Författare
      <input
        v-model="author"
        data-testid="input-author"
      />
    </label>
    <label>
      År
      <input
        v-model="year"
        inputmode="numeric"
        data-testid="input-year"
      />
    </label>
    <p
      v-if="showError"
      role="alert"
      data-testid="form-error"
    >
      Fyll i titel och författare
    </p>
    <button type="submit" data-testid="submit-book">
      Lägg till
    </button>
  </form>
</template>
