<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useFavoritesStore } from './stores/favorites.js';

const favorites = useFavoritesStore();
</script>

<template>
  <header>
    <h1 data-testid="app-title">Bokhyllan</h1>
    <nav>
      <RouterLink to="/" data-testid="nav-list"
        >Böcker</RouterLink
      >
      <RouterLink to="/new" data-testid="nav-new"
        >Lägg till bok</RouterLink
      >
    </nav>
    <p data-testid="favorites-count">
      Favoriter: {{ favorites.count }}
    </p>
  </header>
  <main>
    <RouterView />
  </main>
</template>
