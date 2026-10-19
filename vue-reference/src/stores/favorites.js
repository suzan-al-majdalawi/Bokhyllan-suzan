import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

// Favoriter är delat tillstånd i klienten. De sparas
// inte, så de försvinner vid omladdning.
export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const ids = ref([]);

    const count = computed(() => ids.value.length);

    const isFavorite = (id) => ids.value.includes(id);

    const toggle = (id) => {
      ids.value = isFavorite(id)
        ? ids.value.filter(
            (favoriteId) => favoriteId !== id
          )
        : [...ids.value, id];
    };

    return { ids, count, isFavorite, toggle };
  }
);
