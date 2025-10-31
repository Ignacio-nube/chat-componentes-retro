# API de Login - Backend Profesional

Sistema de autenticación seguro desarrollado con Node.js, Express y TypeScript.

## 🚀 Características

- ✅ Registro de usuarios con validaciones
- ✅ Login seguro con bcrypt
- ✅ Contraseñas hasheadas
- ✅ Validaciones profesionales
- ✅ Manejo de errores robusto
- ✅ Base de datos MySQL
- ✅ TypeScript para seguridad de tipos

## 📋 Requisitos

- Node.js 16+
- MySQL 5.7+
- npm o yarn

## 🛠️ Instalación

1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd "Practicas TS"
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
Editar el archivo `.env` en `src/`:
```env
PUERTO=3000
DB_HOST=localhost
DB_USUARIO=root
DB_PASSWORD=
DB_NOMBRE=login_db
DB_PUERTO=3306
```

4. Crear la base de datos
Ejecutar el script SQL ubicado en `bd.sql`:
```bash
mysql -u root -p < bd.sql
```

## 🏃 Ejecución

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm run build
npm start
```

## 📡 Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Registro de Usuario
**POST** `/api/registro`

**Body:**
```json
{
  "usuario": "juanperez",
  "correo": "juan@ejemplo.com",
  "contrasena": "MiContraseña123"
}
```

**Validaciones:**
- Usuario: mínimo 3 caracteres, máximo 50, solo letras, números y guiones bajos
- Correo: formato válido de email
- Contraseña: mínimo 8 caracteres, debe incluir:
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número

**Respuesta exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "usuario": "juanperez",
    "correo": "juan@ejemplo.com"
  }
}
```

**Errores posibles:**
- `400` - Datos inválidos o campos faltantes
- `409` - Usuario o correo ya registrado
- `500` - Error del servidor

---

### 2. Login
**POST** `/api/login`

**Body:**
```json
{
  "usuario": "juanperez",
  "contrasena": "MiContraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Login exitoso",
  "usuario": {
    "id": 1,
    "usuario": "juanperez",
    "correo": "juan@ejemplo.com"
  }
}
```

**Errores posibles:**
- `400` - Campos faltantes
- `401` - Usuario o contraseña incorrectos
- `500` - Error del servidor

---

### 3. Listar Usuarios
**GET** `/api/usuarios`

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "usuarios": [
    {
      "id": 1,
      "usuario": "juanperez",
      "correo": "juan@ejemplo.com",
      "fecha_creacion": "2025-10-23T04:00:00.000Z",
      "ultima_modificacion": "2025-10-23T04:00:00.000Z"
    }
  ]
}
```

## 🗄️ Estructura de la Base de Datos

### Tabla: usuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT(11) | Identificador único (PK, AUTO_INCREMENT) |
| usuario | VARCHAR(50) | Nombre de usuario (UNIQUE) |
| correo | VARCHAR(255) | Correo electrónico (UNIQUE) |
| hash_contrasena | VARCHAR(255) | Contraseña hasheada con bcrypt |
| id_google | VARCHAR(255) | ID de Google (para OAuth, opcional) |
| fecha_creacion | TIMESTAMP | Fecha de registro |
| ultima_modificacion | TIMESTAMP | Última actualización |

## 📁 Estructura del Proyecto

```
src/
├── controladores/
│   └── autenticacion.controlador.ts   # Lógica de negocio
├── rutas/
│   └── autenticacion.rutas.ts         # Definición de rutas
├── database.ts                         # Configuración de BD
├── tipos.ts                            # Interfaces TypeScript
├── index.ts                            # Punto de entrada
└── .env                                # Variables de entorno
```

## 🔒 Seguridad

- Las contraseñas se hashean con **bcrypt** usando 10 salt rounds
- Validaciones estrictas en todos los campos
- Protección contra inyección SQL usando consultas parametrizadas
- Manejo seguro de errores sin exponer información sensible

## 🧪 Pruebas con Postman

1. Importar la colección de Postman (crear archivo JSON)
2. Configurar la variable de entorno `baseUrl` a `http://localhost:3000/api`
3. Probar los endpoints en el siguiente orden:
   - Registro de usuario
   - Login
   - Listar usuarios

## 📝 Notas

- El campo `id_google` está preparado para futuras implementaciones de OAuth
- Todas las respuestas incluyen el campo `exito` para facilitar el manejo en el frontend
- Los mensajes de error están en español para mejor UX

## 👨‍💻 Autor

Nacho

## 📄 Licencia

ISC
