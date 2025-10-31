# 🗺️ Estructura del Proyecto: Análisis Completo

Este documento detalla la arquitectura y el propósito de cada archivo y directorio en el proyecto, diseñado para ser procesado y visualizado como un mapa mental.

---

## 🌳 Raíz del Proyecto

- **`backend/`**: Contiene toda la lógica del servidor (API REST).
- **`frontend/`**: Contiene la aplicación cliente (interfaz de usuario).
- **`documentación/`**: Archivos de documentación (GUIA_DE_USO.md, etc.).

---

## 🚀 Backend (Node.js + Express + TypeScript)

**Propósito**: Servir datos, gestionar la autenticación y comunicarse con la base de datos.

```
backend/
│
├── 📄 **bd.sql**: Script SQL para crear la tabla `usuarios`.
│
├── 📄 **package.json**: Define los scripts y dependencias del backend (Express, cors, mysql2, etc.).
│
├── 📄 **tsconfig.json**: Configuración de TypeScript para el backend.
│
└── 📁 **src/**: Código fuente del servidor.
    │
    ├── 📄 **index.ts**: Punto de entrada del servidor.
    │   - Configura Express y los middlewares (cors, json).
    │   - Define la ruta principal (`/`).
    │   - Inicia el servidor.
    │
    ├── 📄 **database.ts**: Gestiona la conexión a la base de datos MySQL.
    │   - Crea un "pool" de conexiones para eficiencia.
    │   - Exporta la función `verificarConexion`.
    │
    ├── 📄 **tipos.ts**: Define las interfaces de TypeScript para los datos (Usuario, DatosLogin, etc.).
    │
    ├── 📁 **controladores/**: Lógica de negocio para cada ruta.
    │   └── 📄 **autenticacion.controlador.ts**:
    │       - `registrar`: Valida y crea nuevos usuarios. Hashea contraseñas.
    │       - `login`: Verifica credenciales y genera tokens JWT.
    │       - `loginConGoogle`: Maneja la autenticación con Google.
    │       - `obtenerUsuarios`: Devuelve la lista de usuarios.
    │
    └── 📁 **rutas/**: Define los endpoints de la API.
        └── 📄 **autenticacion.rutas.ts**:
            - `POST /api/login`
            - `POST /api/registro`
            - `POST /api/login/google`
            - `GET /api/usuarios`
```

---

## 🎨 Frontend (React + Vite + TypeScript)

**Propósito**: Construir la interfaz de usuario que los usuarios ven y con la que interactúan.

```
frontend/
│
├── 📄 **index.html**: Punto de entrada HTML de la aplicación.
│
├── 📄 **package.json**: Define los scripts y dependencias del frontend (React, react-router-dom, axios).
│
├── 📄 **vite.config.ts**: Configuración del empaquetador Vite.
│
├── 📄 **tsconfig.json**: Configuración principal de TypeScript para el frontend.
│
└── 📁 **src/**: Código fuente de la aplicación React.
    │
    ├── 📄 **main.tsx**: Punto de entrada de React. Renderiza el componente `App`.
    │
    ├── 📄 **App.tsx**: Componente principal.
    │   - Configura `AuthProvider` para el contexto de autenticación.
    │   - Define el enrutador (`react-router-dom`) y las rutas de la aplicación.
    │
    ├── 📄 **tipos.ts**: Interfaces de TypeScript específicas del frontend.
    │
    ├── 📁 **context/**: Context API de React para estado global.
    │   └── 📄 **AuthContext.tsx**:
    │       - Provee estado de autenticación (usuario, token).
    │       - Expone funciones `login`, `registro`, `logout`.
    │       - Persiste la sesión en `localStorage`.
    │
    ├── 📁 **pages/**: Componentes que representan páginas completas.
    │   ├── 📄 **Login.tsx**: Página de inicio de sesión y registro.
    │   └── 📄 **Dashboard.tsx**: Panel principal visible tras el login.
    │
    ├── 📁 **components/**: Componentes reutilizables de la UI.
    │   ├── 📄 **Nav.tsx**: Barra de navegación.
    │   ├── 📄 **Card.tsx**: Tarjeta para mostrar contenido.
    │   ├── 📄 **Button.tsx**: Botón estilizado.
    │   ├── 📄 **Input.tsx**: Campo de texto personalizado.
    │   ├── 📄 **Alert.tsx**: Mensajes de alerta.
    │   ├── 📄 **ProtectedRoute.tsx**: Componente de orden superior para proteger rutas.
    │   └── ... (y otros componentes de UI).
    │
    ├── 📁 **styles/**: Estilos globales.
    │   └── 📄 **neoBrutalist.css**: Estilos base para el tema Neo-Brutalist.
    │
    └── 📁 **utils/**: Funciones de utilidad.
        └── 📄 **classNames.ts**: Utilidad para concatenar clases de CSS condicionalmente.
```
