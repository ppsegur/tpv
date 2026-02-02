<template>
  <div class="invoice-form-overlay" @click.self="cerrar">
    <div class="invoice-form-container">
      <div class="form-header">
        <h2>Generar Factura</h2>
        <button class="close-btn" @click="cerrar">×</button>
      </div>

      <div class="ticket-info">
        <h3>Ticket #{{ ticket.mesaId }} - {{ new Date(ticket.fecha).toLocaleString() }}</h3>
        <p><strong>Total:</strong> {{ ticket.total.toFixed(2) }}€</p>
      </div>

      <form @submit.prevent="generarFactura" class="client-form">
        <div class="form-group">
          <label for="dni">DNI/NIF *</label>
          <div class="dni-input-group">
            <input
              id="dni"
              v-model="formData.dni"
              @blur="buscarCliente"
              type="text"
              required
              placeholder="12345678A"
            />
            <button 
              type="button" 
              @click="buscarCliente" 
              class="search-btn"
              title="Buscar cliente"
            >
              🔍
            </button>
          </div>
          <small v-if="clienteEncontrado" class="success-msg">
            ✓ Cliente encontrado
          </small>
        </div>

        <div class="form-group">
          <label for="nombre">Nombre completo *</label>
          <input
            id="nombre"
            v-model="formData.nombre"
            type="text"
            required
            placeholder="Juan Pérez García"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="cliente@ejemplo.com"
          />
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input
            id="telefono"
            v-model="formData.telefono"
            type="tel"
            placeholder="666 123 456"
          />
        </div>

        <div class="form-group">
          <label for="direccion">Dirección *</label>
          <input
            id="direccion"
            v-model="formData.direccion"
            type="text"
            required
            placeholder="Calle Principal, 123"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="codigoPostal">Código Postal *</label>
            <input
              id="codigoPostal"
              v-model="formData.codigoPostal"
              type="text"
              required
              placeholder="28001"
            />
          </div>

          <div class="form-group">
            <label for="ciudad">Ciudad *</label>
            <input
              id="ciudad"
              v-model="formData.ciudad"
              type="text"
              required
              placeholder="Madrid"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="tipoFactura">Tipo de Factura *</label>
          <select id="tipoFactura" v-model="formData.tipoFactura" required>
            <option value="FA">FA - Factura</option>
            <option value="FR">FR - Factura Rectificativa</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" @click="cerrar" class="btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            Generar Factura {{ formData.tipoFactura }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useClientesStore } from '../stores/clientes';

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'factura-generada']);

const clientesStore = useClientesStore();
const clienteEncontrado = ref(false);

// Inicializar store al montar
onMounted(() => {
  clientesStore.inicializar();
});

const formData = reactive({
  dni: '',
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  codigoPostal: '',
  ciudad: '',
  tipoFactura: 'FA',
});

const buscarCliente = () => {
  if (!formData.dni || formData.dni.length < 8) return;

  const cliente = clientesStore.buscarClientePorDNI(formData.dni);
  
  if (cliente) {
    clienteEncontrado.value = true;
    // Auto-completar formulario
    formData.nombre = cliente.nombre;
    formData.email = cliente.email || '';
    formData.telefono = cliente.telefono || '';
    formData.direccion = cliente.direccion;
    formData.codigoPostal = cliente.codigoPostal;
    formData.ciudad = cliente.ciudad;
  } else {
    clienteEncontrado.value = false;
  }
};

const generarFactura = () => {
  // Guardar cliente en la base de datos
  clientesStore.guardarCliente({
    dni: formData.dni,
    nombre: formData.nombre,
    email: formData.email,
    telefono: formData.telefono,
    direccion: formData.direccion,
    codigoPostal: formData.codigoPostal,
    ciudad: formData.ciudad,
  });

  // Crear objeto de factura
  const factura = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    tipo: formData.tipoFactura,
    ticketOriginal: props.ticket,
    cliente: { ...formData },
    total: props.ticket.total,
  };

  emit('factura-generada', factura);
  cerrar();
};

const cerrar = () => {
  emit('close');
};

// Limpiar mensaje de cliente encontrado cuando se modifica el DNI
watch(() => formData.dni, () => {
  clienteEncontrado.value = false;
});
</script>

<style scoped>
.invoice-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.invoice-form-container {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.form-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.close-btn:hover {
  color: #333;
}

.ticket-info {
  padding: 15px 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.ticket-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #555;
}

.ticket-info p {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.client-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #7c3aed;
}

.dni-input-group {
  display: flex;
  gap: 8px;
}

.dni-input-group input {
  flex: 1;
}

.search-btn {
  padding: 10px 16px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #6d28d9;
}

.success-msg {
  display: block;
  margin-top: 4px;
  color: #059669;
  font-size: 13px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #7c3aed;
  color: white;
}

.btn-primary:hover {
  background: #6d28d9;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .invoice-form-overlay {
    padding: 0;
  }

  .invoice-form-container {
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
