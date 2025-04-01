import { createRouter, createWebHistory } from 'vue-router';
import MesaView from './views/MesasView.vue'; // Corrected import path

const routes = [
  { path: '/', component: MesaView }, // Set MesasView as the default route
  { path: '/mesa/:id', component: MesaView },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
