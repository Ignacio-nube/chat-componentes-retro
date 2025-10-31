# 🎨 Ejemplos de Código para Extender tu Aplicación

## 📝 Crear una nueva página

### 1. Crear el archivo de la página

`frontend/src/pages/MiPagina.tsx`:

```typescript
import React, { useState } from 'react';
import { Card, Button, Input, Alert } from '../components';
import './MiPagina.css';

export const MiPagina: React.FC = () => {
  const [dato, setDato] = useState('');

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dato enviado:', dato);
  };

  return (
    <div className="mi-pagina-container">
      <h1>Mi Nueva Página</h1>
      
      <Card title="Formulario de Ejemplo">
        <form onSubmit={manejarSubmit}>
          <Input
            type="text"
            placeholder="Ingresa algo..."
            value={dato}
            onChange={(e) => setDato(e.target.value)}
          />
          <Button type="submit" variant="yellow">
            Enviar
          </Button>
        </form>
      </Card>
    </div>
  );
};
```

### 2. Agregar la ruta en App.tsx

```typescript
import { MiPagina } from './pages/MiPagina';

// Dentro de <Routes>:
<Route 
  path="/mi-pagina" 
  element={
    <ProtectedRoute>
      <MiPagina />
    </ProtectedRoute>
  } 
/>
```

### 3. Agregar link en la navegación del Dashboard

```typescript
// En Dashboard.tsx
const navLinks: NavLink[] = [
  // ... links existentes
  { label: '✨ Mi Página', href: '/mi-pagina' },
];

// Cambiar el manejo de click para usar navigate:
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const manejarNavClick = (link: NavLink, event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  if (link.href.startsWith('/')) {
    navigate(link.href);
  } else {
    const tab = link.href.replace('#', '');
    setTabActiva(tab);
  }
};
```

## 🔌 Crear un nuevo endpoint en el backend

### 1. Crear el controlador

`backend/src/controladores/miControlador.ts`:

```typescript
import { Request, Response } from 'express';
import { pool } from '../database';
import { RowDataPacket } from 'mysql2';

export const obtenerDatos = async (req: Request, res: Response): Promise<void> => {
  try {
    const [filas] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM mi_tabla LIMIT 10'
    );

    res.json({
      exito: true,
      datos: filas
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      exito: false,
      mensaje: 'Error en el servidor' 
    });
  }
};

export const crearDato = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      res.status(400).json({ 
        exito: false,
        mensaje: 'El nombre es requerido' 
      });
      return;
    }

    const [resultado] = await pool.query(
      'INSERT INTO mi_tabla (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );

    res.status(201).json({
      exito: true,
      mensaje: 'Dato creado exitosamente'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      exito: false,
      mensaje: 'Error al crear el dato' 
    });
  }
};
```

### 2. Crear las rutas

`backend/src/rutas/miRuta.ts`:

```typescript
import { Router } from 'express';
import { obtenerDatos, crearDato } from '../controladores/miControlador';

const router = Router();

router.get('/datos', obtenerDatos);
router.post('/datos', crearDato);

export default router;
```

### 3. Registrar las rutas en index.ts

```typescript
import miRuta from './rutas/miRuta';

// Después de las rutas de autenticación:
app.use('/api', miRuta);
```

## 🌐 Llamar a la API desde el frontend

### Crear un servicio

