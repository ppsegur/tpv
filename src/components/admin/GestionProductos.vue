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
                <th>Cantidad</th>
                <th>Minimo en stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productosFiltrados" :key="producto.id">
                <td>{{ producto.name }}</td>
                <td>{{ getCategoryName(producto.categoryId) }}</td>
                <td>{{ producto.price.toFixed(2) }}€</td>
                <td>{{ producto.cantidadStock }}</td>
                <td>{{ producto.minimoStock }}</td>

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
    <div class="modal" v-if="showModal">
  <div class="modal-content">
    <h2>Editar Producto</h2>
    <label>
      Nombre:
      <input type="text" v-model="productoEditado.name" />
    </label>
    <label>
      Categoría:
      <select v-model="productoEditado.categoryId">
        <option v-for="categoria in categoriasUnicas" :key="categoria.id" :value="categoria.id">
          {{ categoria.name }}
        </option>
      </select>
    </label>
    <label>
      Precio:
      <input type="number" v-model="productoEditado.price" />
    </label>
    <label>
      Mínimo en Stock:
      <input type="number" v-model="productoEditado.minimoStock" />
    </label>
    <label>
      Cantidad en Stock:
      <input type="number" v-model="productoEditado.cantidadStock" />
    </label>
    <div class="modal-buttons">
      <button @click="guardarCambios">Guardar</button>
      <button @click="cerrarModal">Cancelar</button>
    </div>
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
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro con transparencia */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background-color: #fff;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
  color: #333;
}

.modal-content label {
  display: block;
  margin-bottom: 10px;
  color: #555;
  font-size: 0.95rem;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 8px 12px;
  margin-top: 4px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-buttons button {
  padding: 10px 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.modal-buttons button:first-child {
  background-color: #007bff;
  color: white;
}

.modal-buttons button:first-child:hover {
  background-color: #0056b3;
}

.modal-buttons button:last-child {
  background-color: #dc3545;
  color: white;
}

.modal-buttons button:last-child:hover {
  background-color: #b02a37;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>