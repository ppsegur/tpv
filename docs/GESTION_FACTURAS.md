# Gestión de Facturas - Sistema de Facturación

## Descripción General

Este sistema permite gestionar facturas a partir de los tickets generados en el TPV. Incluye:

1. **Vista de Arqueo de Caja** - Visualización y filtrado de tickets por fecha
2. **Formulario de Factura** - Generación de facturas (FA/FR) con datos de cliente
3. **Base de Datos de Clientes** - Almacenamiento y autocompletado de datos de clientes

## Características Principales

### 1. Arqueo de Caja (`/arqueo`)

La vista de Arqueo permite:
- Ver todos los tickets del día actual por defecto
- Filtrar tickets por fecha específica
- Ver resumen del día (número de tickets y total recaudado)
- Hacer click en cualquier ticket para generar una factura

### 2. Formulario de Factura

Al hacer click en un ticket, se abre un formulario modal con:

#### Campos del Formulario:
- **DNI/NIF** (requerido): Con búsqueda automática de cliente
- **Nombre completo** (requerido)
- **Email** (opcional)
- **Teléfono** (opcional)
- **Dirección** (requerido)
- **Código Postal** (requerido)
- **Ciudad** (requerido)
- **Tipo de Factura**: FA (Factura) o FR (Factura Rectificativa)

#### Funcionalidad de Autocompletado:
1. El usuario introduce el DNI/NIF
2. Hace click en el botón de búsqueda (🔍) o pierde el foco del campo
3. Si el cliente existe en la base de datos:
   - Muestra mensaje "✓ Cliente encontrado"
   - Autocompleta todos los campos del formulario
4. Si el cliente no existe:
   - El usuario rellena el formulario manualmente
   - Los datos se guardan automáticamente al generar la factura

### 3. Almacenamiento de Clientes

El sistema utiliza Pinia store con persistencia en localStorage:

```javascript
// Estructura de datos de cliente
{
  dni: string,           // Identificador único
  nombre: string,        // Nombre completo
  email: string,         // Email (opcional)
  telefono: string,      // Teléfono (opcional)
  direccion: string,     // Dirección completa
  codigoPostal: string,  // Código postal
  ciudad: string,        // Ciudad
  fechaRegistro: string  // ISO timestamp de creación
}
```

## Flujo de Uso

### Caso 1: Cliente Nuevo

1. Usuario navega a **Arqueo** (`/arqueo`)
2. Selecciona la fecha deseada (por defecto: hoy)
3. Hace click en un ticket
4. Se abre el formulario de factura
5. Introduce el DNI del cliente
6. Como no existe, rellena todos los campos manualmente
7. Selecciona el tipo de factura (FA o FR)
8. Click en "Generar Factura"
9. Los datos del cliente se guardan en localStorage
10. La factura se genera y se muestra en la sección "Facturas Generadas"

### Caso 2: Cliente Existente

1. Usuario navega a **Arqueo** (`/arqueo`)
2. Selecciona un ticket
3. Introduce el DNI de un cliente ya registrado
4. Click en búsqueda (🔍) o sale del campo DNI
5. El formulario se autocompleta con los datos guardados
6. El usuario solo revisa y confirma (puede modificar si es necesario)
7. Selecciona el tipo de factura
8. Click en "Generar Factura"

## Tipos de Factura

- **FS (Factura Simplificada)**: Es el ticket original
- **FA (Factura)**: Factura completa generada a partir del ticket
- **FR (Factura Rectificativa)**: Factura que corrige o modifica una factura anterior

## Estructura de Archivos

```
src/
├── components/
│   └── InvoiceForm.vue         # Formulario modal de facturación
├── stores/
│   └── clientes.js             # Store Pinia para gestión de clientes
├── views/
│   └── ArqueoView.vue          # Vista principal de arqueo de caja
└── router.js                    # Ruta /arqueo configurada
```

## Navegación

El sistema se integra en el menú principal con un nuevo enlace "Arqueo" que permite acceso directo a la funcionalidad.

## Almacenamiento Local

Los datos se guardan en `localStorage` bajo las claves:
- `clientes`: Array de clientes registrados
- `mesas`: Incluye el historial de tickets

## Validaciones

- Campos requeridos: DNI, nombre, dirección, código postal, ciudad
- Formato DNI: Texto libre (permite DNI español, NIF, CIF, NIE, etc.)
- Email: Validación HTML5 type="email"
- Teléfono: Texto libre (permite cualquier formato)

## Mejoras Futuras

- [ ] Implementar sistema de notificaciones toast en lugar de `alert()`
- [ ] Añadir impresión de facturas en PDF
- [ ] Exportar facturas a contabilidad
- [ ] Validación avanzada de DNI/NIF
- [ ] Búsqueda de clientes por nombre
- [ ] Histórico de facturas por cliente
