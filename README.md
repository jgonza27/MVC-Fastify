# MVC Fastify Application

Aplicación backend completa desarrollada con **Fastify**, siguiendo el patrón de arquitectura **MVC (Modelo-Vista-Controlador)**.

## Características Principales

Esta aplicación implementa todas las funcionalidades esenciales de un backend moderno:

- **Estructura MVC**: Separación clara entre Modelos (datos), Vistas (interfaz) y Controladores (lógica).
- **Rutas**:
  - **Estáticas**: Páginas informativas como `/about`.
  - **Dinámicas**: Rutas con parámetros como `/greet/:name`.
- **Base de Datos**: ORM **Sequelize** con **SQLite**.
  - Modelos definidos: `User`, `Post`.
  - Relaciones: 1 Usuario -> N Publicaciones.
- **Autenticación**:
  - Registro y Login de usuarios.
  - Hashing de contraseñas con `bcrypt`.
  - Gestión de sesiones persistentes.
- **Control de Acceso (RBAC)**:
  - Roles de usuario: `user`, `editor`, `admin`.
  - Protección de rutas mediante middleware.
- **Funcionalidades CRUD**:
  - Crear, Leer, Actualizar y Eliminar publicaciones.
- **Subida de Archivos**:
  - Endpoint para subir imágenes/documentos con validación.
- **Frontend**:
  - Motor de plantillas **Nunjucks**.
  - Formularios HTML con gestión de errores/éxito (Flash messages).
- **Gestión de Errores**:
  - Páginas personalizadas para 404 y 500.

## Tecnologías

- **Node.js**
- **Fastify** (Framework web)
- **Sequelize** (ORM)
- **SQLite** (Base de datos)
- **Nunjucks** (Motor de plantillas)
- **Bcrypt** (Seguridad)

## Requisitos Previos

- Node.js (v14 o superior)
- NPM

## Instalación

1.  Clonar el repositorio o descargar el código.
2.  Instalar las dependencias:

```bash
npm install
```

3.  El proyecto incluye un script de migración que crea la base de datos y añade datos de prueba. Se ejecuta automáticamente al iniciar la aplicación si no existen datos, pero puedes forzarlo manualmente revisando `src/migrations/migrate.js`.

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

## Usuarios de Prueba

La base de datos viene precargada con los siguientes usuarios para probar los diferentes roles:

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Admin** | `admin@example.com` | `admin123` | Acceso total (Borrar cualquier post) |
| **Editor** | `editor@example.com` | `editor123` | Puede editar y borrar sus posts |
| **Usuario** | `user@example.com` | `user123` | Solo lectura y crear posts propios |

## Estructura del Proyecto

```
MVC-Fastify/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   └── app.js
├── views/
│   ├── auth/
│   ├── errors/
│   ├── layouts/
│   └── posts/
└── public/
```

## Detalles de Implementación

### Controladores
Ubicados en `src/controllers/`, gestionan las peticiones HTTP. Ejemplo: `postController.index` recupera los posts de la BD y renderiza la vista `posts/index.njk`.

### Modelos
Ubicados en `src/models/`, definen la estructura de datos. `User` incluye hooks para encriptar la contraseña antes de guardar.

### Vistas
Ubicadas en `views/`, utilizan Nunjucks para herencia de plantillas (`{% extends %}`) y lógica de visualización (`{% if %}`, `{% for %}`).
