import { defineStore } from 'pinia';

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [], // Array de clientes guardados
  }),

  actions: {
    // Inicializar desde localStorage
    inicializar() {
      const stored = localStorage.getItem('clientes');
      if (stored) {
        try {
          this.clientes = JSON.parse(stored);
        } catch (e) {
          console.error('Error loading clientes from localStorage:', e);
          this.clientes = [];
        }
      }
    },

    // Guardar en localStorage
    persistir() {
      localStorage.setItem('clientes', JSON.stringify(this.clientes));
    },

    // Buscar cliente por DNI
    buscarClientePorDNI(dni) {
      return this.clientes.find(cliente => cliente.dni === dni);
    },

    // Guardar o actualizar cliente
    guardarCliente(clienteData) {
      const existente = this.buscarClientePorDNI(clienteData.dni);
      
      if (existente) {
        // Actualizar cliente existente
        Object.assign(existente, clienteData);
      } else {
        // Agregar nuevo cliente
        this.clientes.push({
          ...clienteData,
          fechaRegistro: new Date().toISOString(),
        });
      }
      
      this.persistir();
    },

    // Obtener todos los clientes
    obtenerTodosLosClientes() {
      return this.clientes;
    },
  },
});
