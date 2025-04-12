<template>
    <div class="forms-container">
      <!-- Formulario para añadir producto -->
      <form class="form" @submit.prevent="addNewProduct">
        <div class="form-title"><span>Añadir</span></div>
        <div class="title-2"><span>PRODUCTO</span></div>
  
        <div class="input-container">
          <input 
            v-model="newProduct.name" 
            type="text" 
            placeholder="Nombre del producto" 
            class="input-mail"
            required
          >
        </div>
  
        <div class="input-container">
          <input 
            v-model.number="newProduct.price" 
            type="number" 
            placeholder="Precio" 
            class="input-pwd"
            min="0"
            step="0.01"
            required
          >
        </div>
  
        <div class="input-container">
          <select v-model="newProduct.categoryId" class="input-mail">
            <option :value="null">Sin categoría</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
  
        <button type="submit" class="submit">
          <span class="sign-text">Añadir Producto</span>
        </button>
  
        <section class="bg-stars">
          <span class="star"></span>
          <span class="star"></span>
          <span class="star"></span>
          <span class="star"></span>
        </section>
      </form>
  
      <!-- Formulario para añadir categoría -->
      <form class="form" @submit.prevent="addNewCategory">
        <div class="form-title"><span>Añadir</span></div>
        <div class="title-2"><span>CATEGORÍA</span></div>
  
        <div class="input-container">
          <input 
            v-model="newCategory.name" 
            type="text" 
            placeholder="Nombre de la categoría" 
            class="input-mail"
            required
          >
        </div>
  
        <button type="submit" class="submit">
          <span class="sign-text">Añadir Categoría</span>
        </button>
  
        <section class="bg-stars">
          <span class="star"></span>
          <span class="star"></span>
          <span class="star"></span>
          <span class="star"></span>
        </section>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useProductStore } from '../stores/productStore.js';
  
  const productStore = useProductStore();
  
  // Usar computed para obtener categorías del store de productos
  const categories = computed(() => productStore.categories || []);
  
  const newProduct = ref({
    name: '',
    price: 0,
    categoryId: null
  });
  
  const newCategory = ref({
    name: ''
  });
  
  const addNewProduct = async () => {
    try {
      if (!newProduct.value.name.trim() || newProduct.value.price <= 0) {
        throw new Error('Nombre y precio son requeridos');
      }
      
      await productStore.addProduct({
        name: newProduct.value.name.trim(),
        price: parseFloat(newProduct.value.price),
        categoryId: newProduct.value.categoryId
      });
      
      newProduct.value = { name: '', price: 0, categoryId: null };
      alert('Producto añadido con éxito');
    } catch (error) {
      console.error('Error al añadir producto:', error);
      alert(error.message || 'Error al añadir producto');
    }
  };
  
  const addNewCategory = async () => {
    try {
      if (!newCategory.value.name.trim()) {
        throw new Error('Nombre de categoría es requerido');
      }
      
      productStore.addCategory({
        name: newCategory.value.name
      });
      
    newCategory.value = '';
    alert('Categoría añadida con éxito');
    } catch (error) {
      console.error('Error al añadir categoría:', error);
      alert(error.message || 'Error al añadir categoría');
    }
  };
  </script>
  
  <style scoped>
  .forms-container {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .form {
    position: relative;
    display: block;
    padding: 2.2rem;
    max-width: 350px;
    background: linear-gradient(14deg, rgba(2,0,36, 0.8) 0%, rgba(24, 24, 65, 0.7) 66%, 
              #144c63 100%), radial-gradient(circle, rgba(2,0,36, 0.5) 0%, 
              rgba(32, 15, 53, 0.2) 65%, rgba(14, 29, 28, 0.9) 100%);
    border: 2px solid #fff;
    -webkit-box-shadow: rgba(0,212,255) 0px 0px 50px -15px;
    box-shadow: rgba(0,212,255) 0px 0px 50px -15px;
    overflow: hidden;
    z-index: 1;
    margin-bottom: 2rem;
  }
  
  .input-container {
    position: relative;
    margin-bottom: 1rem;
  }
  
  .input-container input, 
  .input-container select, 
  .form button {
    outline: none;
    border: 2px solid #ffffff;
    margin: 8px 0;
    font-family: monospace;
    width: 100%;
    box-sizing: border-box;
  }
  
  .input-container input, 
  .input-container select {
    background-color: #fff;
    padding: 8px 12px;
    font-size: 0.875rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  .submit {
    display: block;
    padding: 10px;
    background-color: #c0c0c0;
    color: #ffffff;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }
  
  .submit:hover {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
  }
  
  .form-title {
    font-size: 1.25rem;
    font-family: monospace;
    font-weight: 600;
    text-align: center;
    color: #fff;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
    margin-bottom: 0.5rem;
  }
  
  .title-2 {
    font-size: 2.1rem;
    font-weight: 800;
    text-align: center;
    -webkit-text-stroke: #fff 0.1rem;
    letter-spacing: 0.2rem;
    color: transparent;
    text-shadow: 0px 0px 16px #CECECE;
    
  }
.bg-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  background-size: cover;
  animation: animateBg 50s linear infinite;
}

@keyframes animateBg {
  0%,100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.star {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255,255,255,0.1);
  animation: animate 3s linear infinite;
}

@keyframes animate {
  0% {
    transform: rotate(315deg) translateX(0);
    opacity: 1;
  }
  100% {
    transform: rotate(315deg) translateX(-1000px);
    opacity: 0;
  }
}
</style>