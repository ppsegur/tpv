import { createRouter, createWebHistory } from 'vue-router';
import MesaView from './views/MesasView.vue';
import HistorialView from './views/HistorialView.vue';
import NotFound from './views/NotFound.vue'; // Importa el componente NotFound
import GestionProductos from './components/admin/GestionProductos.vue'; // Importa el componente GestionProductos
const routes = [
  { path: '/', name: 'Home', component: MesaView }, // Ruta principal
  { path: '/mesa/:id', name: 'Mesa', component: MesaView }, // Ruta dinámica para mesas
  { path: '/historial', name: 'Historial', component: HistorialView }, // Ruta para TicketsMesas
  {path: '/gestion', name: 'GestionProductos', component: GestionProductos}, // Ruta para gestionar productos
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }, // Ruta para manejar 404
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;