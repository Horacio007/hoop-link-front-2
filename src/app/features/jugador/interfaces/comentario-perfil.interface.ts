export interface IComentarioPerfil {
  comentarios_perfil_jugador_id: number;
  autor: number;
  comentario: string;
  fecha_creacion: Date;
  nombre_autor: string;
  nombre_perfil: string;
}

export interface ISaveComentarioPerfil {
  informacionPersonalId?: number;
  autor: number;
  comentario: string;
}
