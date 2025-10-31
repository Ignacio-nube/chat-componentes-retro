import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Input, Button, Alert } from '../components';
import './Login.css';

export const Login: React.FC = () => {
  const [esRegistro, setEsRegistro] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login, registro } = useAuth();
  const navigate = useNavigate();

  const limpiarFormulario = () => {
    setUsuario('');
    setCorreo('');
    setContrasena('');
    setConfirmarContrasena('');
    setError('');
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (esRegistro) {
        // Validaciones para registro
        if (!usuario || !correo || !contrasena || !confirmarContrasena) {
          setError('Todos los campos son requeridos');
          setCargando(false);
          return;
        }

        if (contrasena !== confirmarContrasena) {
          setError('Las contraseñas no coinciden');
          setCargando(false);
          return;
        }

        if (contrasena.length < 8) {
          setError('La contraseña debe tener al menos 8 caracteres');
          setCargando(false);
          return;
        }

        await registro(usuario, correo, contrasena);
      } else {
        // Validaciones para login
        if (!usuario || !contrasena) {
          setError('Usuario y contraseña son requeridos');
          setCargando(false);
          return;
        }

        await login(usuario, contrasena);
      }

      // Si todo salió bien, redirigir al dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setCargando(false);
    }
  };

  const cambiarModo = () => {
    setEsRegistro(!esRegistro);
    limpiarFormulario();
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <div className="login-header">
            <h1 className="login-title">
              {esRegistro ? '🚀 Crear Cuenta' : '🔐 Iniciar Sesión'}
            </h1>
            <p className="login-subtitle">
              {esRegistro 
                ? 'Completa los datos para registrarte'
                : 'Ingresa tus credenciales para continuar'
              }
            </p>
          </div>

          {error && (
            <Alert 
              tone="error" 
              className="login-alert"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={manejarEnvio} className="login-form">
            <div className="form-group">
              <label htmlFor="usuario" className="form-label">
                Usuario
              </label>
              <Input
                id="usuario"
                type="text"
                placeholder="tu_usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={cargando}
                required
                autoComplete="username"
              />
            </div>

            {esRegistro && (
              <div className="form-group">
                <label htmlFor="correo" className="form-label">
                  Correo electrónico
                </label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={cargando}
                  required
                  autoComplete="email"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="contrasena" className="form-label">
                Contraseña
              </label>
              <Input
                id="contrasena"
                type="password"
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                disabled={cargando}
                required
                autoComplete={esRegistro ? "new-password" : "current-password"}
              />
            </div>

            {esRegistro && (
              <div className="form-group">
                <label htmlFor="confirmarContrasena" className="form-label">
                  Confirmar contraseña
                </label>
                <Input
                  id="confirmarContrasena"
                  type="password"
                  placeholder="••••••••"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  disabled={cargando}
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            <Button
              type="submit"
              variant="black"
              textColor="white"
              className="login-button"
              disabled={cargando}
            >
              {cargando 
                ? '⏳ Procesando...' 
                : esRegistro 
                  ? '✨ Registrarse' 
                  : '🚀 Iniciar Sesión'
              }
            </Button>
          </form>

          <div className="login-footer">
            <p className="login-toggle-text">
              {esRegistro 
                ? '¿Ya tienes una cuenta?' 
                : '¿No tienes una cuenta?'
              }
            </p>
            <button
              type="button"
              onClick={cambiarModo}
              className="login-toggle-button"
              disabled={cargando}
            >
              {esRegistro ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </div>
        </Card>

        <div className="login-decoration">
          <div className="decoration-box decoration-box-1"></div>
          <div className="decoration-box decoration-box-2"></div>
          <div className="decoration-box decoration-box-3"></div>
        </div>
      </div>
    </div>
  );
};
