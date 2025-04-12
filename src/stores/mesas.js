import { defineStore } from 'pinia';

export const useMesasStore = defineStore('mesas', {
  state: () => ({
    mesas: [
      { id: 1, ocupada: false, productos: [] },
      { id: 2, ocupada: false, productos: [] },
      { id: 3, ocupada: false, productos: [] },
      { id: 4, ocupada: false, productos: [] },
      { id: 5, ocupada: false, productos: [] },
      { id: 6, ocupada: false, productos: [] },
    ],
    historial: [],
    selectedMesaId: null,
  }),
  actions: {
    ocuparMesa(id) {
      const mesa = this.mesas.find(m => m.id === id);
      if (mesa) {
        mesa.ocupada = !mesa.ocupada || mesa.productos.length > 0; // Consider products
      }
    },
    liberarMesa(id) {
      const mesa = this.mesas.find(m => m.id === id);
      if (mesa) {
        mesa.ocupada = false;
        mesa.productos = [];
      }
    },
    agregarProducto(producto) {
      console.log('Producto recibido en agregarProducto:', producto);
      const mesa = this.mesas.find(m => m.id === this.selectedMesaId);
      if (mesa) {
        const existingProduct = mesa.productos.find(p => p.id === producto.id);
        if (existingProduct) {
          existingProduct.cantidad += producto.cantidad; // Incrementar cantidad por la cantidad recibida
          console.info('Producto actualizado:', existingProduct);
        } else {
          mesa.productos.push({ ...producto, cantidad: producto.cantidad }); // Añadir con la cantidad recibida
          console.info('Producto añadido:', producto);
        }
      } else {
        alert('Selecciona una mesa antes de añadir productos.');
      }
    },
    calcularTotal(id) {
      const mesa = this.mesas.find(m => m.id === id);
      if (mesa) {
        return mesa.productos.reduce((total, p) => total + p.price * p.cantidad, 0);
      }
      return 0;
    },
    seleccionarMesa(id) {
      this.selectedMesaId = id;
    },
    eliminarProductoDeMesa(mesaId, productoIndex) {
      const mesa = this.mesas.find(m => m.id === mesaId);
      if (mesa) {
        const producto = mesa.productos[productoIndex];
        if (producto.cantidad > 1) {
          producto.cantidad -= 1; // Disminuir cantidad
        } else {
          mesa.productos.splice(productoIndex, 1); // Eliminar si cantidad es 0
        }
      }
    },
    limpiarProductosMesa(mesaId) {
      const mesa = this.mesas.find(m => m.id === mesaId);
      if (mesa) {
        if (mesa.productos.length > 0) {
          // Guardar el ticket en el historial
          const total = mesa.productos.reduce((sum, p) => sum + p.price * p.cantidad, 0);
          this.historial.push({
            mesaId,
            fecha: new Date().toISOString(), // Fecha actual
            productos: [...mesa.productos], // Copia de los productos
            total,
          });
        }
        // Limpiar la mesa
        mesa.productos = [];
        mesa.ocupada = false;
      }
    },
    obtenerHistorialPorFecha(fecha) {
      // Filtrar tickets por fecha
      return this.historial.filter(ticket => ticket.fecha.startsWith(fecha));
    },
  },
  cambiarNombreMesa(id, nuevoNombre) {
    const mesa = this.mesas.find(m => m.id === id);
    if (mesa) {
      mesa.nombre = nuevoNombre;
    }
  },
});
