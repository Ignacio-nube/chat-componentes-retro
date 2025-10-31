export interface Usuario {
  id?: number;
  usuario: string;
  correo: string;
  hash_contrasena?: string;
  id_google?: string;
  fecha_creacion?: Date;
  ultima_modificacion?: Date;
}

export interface DatosRegistro {
  usuario: string;
  correo: string;
  contrasena: string;
}

export interface DatosLogin {
  usuario: string;
  contrasena: string;
}

export interface DatosLoginGoogle {
  credential: string;
}