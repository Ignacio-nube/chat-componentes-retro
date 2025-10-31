import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';
import { 
  Nav, 
  Card, 
  Button, 
  Badge, 
  Alert,
  Avatar,
  type NavLink
} from '../components';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('inicio');

  const manejarLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks: NavLink[] = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Chat', href: '#chat' },
    { label: 'Configuración', href: '#configuracion' },
    { label: 'Componentes', href: '#componentes' },
  ];

  const manejarNavClick = (link: NavLink, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const tab = link.href.replace('#', '');
    setTabActiva(tab);
  };

  // Renderizar contenido según tab activa (usado por ambos desktop y móvil)
  const renderContenido = () => {
    switch (tabActiva) {
      case 'inicio':
        return <ContenidoInicio usuario={usuario} />;
      case 'chat':
        return <ContenidoChat />;
      case 'configuracion':
        return <ContenidoConfiguracion usuario={usuario} />;
      case 'componentes':
        return <ContenidoComponentes />;
      default:
        return <ContenidoInicio usuario={usuario} />;
    }
  };

  // Tabs personalizados para móvil (sin usar el componente Tabs)
  const tabsMobile = [
    { id: 'inicio', label: '🏠 Inicio' },
    { id: 'chat', label: '💬 Chat' },
    { id: 'configuracion', label: '⚙️ Config' },
    { id: 'componentes', label: '📚 Comp' },
  ];

  return (
    <div className="dashboard-container">
      {/* Header con navegación */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-brand">
            <h1 className="dashboard-logo">NACHO</h1>
            <Badge variant="yellow" text="v1.0" />
          </div>

          <Nav 
            links={navLinks}
            onLinkClick={manejarNavClick}
            className="dashboard-nav"
          />

          <div className="dashboard-user">
            <Avatar 
              alt={usuario?.usuario || 'Usuario'}
              size={48}
            />
            <div className="dashboard-user-info">
              <span className="dashboard-username">{usuario?.usuario}</span>
              <Badge variant="green" text="En línea" />
            </div>
            <Button 
              variant="red" 
              textColor="white"
              onClick={manejarLogout}
              className="logout-button"
            >
              🚪 Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Tabs personalizados para móviles */}
          <div className="dashboard-tabs-mobile">
            <div className="custom-tabs">
              {tabsMobile.map((tab) => (
                <button
                  key={tab.id}
                  className={`custom-tab ${tabActiva === tab.id ? 'custom-tab--active' : ''}`}
                  onClick={() => setTabActiva(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido dinámico */}
          <div className="dashboard-section">
            {renderContenido()}
          </div>
        </div>
      </main>
    </div>
  );
};

// Componentes de contenido para cada sección
const ContenidoInicio: React.FC<{ usuario: any }> = ({ usuario }) => (
  <div className="contenido-seccion">
    <div className="seccion-header">
      <h2 className="seccion-titulo">Bienvenido, {usuario?.usuario}!</h2>
      <p className="seccion-descripcion">
        Esta es tu página principal personalizada
      </p>
    </div>

    <Alert tone="success" className="dashboard-alert">
      ✅ Tu cuenta está activa y verificada
    </Alert>

    
    <Card className="action-card">
      <h3 className="card-title">🚀 Comienza a explorar</h3>
      <p className="card-description">
        Explora las diferentes secciones usando la navegación superior o las pestañas.
        Esta aplicación está lista para que agregues tu propia funcionalidad.
      </p>
      <div className="action-buttons">
        <Button variant="yellow">Ver Proyectos</Button>
        <Button variant="black" textColor="white">Ver Componentes</Button>
      </div>
    </Card>
  </div>
);

const ContenidoChat: React.FC = () => {
  const { usuario } = useAuth();
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [usuariosConectados, setUsuariosConectados] = useState<any[]>([]);
  const [escribiendo, setEscribiendo] = useState('');
  const [conectado, setConectado] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const escribiendoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    // Evitar múltiples conexiones
    if (isConnectingRef.current || socketRef.current?.connected) {
      return;
    }

    isConnectingRef.current = true;

    // Conectar a Socket.IO
    const socketUrl = `${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}`;
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Conectado al chat:', socket.id);
      setConectado(true);
      socket.emit('usuario_conectado', usuario?.usuario);
    });

    socket.on('disconnect', (reason) => {
      console.log('Desconectado del chat:', reason);
      setConectado(false);
      isConnectingRef.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      setConectado(false);
    });

    socket.on('usuario_unido', (data) => {
      if (data.esNuevo) {
        // Solo mostrar mensaje si es una conexión nueva
        setMensajes(prev => [...prev, {
          id: `${Date.now()}-${data.usuario}`,
          tipo: 'sistema',
          mensaje: `${data.usuario} se unió al chat`,
          timestamp: new Date().toISOString()
        }]);
      }
      setUsuariosConectados(data.usuariosConectados);
    });

    socket.on('actualizar_usuarios', (data) => {
      // Solo actualizar la lista sin mostrar mensaje
      setUsuariosConectados(data.usuariosConectados);
    });

    socket.on('usuario_desconectado', (data) => {
      setUsuariosConectados(data.usuariosConectados);
      setMensajes(prev => [...prev, {
        id: `${Date.now()}-${data.usuario}`,
        tipo: 'sistema',
        mensaje: `${data.usuario} se desconectó`,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('recibir_mensaje', (mensaje) => {
      setMensajes(prev => [...prev, mensaje]);
    });

    socket.on('usuario_escribiendo', (usuario) => {
      setEscribiendo(`${usuario} está escribiendo...`);
    });

    socket.on('usuario_dejo_escribir', () => {
      setEscribiendo('');
    });

    // Cleanup completo
    return () => {
      console.log('Limpiando conexión del chat');
      
      if (escribiendoTimeoutRef.current) {
        clearTimeout(escribiendoTimeoutRef.current);
      }

      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('usuario_unido');
        socket.off('actualizar_usuarios');
        socket.off('usuario_desconectado');
        socket.off('recibir_mensaje');
        socket.off('usuario_escribiendo');
        socket.off('usuario_dejo_escribir');
        
        socket.disconnect();
      }
      
      isConnectingRef.current = false;
    };
  }, [usuario]);

  useEffect(() => {
    // Auto-scroll al último mensaje
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (mensaje.trim() && socketRef.current?.connected) {
      socketRef.current.emit('enviar_mensaje', {
        usuario: usuario?.usuario,
        mensaje: mensaje.trim()
      });
      setMensaje('');
      socketRef.current.emit('dejar_escribir');
      
      if (escribiendoTimeoutRef.current) {
        clearTimeout(escribiendoTimeoutRef.current);
      }
    }
  };

  const manejarEscribir = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMensaje(e.target.value);

    // Emitir evento de escribiendo
    if (socketRef.current?.connected && e.target.value.length > 0) {
      socketRef.current.emit('escribiendo', usuario?.usuario);

      // Limpiar timeout anterior
      if (escribiendoTimeoutRef.current) {
        clearTimeout(escribiendoTimeoutRef.current);
      }

      // Dejar de escribir después de 2 segundos
      escribiendoTimeoutRef.current = setTimeout(() => {
        if (socketRef.current?.connected) {
          socketRef.current.emit('dejar_escribir');
        }
      }, 2000);
    } else if (socketRef.current?.connected) {
      socketRef.current.emit('dejar_escribir');
    }
  };

  const formatearHora = (timestamp: string) => {
    const fecha = new Date(timestamp);
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="contenido-seccion chat-seccion">
      <div className="seccion-header">
        <div>
          <h2 className="seccion-titulo">💬 Chat Global</h2>
          <p className="seccion-descripcion">
            {conectado ? (
              <Badge variant="green" text={`Conectado • ${usuariosConectados.length} en línea`} />
            ) : (
              <Badge variant="red" text="Desconectado" />
            )}
          </p>
        </div>
      </div>

      {!conectado && (
        <Alert tone="warning">
          ⚠️ Conectando al servidor de chat...
        </Alert>
      )}

      <div className="chat-container">
        <div className="chat-sidebar">
          <h3 className="chat-sidebar-title">Usuarios en línea</h3>
          <div className="usuarios-lista">
            {usuariosConectados.map((usr) => (
              <div key={usr.socketId} className="usuario-item">
                <Avatar alt={usr.usuario} size={32} />
                <span className="usuario-nombre">{usr.usuario}</span>
                {usr.usuario === usuario?.usuario && (
                  <Badge variant="yellow" text="Tú" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          <div className="mensajes-container">
            {mensajes.length === 0 ? (
              <div className="chat-vacio">
                <p>👋 No hay mensajes aún. ¡Sé el primero en escribir!</p>
              </div>
            ) : (
              mensajes.map((msg) => (
                <div
                  key={msg.id}
                  className={`mensaje ${msg.tipo === 'sistema' ? 'mensaje-sistema' : ''} ${
                    msg.usuario === usuario?.usuario ? 'mensaje-propio' : 'mensaje-otro'
                  }`}
                >
                  {msg.tipo === 'sistema' ? (
                    <div className="mensaje-sistema-content">
                      <Badge 
                        variant="blue" 
                        text={msg.mensaje}
                        textColor="white"
                        className="badge-sistema-join"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="mensaje-header">
                        <Avatar alt={msg.usuario} size={28} />
                        <strong className="mensaje-usuario">{msg.usuario}</strong>
                        <span className="mensaje-hora">{formatearHora(msg.timestamp)}</span>
                      </div>
                      <div className="mensaje-texto">{msg.mensaje}</div>
                    </>
                  )}
                </div>
              ))
            )}
            <div ref={mensajesEndRef} />
          </div>

          {escribiendo && (
            <div className="escribiendo-indicador">
              <Badge variant="blue" text={escribiendo} />
            </div>
          )}

          <form onSubmit={enviarMensaje} className="chat-form">
            <input
              type="text"
              value={mensaje}
              onChange={manejarEscribir}
              placeholder="Escribe un mensaje..."
              className="chat-input"
              disabled={!conectado}
            />
            <Button 
              type="submit" 
              variant="yellow"
              disabled={!conectado || !mensaje.trim()}
            >
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContenidoConfiguracion: React.FC<{ usuario: any }> = ({ usuario }) => (
  <div className="contenido-seccion">
    <div className="seccion-header">
      <h2 className="seccion-titulo">⚙️ Configuración</h2>
      <p className="seccion-descripcion">Gestiona tu cuenta y preferencias</p>
    </div>

    <Card className="config-card">
      <h3 className="card-title">👤 Información de la cuenta</h3>
      <div className="config-info">
        <div className="config-item">
          <strong>Usuario:</strong> {usuario?.usuario}
        </div>
        <div className="config-item">
          <strong>Correo:</strong> {usuario?.correo}
        </div>
        <div className="config-item">
          <strong>ID:</strong> #{usuario?.id}
        </div>
      </div>
      <div className="action-buttons">
        <Button variant="yellow">Editar Perfil</Button>
        <Button variant="gray">Cambiar Contraseña</Button>
      </div>
    </Card>

    <Card className="config-card">
      <h3 className="card-title">🎨 Preferencias</h3>
      <p>Personaliza tu experiencia (próximamente)</p>
      <Button variant="black" textColor="white" disabled>
        Próximamente
      </Button>
    </Card>
  </div>
);

const ContenidoComponentes: React.FC = () => (
  <div className="contenido-seccion">
    <div className="seccion-header">
      <h2 className="seccion-titulo">📚 Biblioteca de Componentes</h2>
      <p className="seccion-descripcion">
        Componentes disponibles en tu aplicación
      </p>
    </div>

    <Alert tone="warning">
      💡 Estos son los componentes Neo-Brutalist que tienes disponibles
    </Alert>

    <div className="components-showcase">
      <Card className="showcase-card">
        <h3 className="card-title">🎨 Botones</h3>
        <div className="showcase-buttons">
          <Button variant="yellow">Yellow</Button>
          <Button variant="black" textColor="white">Black</Button>
          <Button variant="red" textColor="white">Red</Button>
          <Button variant="green" textColor="white">Green</Button>
          <Button variant="gray">Gray</Button>
        </div>
      </Card>

      <Card className="showcase-card">
        <h3 className="card-title">🏷️ Badges</h3>
        <div className="showcase-badges">
          <Badge variant="yellow" text="Yellow" />
          <Badge variant="black" text="Black" />
          <Badge variant="red" text="Red" />
          <Badge variant="green" text="Green" />
          <Badge variant="blue" text="Blue" />
        </div>
      </Card>

      <Card className="showcase-card">
        <h3 className="card-title">⚠️ Alertas</h3>
        <div className="showcase-alerts">
          <Alert tone="info">Información importante</Alert>
          <Alert tone="success">Operación exitosa</Alert>
          <Alert tone="warning">Advertencia</Alert>
          <Alert tone="error">Error detectado</Alert>
        </div>
      </Card>
    </div>
  </div>
);
