<template>
    <div class="gestion-productos">
      <h1>Gestión de Productos</h1>
      <div class="contenido">
        <!-- Aside para el formulario -->
        <aside class="formulario">
          <FormManagement />
        </aside>
  
        <!-- Sección principal para la tabla -->
        <main class="tabla">
          <div class="filtros">
            <input type="text" v-model="busqueda" placeholder="Buscar producto..." />
            <select v-model="categoriaSeleccionada">
              <option value="">Todas las categorías</option>
              <option v-for="categoria in categoriasUnicas" :key="categoria.id" :value="categoria.id">
                {{ categoria.name }}
              </option>
            </select>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productosFiltrados" :key="producto.id">
                <td>{{ producto.name }}</td>
                <td>{{ getCategoryName(producto.categoryId) }}</td>
                <td>{{ producto.price.toFixed(2) }}€</td>
                <td>
                  <button @click="editarProducto(producto)">Editar</button>
                  <button @click="eliminarProducto(producto.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
import { useProductStore } from '../../stores/productStore';
import FormManagement from '../FormManagement.vue';
  const productStore = useProductStore();
  const busqueda = ref('');
  const categoriaSeleccionada = ref('');
  const showModal = ref(false); // <-- Añade esto
  const productoEditado = ref({ // <-- Añade esto
    id: null,
    name: '',
    categoryId: null,
    price: 0
  });
  
  // Obtener categorías únicas
  const categoriasUnicas = computed(() => {
    return productStore.categories;
  });
  
  // Filtrar productos
  const productosFiltrados = computed(() => {
    return productStore.products.filter(producto => {
      const coincideBusqueda = producto.name.toLowerCase().includes(busqueda.value.toLowerCase());
      const coincideCategoria = categoriaSeleccionada.value
        ? producto.categoryId === categoriaSeleccionada.value
        : true;
      return coincideBusqueda && coincideCategoria;
    });
  });
  
  // Helper para nombre de categoría
  const getCategoryName = (categoryId) => {
    return productStore.getCategoryName(categoryId);
  };
  
  // Modal functions
  const abrirModalEditar = (producto) => {
    productoEditado.value = { ...producto }; // Copia del producto
    showModal.value = true;
  };
  
  const cerrarModal = () => { // <-- Añade esta función
    showModal.value = false;
  };
  
  const guardarCambios = () => {
    productStore.updateProduct(productoEditado.value);
    cerrarModal();
  };
  
  const editarProducto = (producto) => {
    abrirModalEditar(producto);
  };
  
  const eliminarProducto = (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      productStore.deleteProduct(id);
    }
  };
  </script>
  


  <style scoped>
.gestion-productos {
  padding: 20px;
}

.contenido {
  display: flex;
  gap: 20px;
}
.formulario {
  flex: 0 0 300px; /* Ancho fijo para el formulario */
  background-color: #f8f9fa; /* Fondo claro */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabla {
  flex: 1; /* Ocupa el resto del espacio */
}

.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}


.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
    background-color: #0056b3; /* Azul oscuro */
  color: white; /* Texto blanco */
  padding: 10px;
  text-align: left;
  font-weight: bold;}
  tbody tr {
  background-color: #e3f2fd; /* Azul claro */
  transition: background-color 0.3s ease;
}

/* Cambiar el color de la fila al pasar el mouse */
tbody tr:hover {
  background-color: #bbdefb; /* Azul un poco más oscuro */
}

/* Estilo para las celdas */
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}
button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-child {
  background-color: #007bff;
  color: white;
}

button:last-child {
  background-color: #dc3545;
  color: white;
}

/* Estilos para el modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-content h2 {
  margin-top: 0;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.modal-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #007bff;
  color: white;
}

.modal-buttons button:last-child {
  background-color: #dc3545;
  color: white;
}
</style>