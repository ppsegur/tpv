import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductStore = defineStore('productStore', () => {
  // Estado inicial con categorías y productos
  const categories = ref([
    { id: 1, name: 'Bebidas' },
    { id: 2, name: 'Cervezas' },
    { id: 3, name: 'Pan' },
    { id: 4, name: 'chacinas' },
    { id: 5, name: 'Conservas' },
    { id: 6, name: 'Tapas' },
    { id: 7, name: 'Medias' },
    { id: 8, name: 'San blas' },
    { id: 9, name: 'Productos seleccion' },
    { id: 10, name: 'Capote' },
    { id: 12, name: 'Vinos' },
    {id: 11, name: 'Otros' },

  ]);

  const products = ref([
    // Categoria bebidas
    { id: 1, name: 'Coca-Cola', price: 1.2, categoryId: 1 },
    { id: 2, name: 'Agua Mineral botella grande', price: 1.50, categoryId: 1 },
    { id: 3, name: 'Agua Mineral botella pequeña', price: 1.00, categoryId: 1 },
    { id: 4 , name: 'Fanta', price: 1.20, categoryId: 1 },
    { id: 5, name: 'Aquarius', price: 1.2, categoryId: 1 },
    { id: 9, name: 'Zumo de piña', price: 1.1, categoryId: 1 },

    // Categoria cervezas 
    { id: 6, name: 'Botellin', price: 1.2, categoryId: 2 },
    { id: 7, name: 'Litrona', price: 2.4, categoryId: 2 },
    { id: 8, name: 'Tercio', price: 2.2, categoryId: 2 },

    // Categoria pan
    { id: 10, name: 'Pan de barra', price: 0.55, categoryId: 3 },
    { id: 11, name: 'Pan de molde', price: 1.60, categoryId: 3 },
    { id: 12, name: 'Bollo', price: 0.50, categoryId: 3 },
    { id: 13, name: 'Bollito', price: 0.35, categoryId: 3 },
    { id: 14, name: 'Viena', price: 0.5, categoryId: 3 },
    { id: 15, name: 'Pan de kilo', price: 2, categoryId: 3 },
    { id: 16, name: 'Chulo', price: 0.60, categoryId: 3 },
    { id: 17, name: 'Chulito', price: 0.40, categoryId: 3 },
    { id: 18, name: 'pack Integral', price: 2, categoryId: 3 },
    { id: 19, name: 'Andaluza', price: 0.45, categoryId: 3 },
    { id: 20, name: 'Picado', price: 0.5, categoryId: 3 },
    { id: 21, name: 'Cahapata', price: 0.45, categoryId: 3 },
    { id: 22, name: 'Mollete', price: 0.5, categoryId: 3 },
    { id: 23, name: 'Molletito', price: 0.35, categoryId: 3 },
    { id: 24, name: 'Pepito', price: 0.35, categoryId: 3 },
    { id: 25, name: 'Bollo integral', price: 0.60, categoryId: 3 },
    { id: 26, name: 'Bollito integral', price: 0.40, categoryId: 3 },
   
    // Categoria chacinas
  
    { id: 27, name: 'Jamon 50 gramos ', price:6, categoryId: 4 },
    { id: 28, name: 'Jamon 100 gramos ', price:11 , categoryId: 4 },
    { id: 29, name: 'chicharrón 100 gramos ', price: 3.50, categoryId: 4 },
    { id: 30, name: 'chicharrón 50 gramos ', price: 2.00, categoryId: 4 },


    // Categoria conservas

    { id: 31, name: 'Melva consemur', price: 4, categoryId: 5 },
    { id: 32, name: 'Sardinas', price: 3, categoryId: 5 },
    { id: 33, name: 'Atun', price: 2.50, categoryId: 5 },
    { id: 34, name: 'Boquerones', price: 4.50, categoryId: 5 },
    { id: 35, name: 'Berberechos', price: 3.50, categoryId: 5 },
    { id: 36, name: 'Mejillones', price: 3.50, categoryId: 5 },
  

    // Categoria tapas
    { id: 37, name: 'salchichon', price: 3.5, categoryId: 6 },
    { id: 38, name: 'Chicharron', price: 3.50, categoryId: 6 },
    { id: 39, name: 'jamon', price: 6, categoryId: 6 },
    { id: 40, name: 'queso normal ', price: 4, categoryId: 6 },
    { id: 41, name: 'Queso especial', price: 5.5, categoryId: 6 },
    { id: 42, name: 'Pulguita', price: 1.50, categoryId: 6 },

    // Categoria medias
    { id: 43, name: 'Medias de jamon', price: 8, categoryId: 7 },
    { id: 44, name: 'Medias de chicharron', price: 5, categoryId: 7 },
    { id: 45, name: 'Medias de salchichon', price: 5.5, categoryId: 7 },
    { id: 46, name: 'Medias de queso normal', price: 5, categoryId: 7 },
    { id: 47, name: 'Medias de queso especial', price: 7, categoryId: 7 },

    // Categoria san blas
    { id: 48, name: 'Caja pequeña ', price: 7, categoryId: 8 },
    { id: 49, name: 'Caja mediana ', price: 9.50, categoryId: 8 },
    { id: 50, name: 'Cortadillo', price: 1, categoryId: 8 },
    { id: 51, name: 'Pastel pequeño', price: 2.2, categoryId: 8 },
    { id: 52, name: 'Pastel', price: 2.7, categoryId: 8 },
    { id: 53, name: 'torrija p', price: 1.2, categoryId: 8 },
    { id: 54, name: 'Torrija grande', price: 2.5, categoryId: 8 },
    
    // Categoria productos seleccion
    



 
  ]);

  // Acciones para categorías
  const addCategory = (categoryName) => {
    const newCategory = {
      id: Date.now(),
      name: categoryName
    };
    categories.value.push(newCategory);
    return newCategory;
  };

  const deleteCategory = (categoryId) => {
    // No permitir eliminar si hay productos asociados
    const productsInCategory = products.value.filter(p => p.categoryId === categoryId);
    if (productsInCategory.length > 0) {
      throw new Error('No se puede eliminar una categoría con productos asociados');
    }
    categories.value = categories.value.filter(c => c.id !== categoryId);
  };

  // Acciones para productos
  const getProductsByCategory = (categoryName) => {
    if (!categoryName) return products.value;
    const category = categories.value.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    if (!category) return [];
    return products.value.filter(p => p.categoryId === category.id);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.value.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  const addProduct = (product) => {
    const newProduct = { 
      ...product, 
      id: Date.now(),
      categoryId: product.categoryId || null
    };
    products.value.push(newProduct);
    return newProduct;
  };

  const updateProduct = (updatedProduct) => {
    const index = products.value.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
  };

  const deleteProduct = (productId) => {
    products.value = products.value.filter(p => p.id !== productId);
  };

  return { 
    categories,
    products, 
    addCategory,
    deleteCategory,
    getProductsByCategory,
    getCategoryName,
    addProduct, 
    updateProduct, 
    deleteProduct 
  };
});