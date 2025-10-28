export interface IRegistro {
  nombre:string;
  apellidoPaterno:string;
  apellidoMaterno:string;
  fechaNacimiento:string;
  municipio:string;
  residencia:string;
  correo:string;
  telefono:string;
  tipoUsuario:string;
  contrasena:string;
}

export interface IRecuperaContrasena {
  correo: string
}
