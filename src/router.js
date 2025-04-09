import { createRouter, createWebHistory } from 'vue-router';
import MesaView from './views/MesasView.vue'; // Import the MesaView component

const routes = [
  { path: '/', component: MesaView }, // Default route
  { path: '/mesa/:id', component: MesaView }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
