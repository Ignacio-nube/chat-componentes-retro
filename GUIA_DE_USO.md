# 🚀 Sistema de Login Profesional - Guía de Uso

Sistema completo de autenticación con login, registro y dashboard usando React, TypeScript, Node.js y MySQL.

## 📋 Características

✅ **Sistema de Autenticación Completo**
- Login con usuario y contraseña
- Registro de nuevos usuarios
- Validación de formularios
- Protección de rutas privadas
- Persistencia de sesión con localStorage
- Tokens JWT para autenticación

✅ **Dashboard Profesional**
- Navegación con barra superior
- Diseño responsive (móvil y escritorio)
- Múltiples secciones (Inicio, Proyectos, Configuración, Componentes)
- Componentes Neo-Brutalist personalizados
- Sistema de tabs para navegación móvil

✅ **Componentes Reutilizables**
- Botones con múltiples variantes
- Cards para contenido
- Inputs personalizados
- Badges y avatares
- Alertas de diferentes tipos
- Y muchos más...

## 🛠️ Instalación y Configuración

### 1. Backend (API)

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crea un archivo .env con:
PUERTO=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_datos
JWT_SECRET=tu_secreto_super_seguro
```

**Configurar la base de datos:**
- Crea una base de datos MySQL
- Ejecuta el script `bd.sql` para crear la tabla `usuarios`

```sql
-- El archivo bd.sql ya contiene la estructura necesaria
mysql -u tu_usuario -p nombre_base_datos < bd.sql
```

**Iniciar el servidor backend:**
```bash
npm run dev
# El servidor se ejecutará en http://localhost:3000
```

### 2. Frontend (React)

```bash
cd frontend

# Las dependencias ya están instaladas (react-router-dom y axios)
# Si necesitas reinstalar:
npm install

# Iniciar el servidor de desarrollo
npm run dev
# La aplicación se abrirá en http://localhost:5173
```

## 🎯 Uso de la Aplicación

### Primera vez - Crear una cuenta

1. Abre la aplicación en tu navegador (`http://localhost:5173`)
2. Verás la pantalla de login
3. Haz clic en **"Registrarse"**
4. Completa el formulario:
   - **Usuario**: 3-50 caracteres, solo letras, números y guiones bajos
   - **Correo**: Un email válido
   - **Contraseña**: Mínimo 8 caracteres, debe incluir:
     - Al menos una mayúscula
     - Al menos una minúscula
     - Al menos un número
   - **Confirmar contraseña**: Debe coincidir con la contraseña
5. Haz clic en **"✨ Registrarse"**
6. Serás redirigido automáticamente al Dashboard

### Iniciar Sesión

1. En la pantalla de login, ingresa:
   - Tu usuario
   - Tu contraseña
2. Haz clic en **"🚀 Iniciar Sesión"**
3. Accederás al Dashboard

### Navegar en el Dashboard

#### En escritorio:
- Usa la **barra de navegación superior** para cambiar entre secciones:
  - 🏠 **Inicio**: Vista general de tu cuenta
  - 📊 **Proyectos**: Gestión de proyectos (plantilla lista para personalizar)
  - ⚙️ **Configuración**: Información de tu cuenta
  - 📚 **Componentes**: Galería de todos los componentes disponibles

#### En móvil:
- Usa las **pestañas (tabs)** debajo del header para navegar

### Cerrar Sesión

- Haz clic en el botón **"🚪 Salir"** en la esquina superior derecha
- Serás redirigido a la pantalla de login

## 🎨 Personalización

### Agregar nuevas secciones al Dashboard

Edita `frontend/src/pages/Dashboard.tsx`:

```typescript
// 1. Agregar link de navegación
const navLinks: NavLink[] = [
  // ... links existentes
  { label: '🆕 Mi Nueva Sección', href: '#mi-seccion' },
];

// 2. Agregar caso en renderContenido()
const renderContenido = () => {
  switch (tabActiva) {
    // ... casos existentes
    case 'mi-seccion':
      return <MiNuevaSeccion />;
  }
};

// 3. Crear el componente
const MiNuevaSeccion: React.FC = () => (
  <div className="contenido-seccion">
    <h2 className="seccion-titulo">Mi Nueva Sección</h2>
    {/* Tu contenido aquí */}
  </div>
);
```

