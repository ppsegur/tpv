import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './router';

// Router utilizando Pinia para el manejo de estado
// y Vue Router para la navegación entre componentes
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