`frontend/src/services/miServicio.ts`:

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const miServicio = {
  obtenerDatos: async () => {
    try {
      const response = await axios.get(`${API_URL}/datos`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  crearDato: async (nombre: string, descripcion: string) => {
    try {
      const response = await axios.post(`${API_URL}/datos`, {
        nombre,
        descripcion
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
```

### Usar el servicio en un componente

```typescript
import React, { useState, useEffect } from 'react';
import { miServicio } from '../services/miServicio';
import { Card, Alert } from '../components';

export const MiComponente: React.FC = () => {
  const [datos, setDatos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const resultado = await miServicio.obtenerDatos();
      setDatos(resultado.datos);
      setError('');
    } catch (err: any) {
      setError('Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div>Cargando...</div>;
  if (error) return <Alert tone="error">{error}</Alert>;

  return (
    <div>
      {datos.map((dato) => (
        <Card key={dato.id} title={dato.nombre}>
          {dato.descripcion}
        </Card>
      ))}
    </div>
  );
};
```

## 🎨 Crear un componente personalizado

`frontend/src/components/MiComponente.tsx`:

```typescript
import React from 'react';
import { classNames } from '../utils/classNames';
import '../styles/neoBrutalist.css';
import './MiComponente.css';

export interface MiComponenteProps {
  titulo: string;
  contenido: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export const MiComponente: React.FC<MiComponenteProps> = ({
  titulo,
  contenido,
  variant = 'primary',
  onClick,
  className
}) => {
  return (
    <div 
      className={classNames(
        'neo-brutalist',
        'mi-componente',
        `mi-componente--${variant}`,
        className
      )}
      onClick={onClick}
    >
      <h3 className="mi-componente__titulo">{titulo}</h3>
      <div className="mi-componente__contenido">{contenido}</div>
    </div>
  );
};
```

`frontend/src/components/MiComponente.css`:

```css
.mi-componente {
  padding: 1.5rem;
  border: 3px solid #000;
  background: #fff;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  transition: all 0.2s ease;
}

.mi-componente:hover {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 1);
}

.mi-componente--primary {
  border-color: #000;
}

.mi-componente--secondary {
  border-color: #666;
}

.mi-componente__titulo {
  margin: 0 0 1rem 0;
  font-weight: 900;
  font-size: 1.5rem;
  text-transform: uppercase;
}

.mi-componente__contenido {
  color: #333;
  line-height: 1.6;
}
```

### Exportar el componente

En `frontend/src/components/index.ts`:

```typescript
export { MiComponente } from './MiComponente';
export type { MiComponenteProps } from './MiComponente';
```

## 🔐 Agregar middleware de autenticación al backend

`backend/src/middleware/autenticacion.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

interface JWTPayload {
  id: number;
  iat: number;
  exp: number;
}

// Extender Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const verificarToken = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ 
        exito: false,
        mensaje: 'Token no proporcionado' 
      });
      return;
    }

    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      res.status(401).json({ 
        exito: false,
        mensaje: 'Formato de token inválido' 
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ 
      exito: false,
      mensaje: 'Token inválido o expirado' 
    });
  }
};
```

### Usar el middleware

```typescript
import { verificarToken } from '../middleware/autenticacion';

// Proteger una ruta:
router.get('/datos-protegidos', verificarToken, obtenerDatosProtegidos);

// En el controlador, puedes acceder al userId:
export const obtenerDatosProtegidos = async (
  req: Request, 
  res: Response
): Promise<void> => {
  const userId = req.userId; // ID del usuario autenticado
  
  // Usar el userId para queries específicas del usuario
  const [datos] = await pool.query(
    'SELECT * FROM datos WHERE usuario_id = ?',
    [userId]
  );
  
  res.json({ exito: true, datos });
};
```

## 📊 Ejemplo de formulario completo con validación

```typescript
import React, { useState } from 'react';
import { Card, Input, Button, Alert } from '../components';

interface FormData {
  nombre: string;
  email: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  mensaje?: string;
}

export const FormularioContacto: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const [errores, setErrores] = useState<FormErrors>({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: FormErrors = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!validarEmail(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!formData.mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje es requerido';
    } else if (formData.mensaje.length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo al escribir
    if (errores[name as keyof FormErrors]) {
      setErrores(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setEnviando(true);
    try {
      // Aquí harías tu llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API
      
      setExito(true);
      setFormData({ nombre: '', email: '', mensaje: '' });
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setExito(false), 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card title="📨 Formulario de Contacto">
      {exito && (
        <Alert tone="success">
          ✅ Mensaje enviado exitosamente!
        </Alert>
      )}

      <form onSubmit={manejarEnvio}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              Nombre
            </label>
            <Input
              name="nombre"
              type="text"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={manejarCambio}
              disabled={enviando}
            />
            {errores.nombre && (
              <span style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errores.nombre}
              </span>
            )}
          </div>

          <div>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              Email
            </label>
            <Input
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={manejarCambio}
              disabled={enviando}
            />
            {errores.email && (
              <span style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errores.email}
              </span>
            )}
          </div>

          <div>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              Mensaje
            </label>
            <textarea
              name="mensaje"
              placeholder="Tu mensaje..."
              value={formData.mensaje}
              onChange={manejarCambio}
              disabled={enviando}
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '3px solid #000',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            {errores.mensaje && (
              <span style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errores.mensaje}
              </span>
            )}
          </div>

          <Button 
            type="submit" 
            variant="yellow"
            disabled={enviando}
          >
            {enviando ? '📤 Enviando...' : '📨 Enviar Mensaje'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
```

## 🎯 Hook personalizado para peticiones API

`frontend/src/hooks/useApi.ts`:

```typescript
import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const ejecutar = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any
  ) => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await axios({
        method,
        url,
        data
      });

      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      const mensaje = error.response?.data?.mensaje || 'Error en la petición';
      setState({ data: null, loading: false, error: mensaje });
      throw error;
    }
  }, []);

  const get = useCallback((url: string) => ejecutar('GET', url), [ejecutar]);
  const post = useCallback((url: string, data: any) => ejecutar('POST', url, data), [ejecutar]);
  const put = useCallback((url: string, data: any) => ejecutar('PUT', url, data), [ejecutar]);
  const del = useCallback((url: string) => ejecutar('DELETE', url), [ejecutar]);

  return {
    ...state,
    get,
    post,
    put,
    delete: del
  };
}
```

### Usar el hook

```typescript
import { useApi } from '../hooks/useApi';

export const MiComponente: React.FC = () => {
  const { data, loading, error, get } = useApi();

  const cargarDatos = () => {
    get('http://localhost:3000/api/datos');
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <Alert tone="error">{error}</Alert>;

  return <div>{/* Renderizar data */}</div>;
};
```

---

¡Con estos ejemplos tienes todo lo necesario para extender tu aplicación! 🚀
