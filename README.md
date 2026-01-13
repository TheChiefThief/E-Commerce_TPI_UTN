# 🛒 Super E-commerce .NET - Full Stack Solution

![.NET](https://img.shields.io/badge/.NET%208-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Esta es una plataforma de comercio electrónico de alto rendimiento desarrollada con el ecosistema de **.NET**. El proyecto abarca desde la gestión de inventario hasta el procesamiento de pagos, siguiendo las mejores prácticas de arquitectura de software y diseño limpio (*Clean Architecture*).

---

## 📖 Tabla de Contenidos
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura y Patrones](#arquitectura-y-patrones)
- [Características Principales](#características-principales)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura del Repositorio](#estructura-del-repositorio)

---

## 🌟 Descripción del Proyecto
Este E-commerce nació con el objetivo de crear una solución escalable y segura. No es solo una tienda, sino un ecosistema que integra:
- **API Robusta:** Para el manejo de datos y lógica de negocio.
- **Seguridad:** Implementación de autenticación y autorización avanzada.
- **Experiencia de Usuario:** Interfaz intuitiva y proceso de compra optimizado.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Core:** .NET 8.0 (ASP.NET Core)
- **ORM:** Entity Framework Core
- **Base de Datos:** Microsoft SQL Server
- **Seguridad:** ASP.NET Core Identity & JWT para APIs.
- **Documentación:** Swagger / OpenAPI

### Frontend
- **Tecnología:** [Ej: Blazor / Razor Pages / React]
- **Estilos:** Bootstrap 5 / Tailwind CSS
- **Validaciones:** FluentValidation / DataAnnotations

---

## 🏗️ Arquitectura y Patrones
Para garantizar que el código sea mantenible, se han aplicado los siguientes conceptos:
- **Repository & Unit of Work:** Para desacoplar la lógica de acceso a datos.
- **Dependency Injection:** Nativa de .NET para una mejor gestión de servicios.
- **DTOs (Data Transfer Objects):** Para la comunicación segura entre capas.
- **Migraciones de EF Core:** Gestión de versiones de la base de datos controlada.

---

## ✨ Características Principales
- 🔒 **Sistema de Identidad:** Roles de usuario (Admin, Cliente), registro y recuperación de cuenta.
- 📦 **Catálogo Dinámico:** Gestión de categorías, marcas, stock y precios.
- 🛒 **Carrito de Compras Avanzado:** Persistencia de datos y validación de stock en tiempo real.
- 💳 **Checkout Seguro:** Integración de pasarelas de pago (Stripe/PayPal o Simulación).
- 📊 **Panel Administrativo:** Control total de ventas, productos y usuarios.
- 📧 **Notificaciones:** Sistema de envío de correos electrónicos para confirmación de pedidos.

---

## 🔧 Instalación y Configuración

### Requisitos Previos
- .NET SDK 8.0
- SQL Server (LocalDB o Express)
- Visual Studio 2022 o VS Code

### Pasos
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TheChiefThief/Dsw2025_E-commerce
