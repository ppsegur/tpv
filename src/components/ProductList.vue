<template>
  <div class="products-management">
    <!-- Columna izquierda -->
    

    <!-- Columna derecha -->
    <div class="product-management">
      <!-- Filtros -->
      <div class="filters">
        <input 
          v-model="productSearch" 
          placeholder="Buscar producto..."
          class="search-input"
        >
        <select v-model="selectedCategory" class="category-select">
          <option value="">Todas las categorías</option>
          <option 
            v-for="category in productStore.categories" 
            :key="category.id" 
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Lista de productos -->
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
            <button @click.stop="addToMesa(product)" class="action-btn add-btn">
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
const selectedCategory = ref('');

// Estado para productos
const productSearch = ref('');
const newProduct = ref({
  name: '',
  price: 0,
  categoryId: null
});

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

// Métodos para categorías
const addNewCategory = () => {
  if (newCategoryName.value.trim()) {
    productStore.addCategory(newCategoryName.value.trim());
    newCategoryName.value = '';
  }
};

const deleteCategory = (categoryId) => {
  try {
    productStore.deleteCategory(categoryId);
    if (selectedCategory.value === productStore.getCategoryName(categoryId)) {
      selectedCategory.value = '';
    }
  } catch (error) {
    alert(error.message);
  }
};

const selectCategory = (categoryName) => {
  selectedCategory.value = selectedCategory.value === categoryName ? '' : categoryName;
};

// Métodos para productos
const addNewProduct = () => {
  if (newProduct.value.name.trim() && newProduct.value.price > 0) {
    productStore.addProduct({
      name: newProduct.value.name.trim(),
      price: parseFloat(newProduct.value.price),
      categoryId: newProduct.value.categoryId
    });
    // Reset form
    newProduct.value = { name: '', price: 0, categoryId: null };
  }
};

const deleteProduct = (productId) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    productStore.deleteProduct(productId);
  }
};

const addToMesa = (product) => {
  if (!mesasStore.selectedMesaId) {
    alert('Por favor, selecciona una mesa primero.');
    return;
  }
  mesasStore.agregarProducto({ 
    ...product, 
    cantidad: 1 
  });
};

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
.products-management {
  display: grid;
  grid-template-columns: 300px 1fr; /* Dos columnas: aside y contenido principal */
  gap: 20px;
  padding: 20px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  height: fit-content;
}



.category-form {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.category-form input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.category-form button {
  padding: 8px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-item:hover {
  background: #f1f1f1;
}

.category-item.active {
  background-color: #e7f3ff;
  border-color: #86b7fe;
}

.delete-category {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}

.product-management {
  background: white;
  padding: 15px;
  border-radius: 8px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input, .category-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.category-select {
  max-width: 200px;
}

.product-form h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.product-input {
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-product-btn {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 3 products per row */
  gap: 15px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.2s;
  transition: background-color 0.3s ease; /* Transición suave para el color */
}

.product-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-info h3 {
  margin: 0 0 5px 0;
}

.product-info .category {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0 0 5px 0;
}

.product-info .price {
  font-weight: bold;
  margin: 0 0 10px 0;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.add-btn {
  background-color: #28a745;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

@media (max-width: 768px) {
  .products-management {
    grid-template-columns: 1fr; /* Una sola columna en pantallas pequeñas */
  }
}
</style>