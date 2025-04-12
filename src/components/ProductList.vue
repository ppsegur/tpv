<template>
  <div class="products-management">
    <div v-if="showConfirmation" class="confirmation-message">
      {{ confirmationMessage }}
    </div>

    <div v-if="showQuantityModal" class="quantity-modal-overlay">
      <div class="quantity-modal">
        <h3>Seleccionar Cantidad</h3>
        <div class="quantity-panel">
          <button
            v-for="n in 9"
            :key="n"
            @click="selectQuantity(n)"
            class="quantity-card"
          >
            {{ n }}
          </button>
        </div>
        <button @click="closeQuantityModal" class="close-modal-btn">Cancelar</button>
      </div>
    </div>

    <div class="product-management">
      <div class="filters">
        <input
          v-model="productSearch"
          placeholder="Buscar producto..."
          class="search-input"
        >
        <div class="category-buttons">
          <button
            :class="{ 'category-button': true, 'active': selectedCategory === '' }"
            @click="selectedCategory = ''"
          >
            Todas
          </button>
          <button
            v-for="category in productStore.categories"
            :key="category.id"
            :class="{ 'category-button': true, 'active': selectedCategory === category.name }"
            @click="selectedCategory = category.name"
            :style="{ '--category-color': getCategoryColor(category.id) }"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <div class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          :style="{ backgroundColor: getCategoryColor(product.categoryId) }"
        >
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="category">{{ productStore.getCategoryName(product.categoryId) }}</p>
            <p class="price">€{{ product.price.toFixed(2) }}</p>
          </div>
          <div class="product-actions">
            <button @click.stop="openQuantityModal(product)" class="action-btn add-btn">
              Añadir a Mesa
            </button>
            <button @click.stop="deleteProduct(product.id)" class="action-btn delete-btn">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMesasStore } from '../stores/mesas.js';
import { useProductStore } from '../stores/productStore.js';
import { ref, computed } from 'vue';

const productStore = useProductStore();
const mesasStore = useMesasStore();

// Estado para categorías
const newCategoryName = ref('');
const selectedCategory = ref(''); // Ahora será un string para la categoría seleccionada

// Estado para productos
const productSearch = ref('');
const newProduct = ref({
  name: '',
  price: 0,
  categoryId: null
});

// Estado para el mensaje de confirmación
const confirmationMessage = ref('');
const showConfirmation = ref(false);

// Estado para el modal de cantidad
const showQuantityModal = ref(false);
const selectedProductToAdd = ref(null);
const quantity = ref(1); // Inicializamos la cantidad en 1

// Función para mostrar el mensaje temporalmente
const displayConfirmation = (message) => {
  confirmationMessage.value = message;
  showConfirmation.value = true;
  setTimeout(() => {
    showConfirmation.value = false;
    confirmationMessage.value = '';
  }, 3000); // Ocultar el mensaje después de 3 segundos
};

const selectQuantity = (amount) => {
  quantity.value = amount;
  addToMesaWithQuantity();
  closeQuantityModal(); // Cerrar el modal automáticamente después de seleccionar la cantidad
};

// Función para abrir el modal de cantidad
const openQuantityModal = (product) => {
  selectedProductToAdd.value = product;
  showQuantityModal.value = true;
  quantity.value = 1; // Resetear la cantidad al abrir el modal
};

// Función para cerrar el modal de cantidad
const closeQuantityModal = () => {
  showQuantityModal.value = false;
  selectedProductToAdd.value = null;
};

// Función para seleccionar la cantidad


const addToMesaWithQuantity = () => {
  if (!mesasStore.selectedMesaId) {
    alert('Por favor, selecciona una mesa primero.');
    return;
  }
  if (selectedProductToAdd.value) {
    const productoParaAgregar = {
      ...selectedProductToAdd.value,
      cantidad: quantity.value
    };
    console.log('Cantidad seleccionada:', quantity.value);
    console.log('Producto a agregar:', productoParaAgregar);
    mesasStore.agregarProducto(productoParaAgregar);
    // ... (el resto de tu código)
  }
};

// Filtrar productos por nombre y categoría
const filteredProducts = computed(() => {
  let result = [...productStore.products];

  // Filtrar por categoría seleccionada
  if (selectedCategory.value) {
    const category = productStore.categories.find(c => c.name === selectedCategory.value);
    if (category) {
      result = result.filter(p => p.categoryId === category.id);
    }
  }

  // Filtrar por texto de búsqueda
  if (productSearch.value) {
    const searchTerm = productSearch.value.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      productStore.getCategoryName(p.categoryId).toLowerCase().includes(searchTerm)
    );
  }

  return result;
});


const deleteProduct = (productId) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    productStore.deleteProduct(productId);
  }
};

// Función original addToMesa eliminada, ahora usamos openQuantityModal y addToMesaWithQuantity

// Función para obtener el color de fondo según la categoría
const getCategoryColor = (categoryId) => {
  const colors = {
    1: '#d1e7dd', // Categoría 1 - Verde suave
    2: '#cfe2ff', // Categoría 2 - Azul suave
    3: '#f8d7da', // Categoría 3 - Rojo suave
    4: '#fff3cd', // Categoría 4 - Amarillo suave
    5: '#d9edf7', // Categoría 5 - Celeste suave
    6: '#e2e3e5', // Categoría 6 - Gris suave
  };
  return colors[categoryId] || '#ffffff'; // Color por defecto: blanco
};
</script>

<style scoped>


.product-management {
  padding: 20px;
}

.filters {
  display: flex;
  flex-direction: column; /* Apila los elementos verticalmente */
  gap: 15px;
  margin-bottom: 20px;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap; /* Permite que los botones pasen a la siguiente línea */
  gap: 8px;
  max-width: 100%;
}

.category-button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.category-button:hover {
  background-color: var(--category-color, #eee); /* Usa el color de la categoría o un gris claro por defecto */
  color: white;
}

.category-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr)); /* Mínimo 250px por columna, se ajusta automáticamente */
  gap: 20px;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin-top: 0;
  margin-bottom: 5px;
}

.product-info .category {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.product-info .price {
  font-weight: bold;
  color: #333;
}

.product-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-top: 1px solid #eee;
}

.action-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.add-btn {
  background-color: #28a745;
  color: white;
}

.add-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* Estilos para el modal de cantidad */
.quantity-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1010;
}

.quantity-modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
}

.quantity-modal h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.quantity-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.quantity-card {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.quantity-card:hover {
  background-color: #e9ecef;
}

.close-modal-btn {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.close-modal-btn:hover {
  background-color: #5a6268;
}
</style>