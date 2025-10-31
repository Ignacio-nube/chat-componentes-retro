import { Request, Response } from 'express';
import { pool } from '../database';
import { Usuario, DatosRegistro, DatosLogin } from '../tipos';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

// Constantes
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const generarToken = (usuarioId: number): string =>
  jwt.sign({ id: usuarioId }, JWT_SECRET, { expiresIn: '12h' });

const normalizarUsuario = (nombre: string): string =>
  nombre
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || `usuario_${Date.now()}`;

// Validaciones
const validarEmail = (correo: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
};

const validarContrasena = (contrasena: string): { valida: boolean; mensaje?: string } => {
  if (contrasena.length < 8) {
    return { valida: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(contrasena)) {
    return { valida: false, mensaje: 'La contraseña debe contener al menos una mayúscula' };
  }
  if (!/[a-z]/.test(contrasena)) {
    return { valida: false, mensaje: 'La contraseña debe contener al menos una minúscula' };
  }
  if (!/[0-9]/.test(contrasena)) {
    return { valida: false, mensaje: 'La contraseña debe contener al menos un número' };
  }
  return { valida: true };
};

const validarUsuario = (usuario: string): { valido: boolean; mensaje?: string } => {
  if (usuario.length < 3) {
    return { valido: false, mensaje: 'El usuario debe tener al menos 3 caracteres' };
  }
  if (usuario.length > 50) {
    return { valido: false, mensaje: 'El usuario no puede exceder 50 caracteres' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(usuario)) {
    return { valido: false, mensaje: 'El usuario solo puede contener letras, números y guiones bajos' };
  }
  return { valido: true };
};

/**
 * POST /api/register - Registrar nuevo usuario
 */
export const registrar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario, correo, contrasena }: DatosRegistro = req.body;

    // Validar que vengan todos los campos
    if (!usuario || !correo || !contrasena) {
      res.status(400).json({ 
        exito: false,
        mensaje: 'Usuario, correo y contraseña son requeridos' 
      });
      return;
    }

    // Validar formato de usuario
    const validacionUsuario = validarUsuario(usuario);
    if (!validacionUsuario.valido) {
      res.status(400).json({ 
        exito: false,
        mensaje: validacionUsuario.mensaje 
      });
      return;
    }

    // Validar formato de correo
    if (!validarEmail(correo)) {
      res.status(400).json({ 
        exito: false,
        mensaje: 'El formato del correo no es válido' 
      });
      return;
    }

    // Validar contraseña
    const validacionContrasena = validarContrasena(contrasena);
    if (!validacionContrasena.valida) {
      res.status(400).json({ 
        exito: false,
        mensaje: validacionContrasena.mensaje 
      });
      return;
    }

    // Verificar si el usuario ya existe
    const [usuariosExistentes] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM usuarios WHERE usuario = ? OR correo = ?',
      [usuario, correo]
    );

    if (usuariosExistentes.length > 0) {
      res.status(409).json({ 
        exito: false,
        mensaje: 'El usuario o correo ya está registrado' 
      });
      return;
    }

    // Hashear la contraseña
    const hashContrasena = await bcrypt.hash(contrasena, SALT_ROUNDS);

    // Insertar el nuevo usuario
    const [resultado] = await pool.query<ResultSetHeader>(
      'INSERT INTO usuarios (usuario, correo, hash_contrasena) VALUES (?, ?, ?)',
      [usuario, correo, hashContrasena]
    );

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: resultado.insertId,
        usuario,
        correo
      },
      token: generarToken(resultado.insertId)
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      exito: false,
      mensaje: 'Error en el servidor al registrar usuario' 
    });
  }
};