### Modificar colores y estilos

Los estilos Neo-Brutalist están en:
- `frontend/src/styles/neoBrutalist.css` - Estilos globales
- `frontend/src/pages/Login.css` - Estilos del login
- `frontend/src/pages/Dashboard.css` - Estilos del dashboard
- Cada componente tiene su propio archivo CSS

### Cambiar el logo y nombre de la app

Edita `frontend/src/pages/Dashboard.tsx`:

```typescript
<h1 className="dashboard-logo">⚡ Mi App</h1>
// Cambia a:
<h1 className="dashboard-logo">🎨 Tu Nombre</h1>
```

## 🔧 Agregar Funcionalidad

### Ejemplo: Crear una nueva API endpoint

**Backend** (`backend/src/rutas/autenticacion.rutas.ts`):
```typescript
router.get('/api/mi-endpoint', miControlador);
```

**Frontend** (hacer llamadas con axios):
```typescript
import axios from 'axios';

const obtenerDatos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/mi-endpoint');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

## 📦 Componentes Disponibles

Tu aplicación incluye estos componentes Neo-Brutalist:

- **Button**: Botones con 5 variantes (yellow, black, red, green, gray)
- **Card**: Tarjetas con título, contenido y footer
- **Input**: Inputs personalizados
- **Badge**: Etiquetas de estado
- **Alert**: Alertas (info, success, warning, error)
- **Nav**: Barra de navegación
- **Avatar**: Avatares de usuario
- **Tabs**: Sistema de pestañas
- **Modal**: Modales/diálogos
- **Dropdown**: Menús desplegables
- **Tooltip**: Tooltips informativos
- **Accordion**: Acordeones expandibles
- **Progress**: Barras de progreso
- **Toggle**: Switches/toggles

Ver ejemplos de uso en la sección **"📚 Componentes"** del Dashboard.

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT para autenticación
- ✅ Validación de inputs en frontend y backend
- ✅ Rutas protegidas con ProtectedRoute
- ✅ CORS configurado correctamente

## 📝 Estructura del Proyecto

```
proyecto/
├── backend/
│   ├── src/
│   │   ├── controladores/
│   │   │   └── autenticacion.controlador.ts
│   │   ├── rutas/
│   │   │   └── autenticacion.rutas.ts
│   │   ├── database.ts
│   │   ├── tipos.ts
│   │   └── index.ts
│   ├── bd.sql
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/         # Componentes reutilizables
    │   ├── context/            # Context API (AuthContext)
    │   ├── pages/              # Páginas (Login, Dashboard)
    │   ├── styles/             # Estilos globales
    │   ├── utils/              # Utilidades
    │   ├── App.tsx             # Componente principal con rutas
    │   └── main.tsx            # Punto de entrada
    └── package.json
```

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que MySQL esté corriendo
- Revisa las credenciales en el archivo `.env`
- Confirma que la base de datos existe

### Error de CORS
- Verifica que el frontend y backend estén en los puertos correctos
- El backend debe estar en `http://localhost:3000`
- El frontend debe estar en `http://localhost:5173`

### La sesión no persiste
- Verifica que localStorage esté habilitado en tu navegador
- Revisa la consola del navegador por errores

## 🚀 Próximos Pasos

Ahora que tienes una base funcional, puedes:

1. **Agregar más páginas** con tus propias funcionalidades
2. **Crear nuevos endpoints** en el backend
3. **Personalizar el diseño** según tu marca
4. **Agregar más validaciones** y seguridad
5. **Implementar recuperación de contraseña**
6. **Agregar roles de usuario** (admin, usuario, etc.)
7. **Integrar con servicios externos** (Google OAuth, etc.)

## 💡 Tips

- Usa los componentes existentes para mantener consistencia visual
- El diseño es completamente responsive
- Todos los colores y estilos siguen el tema Neo-Brutalist
- La aplicación está lista para producción con pequeños ajustes

---

**¡Tu aplicación está lista para usar! 🎉**

Comienza agregando tu propia funcionalidad y personalizando el diseño a tu gusto.
