import { Router } from 'express';
import { login, registrar, obtenerUsuarios, loginConGoogle } from '../controladores/autenticacion.controlador';

const router = Router();

// Rutas de autenticación
router.post('/login', login);
router.post('/registro', registrar);
router.post('/login/google', loginConGoogle);

// Rutas de usuarios
router.get('/usuarios', obtenerUsuarios);

export default router;