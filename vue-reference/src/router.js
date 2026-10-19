import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import ListView from './views/ListView.vue';
import DetailView from './views/DetailView.vue';
import NewView from './views/NewView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ListView },
    { path: '/books/:id', component: DetailView },
    { path: '/new', component: NewView },
  ],
});
