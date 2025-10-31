import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { verificarConexion } from './database';
import autenticacionRutas from './rutas/autenticacion.rutas';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  }
});

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // URLs del frontend Vite
  credentials: true
}));
app.use(express.json());

// Verificar conexión a base de datos
verificarConexion();

const PUERTO = process.env.PUERTO || 3000;

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API de Login - Nacho',
    version: '1.0.0',
    endpoints: {
      login: 'POST /api/login',
      registro: 'POST /api/registro',
      usuarios: 'GET /api/usuarios'
    }
  });
});

// Rutas de autenticación
app.use('/api', autenticacionRutas);

// Socket.IO - Chat en tiempo real
interface UsuarioConectado {
  socketId: string;
  usuario: string;
}

const usuariosConectados = new Map<string, UsuarioConectado>();
const usuariosPorNombre = new Map<string, string>(); // nombreUsuario -> socketId

io.on('connection', (socket) => {
  console.log('Nueva conexión Socket.IO:', socket.id);

  // Usuario se une al chat
  socket.on('usuario_conectado', (nombreUsuario: string) => {
    if (!nombreUsuario) return;

    // Verificar si el usuario ya está conectado con otro socket
    const socketIdAnterior = usuariosPorNombre.get(nombreUsuario);
    if (socketIdAnterior && socketIdAnterior !== socket.id) {
      // Eliminar la conexión anterior
      usuariosConectados.delete(socketIdAnterior);
      console.log(`Eliminando conexión anterior de ${nombreUsuario}: ${socketIdAnterior}`);
    }

    // Registrar el nuevo socket
    usuariosConectados.set(socket.id, {
      socketId: socket.id,
      usuario: nombreUsuario
    });
    usuariosPorNombre.set(nombreUsuario, socket.id);
    
    // Notificar a todos que un usuario se conectó (solo si es realmente nuevo)
    const listaUsuarios = Array.from(usuariosConectados.values());
    
    if (!socketIdAnterior) {
      // Es una conexión nueva, enviar mensaje de sistema
      io.emit('usuario_unido', {
        usuario: nombreUsuario,
        usuariosConectados: listaUsuarios,
        esNuevo: true
      });
      console.log(`${nombreUsuario} se unió al chat por primera vez`);
    } else {
      // Es una reconexión, solo actualizar lista sin mensaje
      io.emit('actualizar_usuarios', {
        usuariosConectados: listaUsuarios
      });
      console.log(`${nombreUsuario} reconectado`);
    }
  });

  // Recibir mensaje
  socket.on('enviar_mensaje', (data: { usuario: string; mensaje: string }) => {
    const mensajeCompleto = {
      id: Date.now().toString(),
      usuario: data.usuario,
      mensaje: data.mensaje,
      timestamp: new Date().toISOString()
    };
    
    // Enviar mensaje a todos los usuarios conectados
    io.emit('recibir_mensaje', mensajeCompleto);
    console.log(`Mensaje de ${data.usuario}: ${data.mensaje}`);
  });

  // Usuario escribiendo
  socket.on('escribiendo', (usuario: string) => {
    socket.broadcast.emit('usuario_escribiendo', usuario);
  });

  // Usuario dejó de escribir
  socket.on('dejar_escribir', () => {
    socket.broadcast.emit('usuario_dejo_escribir');
  });

  // Desconexión
  socket.on('disconnect', () => {
    const usuario = usuariosConectados.get(socket.id);
    if (usuario) {
      usuariosConectados.delete(socket.id);
      usuariosPorNombre.delete(usuario.usuario);
      
      io.emit('usuario_desconectado', {
        usuario: usuario.usuario,
        usuariosConectados: Array.from(usuariosConectados.values())
      });
      console.log(`${usuario.usuario} se desconectó del chat`);
    }
  });
});

// Iniciar servidor
httpServer.listen(PUERTO, () => {
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
  console.log(`URL: http://localhost:${PUERTO}`);
  console.log(`Socket.IO habilitado para chat en tiempo real`);
});
