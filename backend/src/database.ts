import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const configuracionDB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USUARIO || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NOMBRE || 'login_db',
  port: Number(process.env.DB_PUERTO) || 3306
};

export const pool = mysql.createPool(configuracionDB);

export const verificarConexion = async () => {
  try {
    const conexion = await pool.getConnection();
    console.log('base de datos conectada');
    conexion.release();
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return false;
  }
};