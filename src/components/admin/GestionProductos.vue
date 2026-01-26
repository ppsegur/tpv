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
    <div class="modal" v-if="showModal" @click.self="cerrarModal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Editar Producto</h2>
      <button class="close-icon" @click="cerrarModal" aria-label="Cerrar">×</button>
    </div>
    
    <div class="modal-body">
      <div class="form-group">
        <label for="edit-name">Nombre:</label>
        <input 
          id="edit-name"
          type="text" 
          v-model="productoEditado.name" 
          placeholder="Nombre del producto"
        />
      </div>
      
      <div class="form-group">
        <label for="edit-category">Categoría:</label>
        <select id="edit-category" v-model="productoEditado.categoryId">
          <option v-for="categoria in categoriasUnicas" :key="categoria.id" :value="categoria.id">
            {{ categoria.name }}
          </option>
        </select>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="edit-price">Precio:</label>
          <input 
            id="edit-price"
            type="number" 
            v-model="productoEditado.price" 
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        
        <div class="form-group">
          <label for="edit-stock-min">Mínimo en Stock:</label>
          <input 
            id="edit-stock-min"
            type="number" 
            v-model="productoEditado.minimoStock" 
            placeholder="0"
            min="0"
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="edit-stock">Cantidad en Stock:</label>
        <input 
          id="edit-stock"
          type="number" 
          v-model="productoEditado.cantidadStock" 
          placeholder="0"
          min="0"
        />
      </div>
    </div>
    
    <div class="modal-footer">
      <button class="btn-cancel" @click="cerrarModal">Cancelar</button>
      <button class="btn-save" @click="guardarCambios">Guardar Cambios</button>
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
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

button:first-child {
  background-color: #0d6efd;
  color: white;
  margin-right: 6px;
}

button:first-child:hover {
  background-color: #0b5ed7;
  box-shadow: 0 2px 6px rgba(13, 110, 253, 0.3);
}

button:last-child {
  background-color: #dc3545;
  color: white;
}

button:last-child:hover {
  background-color: #bb2d3b;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

/* Estilos para el modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: slideIn 0.3s ease;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 2px solid #e9ecef;
  background-color: #f8f9fa;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
}

.close-icon {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6c757d;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 0;
  line-height: 1;
}

.close-icon:hover {
  background-color: #e9ecef;
  color: #dc3545;
}

.modal-body {
  padding: 28px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-size: 0.95rem;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ced4da;
  border-radius: 10px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23495057' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.modal-footer {
  padding: 20px 28px;
  border-top: 2px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f8f9fa;
}

.btn-cancel,
.btn-save {
  padding: 12px 28px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5c636a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-save {
  background-color: #0d6efd;
  color: white;
}

.btn-save:hover {
  background-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.btn-cancel:active,
.btn-save:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    max-width: 100%;
    border-radius: 0;
    max-height: 100vh;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}

</style>