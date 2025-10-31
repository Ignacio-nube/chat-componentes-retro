# 📡 Documentación de la API

Base URL: `http://localhost:3000/api`

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer {token}
```

---

## Endpoints

### 1. Registro de Usuario

**POST** `/registro`

Crea una nueva cuenta de usuario.

**Request Body:**
```json
{
  "usuario": "nombre_usuario",
  "correo": "usuario@email.com",
  "contrasena": "Password123"
}
```

**Validaciones:**
- `usuario`: 3-50 caracteres, solo letras, números y guiones bajos
- `correo`: Debe ser un email válido
- `contrasena`: 
  - Mínimo 8 caracteres
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número

**Response Success (201):**
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "usuario": "nombre_usuario",
    "correo": "usuario@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400):**
```json
{
  "exito": false,
  "mensaje": "Usuario, correo y contraseña son requeridos"
}
```

**Response Error (409):**
```json
{
  "exito": false,
  "mensaje": "El usuario o correo ya está registrado"
}
```

---

### 2. Login

**POST** `/login`

Autentica a un usuario existente.

**Request Body:**
```json
{
  "usuario": "nombre_usuario",
  "contrasena": "Password123"
}
```

**Response Success (200):**
```json
{
  "exito": true,
  "mensaje": "Login exitoso",
  "usuario": {
    "id": 1,
    "usuario": "nombre_usuario",
    "correo": "usuario@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400):**
```json
{
  "exito": false,
  "mensaje": "Usuario y contraseña son requeridos"
}
```

**Response Error (401):**
```json
{
  "exito": false,
  "mensaje": "Usuario o contraseña incorrectos"
}
```

---

### 3. Login con Google

**POST** `/login/google`

Autentica a un usuario usando Google OAuth.

**Request Body:**
```json
{
  "credential": "google_oauth_credential_token"
}
```

**Response Success (200):**
```json
{
  "exito": true,
  "mensaje": "Login con Google exitoso",
  "usuario": {
    "id": 1,
    "usuario": "nombre_usuario",
    "correo": "usuario@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400):**
```json
{
  "exito": false,
  "mensaje": "Credencial de Google es requerida"
}
```

---

### 4. Obtener Usuarios

**GET** `/usuarios`

Obtiene la lista de todos los usuarios registrados.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "exito": true,
  "usuarios": [
    {
      "id": 1,
      "usuario": "usuario1",
      "correo": "usuario1@email.com",
      "fecha_creacion": "2024-01-01T12:00:00.000Z",
      "ultima_modificacion": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "usuario": "usuario2",
      "correo": "usuario2@email.com",
      "fecha_creacion": "2024-01-02T12:00:00.000Z",
      "ultima_modificacion": "2024-01-02T12:00:00.000Z"
    }
  ]
}
```

**Response Error (500):**
```json
{
  "exito": false,
  "mensaje": "Error al obtener usuarios"
}
```

---

## 📝 Modelos de Datos

### Usuario

```typescript
{
  id: number;
  usuario: string;
  correo: string;
  hash_contrasena?: string;  // No se devuelve en las respuestas
  id_google?: string;
  fecha_creacion: Date;
  ultima_modificacion: Date;
}
```

---

## 🔒 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos o faltantes |
| 401 | Unauthorized - Autenticación fallida o token inválido |
| 409 | Conflict - Conflicto con datos existentes (ej: usuario duplicado) |
| 500 | Internal Server Error - Error del servidor |

---

## 📋 Ejemplos de Uso

### JavaScript (Fetch API)

```javascript
// Registro
const registro = async () => {
  const response = await fetch('http://localhost:3000/api/registro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usuario: 'nuevo_usuario',
      correo: 'nuevo@email.com',
      contrasena: 'Password123'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Login
const login = async () => {
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usuario: 'nuevo_usuario',
      contrasena: 'Password123'
    })
  });
  
  const data = await response.json();
  const token = data.token;
  
  // Guardar token
  localStorage.setItem('token', token);
};

// Obtener usuarios (con autenticación)
const obtenerUsuarios = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/usuarios', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data.usuarios);
};
```

### Axios

```javascript
import axios from 'axios';

// Configurar axios con el token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Registro
const registro = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/registro', {
      usuario: 'nuevo_usuario',
      correo: 'nuevo@email.com',
      contrasena: 'Password123'
    });
    
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
};

// Login
const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      usuario: 'nuevo_usuario',
      contrasena: 'Password123'
    });
    
    const { token } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (error) {
    console.error(error.response.data);
  }
};

// Obtener usuarios
const obtenerUsuarios = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/usuarios');
    console.log(response.data.usuarios);
  } catch (error) {
    console.error(error.response.data);
  }
};
```

### cURL

```bash
# Registro
curl -X POST http://localhost:3000/api/registro \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "nuevo_usuario",
    "correo": "nuevo@email.com",
    "contrasena": "Password123"
  }'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "nuevo_usuario",
    "contrasena": "Password123"
  }'

# Obtener usuarios (con token)
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer tu_token_aqui"
```

---

## 🛡️ Seguridad

### Tokens JWT

Los tokens JWT tienen las siguientes características:
- **Expiración**: 12 horas desde la emisión
- **Algoritmo**: HS256
- **Payload**: Contiene el ID del usuario

### Contraseñas

- Se almacenan hasheadas con **bcrypt**
- Salt rounds: 10
- Nunca se devuelven en las respuestas de la API

### CORS

El servidor acepta peticiones desde:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Vite alternativo)

---

## 🐛 Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "exito": false,
  "mensaje": "Descripción del error"
}
```

### Errores Comunes

**Error de validación:**
```json
{
  "exito": false,
  "mensaje": "La contraseña debe tener al menos 8 caracteres"
}
```

**Error de autenticación:**
```json
{
  "exito": false,
  "mensaje": "Token inválido o expirado"
}
```

**Error del servidor:**
```json
{
  "exito": false,
  "mensaje": "Error en el servidor"
}
```

---

## 📊 Rate Limiting

Actualmente no hay límites de tasa implementados, pero se recomienda:
- Máximo 100 peticiones por minuto por IP
- Máximo 10 intentos de login por minuto

---

## 🔄 Versiones

**Versión Actual**: 1.0.0

### Changelog

**v1.0.0** (2024)
- ✅ Registro de usuarios
- ✅ Login con usuario y contraseña
- ✅ Login con Google OAuth
- ✅ Obtener lista de usuarios
- ✅ Autenticación con JWT

---

## 📞 Soporte

Para reportar bugs o solicitar nuevas características, contacta al equipo de desarrollo.
