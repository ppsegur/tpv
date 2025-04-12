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
        mesa.ocupada = !mesa.ocupada || mesa.productos.length > 0;
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
      const mesa = this.mesas.find(m => m.id === this.selectedMesaId);
      if (!mesa) {
        alert('Selecciona una mesa antes de añadir productos.');
        return;
      }

      const isPeso = this.productoPorPeso(producto);
      const existingProduct = mesa.productos.find(p => p.id === producto.id);

      if (existingProduct) {
        existingProduct.cantidad += producto.cantidad;
      } else {
        mesa.productos.push({ ...producto, cantidad: producto.cantidad });
      }
    },

    calcularTotal(id) {
      const mesa = this.mesas.find(m => m.id === id);
      if (!mesa) return 0;

      return mesa.productos.reduce((total, p) => {
        const isPeso = this.productoPorPeso(p);
        const precioFinal = isPeso
          ? (p.price * p.cantidad) / 1000
          : p.price * p.cantidad;
        return total + precioFinal;
      }, 0);
    },

    seleccionarMesa(id) {
      this.selectedMesaId = id;
    },

    eliminarProductoDeMesa(mesaId, productoIndex) {
      const mesa = this.mesas.find(m => m.id === mesaId);
      if (!mesa) return;

      const producto = mesa.productos[productoIndex];
      if (producto.cantidad > 1) {
        producto.cantidad -= 1;
      } else {
        mesa.productos.splice(productoIndex, 1);
      }
    },

    limpiarProductosMesa(mesaId) {
      const mesa = this.mesas.find(m => m.id === mesaId);
      if (!mesa) return;

      if (mesa.productos.length > 0) {
        const total = mesa.productos.reduce((sum, p) => {
          const isPeso = this.productoPorPeso(p);
          const precio = isPeso
            ? (p.price * p.cantidad) / 1000
            : p.price * p.cantidad;
          return sum + precio;
        }, 0);

        this.historial.push({
          mesaId,
          fecha: new Date().toISOString(),
          productos: [...mesa.productos],
          total,
        });
      }

      mesa.productos = [];
      mesa.ocupada = false;
    },

    obtenerHistorial() {
      return this.historial;
    },

    obtenerHistorialPorNombreMesa(nombreMesa) {
      return this.historial.filter(ticket => {
        const mesa = this.mesas.find(m => m.id === ticket.mesaId);
        return mesa && mesa.nombre === nombreMesa;
      });
    },

    obtenerHistorialPorFecha(fecha) {
      return this.historial.filter(ticket => ticket.fecha.startsWith(fecha));
    },

    cambiarNombreMesa(id, nuevoNombre) {
      const mesa = this.mesas.find(m => m.id === id);
      if (mesa) {
        mesa.nombre = nuevoNombre;
      }
    },

    aumentarCantidadProducto(idMesa, index) {
      const mesa = this.mesas.find(m => m.id === idMesa);
      if (mesa && mesa.productos[index]) {
        mesa.productos[index].cantidad += 1;
      }
    },

    disminuirCantidadProducto(idMesa, index) {
      const mesa = this.mesas.find(m => m.id === idMesa);
      if (mesa && mesa.productos[index] && mesa.productos[index].cantidad > 1) {
        mesa.productos[index].cantidad -= 1;
      }
    },

    // ✅ Método para detectar si un producto se mide en gramos
    productoPorPeso(producto) {
      const categoriasPorPeso = ['Chacinas', 'Charcutería'];
      return categoriasPorPeso.includes(producto.categoria);
    },
  },
});
