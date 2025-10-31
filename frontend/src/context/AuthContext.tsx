import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface Usuario {
  id: number;
  usuario: string;
  correo: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  login: (usuario: string, contrasena: string) => Promise<void>;
  registro: (usuario: string, correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  estaAutenticado: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const resolveApiBaseUrl = () => {
  if (import.meta.env?.VITE_API_URL) {
    return String(import.meta.env.VITE_API_URL).replace(/\/$/, '');
  }
  return 'http://localhost:3000';
};

const API_BASE_URL = resolveApiBaseUrl();
const API_URL = `${API_BASE_URL}/api`;

// Asegura que todas las peticiones de axios usen el backend correcto
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
      // Configurar axios con el token
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenGuardado}`;
    }
    setCargando(false);
  }, []);

  const login = async (usuarioNombre: string, contrasena: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        usuario: usuarioNombre,
        contrasena
      });

      const { token: nuevoToken, usuario: nuevoUsuario } = response.data;

      setToken(nuevoToken);
      setUsuario(nuevoUsuario);

      // Guardar en localStorage
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));

      // Configurar axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${nuevoToken}`;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.mensaje || 'Error al iniciar sesión');
      }
      throw new Error('Error de conexión con el servidor');
    }
  };

  const registro = async (usuarioNombre: string, correo: string, contrasena: string) => {
    try {
      const response = await axios.post(`${API_URL}/registro`, {
        usuario: usuarioNombre,
        correo,
        contrasena
      });

      const { token: nuevoToken, usuario: nuevoUsuario } = response.data;

      setToken(nuevoToken);
      setUsuario(nuevoUsuario);

      // Guardar en localStorage
      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));

      // Configurar axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${nuevoToken}`;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.mensaje || 'Error al registrarse');
      }
      throw new Error('Error de conexión con el servidor');
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    usuario,
    token,
    cargando,
    login,
    registro,
    logout,
    estaAutenticado: !!usuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
