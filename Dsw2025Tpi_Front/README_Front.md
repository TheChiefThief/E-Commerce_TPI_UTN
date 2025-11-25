# Requerimientos de Frontend - E-commerce TPI

Este documento detalla los requisitos funcionales, flujos de usuario y especificaciones técnicas para el desarrollo del Frontend de la plataforma de E-commerce (Módulo de Órdenes).

## 1. Visión General
[cite_start]El objetivo es construir una interfaz web (Cliente-Servidor) separada del backend, que interactúe con una API RESTful[cite: 92]. [cite_start]La aplicación debe manejar dos roles principales: **Administrador** y **Cliente**[cite: 25, 27].

## 2. Requerimientos Técnicos Generales
* **Interacción con API:** El frontend debe consumir los endpoints provistos por el backend para todas las operaciones de datos.
* [cite_start]**Manejo de Errores:** Ante un error del lado del servidor (código 500), se debe mostrar un feedback adecuado al usuario[cite: 341].
* [cite_start]**Diseño:** Debe seguir los lineamientos de los wireframes provistos (versión móvil y escritorio)[cite: 343].

---

## 3. Estructura de Rutas y Páginas
La aplicación debe contar con las siguientes rutas y funcionalidades específicas:

### A. Módulo Público / Cliente

#### 1. Listado de Productos (Home)
* [cite_start]**Ruta Frontend:** `/` [cite: 568]
* **Conexión API:** `GET /api/products`
* **Funcionalidades:**
    * [cite_start]Visible para todos los visitantes (sin necesidad de login)[cite: 13].
    * [cite_start]Debe soportar **paginación** y **búsqueda**[cite: 567].
    * [cite_start]**Agregar al Carrito:** Al hacer click en "Agregar", el producto se guarda en el `localStorage` bajo la key `'cart'`[cite: 570].
    * [cite_start]**Validación:** No se puede agregar 0 productos; el mínimo es 1[cite: 570].
    * Opción para Iniciar Sesión o Registrarse visible en la navegación.

#### 2. Carrito de Compras
* [cite_start]**Ruta Frontend:** `/cart` [cite: 602]
* [cite_start]**Fuente de Datos:** Carga los ítems almacenados en `localStorage` (key `'cart'`)[cite: 604].
* **Funcionalidades:**
    * [cite_start]Visualizar productos, actualizar cantidades o eliminar ítems[cite: 163].
    * **Flujo de "Finalizar Compra" (Checkout):**
        1.  [cite_start]**Usuario Logueado:** Se envían los datos directamente a `POST /api/orders`[cite: 606].
        2.  **Usuario NO Logueado:**
            * [cite_start]Abrir una **Modal** con formulario de login[cite: 607].
            * El usuario ingresa sus datos.
            * [cite_start]Al cerrarse la modal (login exitoso), se deben enviar los datos a `POST /api/orders` **automáticamente**[cite: 607].
            * [cite_start]Limpiar el `localStorage` (resetear key `'cart'`)[cite: 607].
            * [cite_start]Redirigir al listado de productos[cite: 607].

#### 3. Registro de Usuario (Modal o Página)
* [cite_start]**Ruta Frontend:** `/signup` [cite: 363]
* **Conexión API:** `POST /api/auth/register`
* [cite_start]**Rol:** Automáticamente el rol asignado debe ser `User`[cite: 664].

---

### B. Módulo Administrativo (Acceso Restringido)

#### 1. Inicio de Sesión (Admin)
* [cite_start]**Ruta Frontend:** `/login` [cite: 346]
* **Conexión API:** `POST /api/auth/login`
* **Funcionalidad:** Permite el acceso al dashboard administrativo.

#### 2. Dashboard (Principal)
* [cite_start]**Ruta Frontend:** `/admin` [cite: 399]
* [cite_start]**Requisito:** Solo accesible tras un login satisfactorio[cite: 397].
* **Datos a mostrar:**
    * Cantidad total de Productos (obtener del backend).
    * [cite_start]Cantidad total de Órdenes (obtener del backend)[cite: 401, 402].

#### 3. Gestión de Productos (Listado)
* [cite_start]**Ruta Frontend:** `/admin/products` [cite: 430]
* **Conexión API:** `GET /api/products`
* **Funcionalidades:**
    * Listado de productos existentes.
    * [cite_start]Debe soportar **paginación**, **búsqueda** y **filtro por estado**[cite: 432].
    * Botón para ir a crear un nuevo producto.

#### 4. Crear Producto
* [cite_start]**Ruta Frontend:** `/admin/products/create` [cite: 479]
* **Conexión API:** `POST /api/products`
* [cite_start]**Validaciones:** Todos los campos (SKU, Nombre, Precio, Stock, etc.) deben tener validación correspondiente[cite: 481].
* [cite_start]**Flujo:** Luego de crear exitosamente, debe redirigir a la página de listado de productos (`/admin/products`)[cite: 482].

#### 5. Gestión de Órdenes (Listado)
* [cite_start]**Ruta Frontend:** `/admin/orders` [cite: 515]
* **Conexión API:** `GET /api/orders`
* **Funcionalidades:**
    * Permite a los administradores visualizar las órdenes de los clientes.
    * [cite_start]Debe soportar **paginación**, **búsqueda** y **filtro por estado**[cite: 517].
    * [cite_start]Posibilidad de cambiar el estado de la orden (ej: de 'Pendiente' a 'Procesando')[cite: 174].

---

## 4. Resumen de Lógica de Negocio en Cliente

| Característica | Detalle |
| :--- | :--- |
| **Persistencia Carrito** | `localStorage`, Key: `'cart'`. |
| **Stock en UI** | Validar que la cantidad seleccionada sea al menos 1. |
| **Checkout Anónimo** | Interceptar el click en "Finalizar", forzar Login en Modal, y reintentar la compra automáticamente tras el login. |
| **Limpieza** | Vaciar el carrito (`localStorage`) tras una compra exitosa. |

## 5. Diseño (Wireframes)
El frontend debe respetar la disposición de elementos presentada en los wireframes del documento de especificación (Páginas 11 a 23), asegurando la responsividad (versiones Móvil y Desktop).