/**
 * POST /api/login - Autenticación de usuario
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario, contrasena }: DatosLogin = req.body;

    // Validar que vengan los datos
    if (!usuario || !contrasena) {
      res.status(400).json({ 
        exito: false,
        mensaje: 'Usuario y contraseña son requeridos' 
      });
      return;
    }

    // Buscar usuario en la base de datos
    const [filas] = await pool.query<RowDataPacket[]>(
      'SELECT id, usuario, correo, hash_contrasena FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    // Verificar si existe el usuario
    if (filas.length === 0) {
      res.status(401).json({ 
        exito: false,
        mensaje: 'Usuario o contraseña incorrectos' 
      });
      return;
    }

    const usuarioEncontrado = filas[0] as Usuario;

    // Verificar que tenga hash de contraseña
    if (!usuarioEncontrado.hash_contrasena) {
      res.status(500).json({ 
        exito: false,
        mensaje: 'Error en la configuración del usuario' 
      });
      return;
    }

    // Comparar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuarioEncontrado.hash_contrasena);

    if (!contrasenaValida) {
      res.status(401).json({ 
        exito: false,
        mensaje: 'Usuario o contraseña incorrectos' 
      });
      return;
    }

    // Login exitoso
    const token = generarToken(usuarioEncontrado.id!);

    res.json({
      exito: true,
      mensaje: 'Login exitoso',
      usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        correo: usuarioEncontrado.correo
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      exito: false,
      mensaje: 'Error en el servidor' 
    });
  }
};

/**
 * GET /api/usuarios - Obtener todos los usuarios (solo para admin)
 */
export const obtenerUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const [filas] = await pool.query<RowDataPacket[]>(
      'SELECT id, usuario, correo, fecha_creacion, ultima_modificacion FROM usuarios'
    );

    res.json({
      exito: true,
      usuarios: filas
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      exito: false,
      mensaje: 'Error al obtener usuarios' 
    });
  }
};

export const loginConGoogle = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
      res.status(500).json({
        exito: false,
        mensaje: 'Autenticación con Google no configurada en el servidor',
      });
      return;
    }

    const { credential } = req.body as { credential?: string };

    if (!credential) {
      res.status(400).json({
        exito: false,
        mensaje: 'La credencial de Google es obligatoria',
      });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email) {
      res.status(401).json({
        exito: false,
        mensaje: 'No se pudo validar la cuenta de Google',
      });
      return;
    }

    const idGoogle = payload.sub;
    const correo = payload.email;
    const nombre = payload.name || payload.given_name || correo.split('@')[0];

    const [usuarios] = await pool.query<RowDataPacket[]>(
      'SELECT id, usuario, correo, id_google FROM usuarios WHERE id_google = ? OR correo = ?',
      [idGoogle, correo]
    );

    let usuarioFinal: Usuario;

    if (usuarios.length > 0) {
      const existente = usuarios[0] as Usuario;

      if (!existente.id_google) {
        await pool.query('UPDATE usuarios SET id_google = ? WHERE id = ?', [idGoogle, existente.id]);
      }

      usuarioFinal = {
        id: existente.id,
        usuario: existente.usuario,
        correo: existente.correo,
      };
    } else {
      let usuarioPropuesto = normalizarUsuario(nombre);
      let sufijo = 1;

      while (true) {
        const [duplicados] = await pool.query<RowDataPacket[]>(
          'SELECT id FROM usuarios WHERE usuario = ?',
          [usuarioPropuesto]
        );
        if (duplicados.length === 0) {
          break;
        }
        usuarioPropuesto = `${normalizarUsuario(nombre)}_${sufijo}`;
        sufijo += 1;
      }

      const [resultado] = await pool.query<ResultSetHeader>(
        'INSERT INTO usuarios (usuario, correo, id_google) VALUES (?, ?, ?)',
        [usuarioPropuesto, correo, idGoogle]
      );

      usuarioFinal = {
        id: resultado.insertId,
        usuario: usuarioPropuesto,
        correo,
      };
    }

    const token = generarToken(usuarioFinal.id!);

    res.json({
      exito: true,
      mensaje: 'Autenticación con Google exitosa',
      usuario: usuarioFinal,
      token,
    });
  } catch (error) {
    console.error('Error en login con Google:', error);
    res.status(401).json({
      exito: false,
      mensaje: 'La sesión de Google no pudo validarse',
    });
  }
};