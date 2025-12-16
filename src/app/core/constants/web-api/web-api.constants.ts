export const WebApiConstants = {
  catalogo: {
    getAllTipoUsuario: `catalogo/getAllTipoUsuario`,
    getAllEstado: `catalogo/getAllEstado`,
    getAllMunicipioByEstado: (id:string) => `catalogo/getAllMunicipioByEstado/${id}`,
    getAllEstatusBusquedaJugador: `catalogo/getAllEstatusBusquedaJugador`,
    getAllPosicionJugador: `catalogo/getAllPosicionJugador`
  },
  usuario: {
    save: `usuario/save`,
    validaToken: (token:string) => `usuario/valida-token?token=${token}`,
    recuperaContrasena: `usuario/recupera-contrasena`,
  },
  informacion_personal: {
    save: `informacion-personal/save`,
    getInformacion: `informacion-personal`,
    getInformacionById: (informacionPersonalId: number) => `informacion-personal/detalle/${informacionPersonalId}`,
    uploadVideos: (tipo:string, id: string) => `informacion-personal/upload-video/${tipo}${id}`,
    getTotalVistasPerfil: `informacion-personal/total-vistas`,
    getTotalFavoritosPerfil: `informacion-personal/total-favoritos`,
  },
  auth:{
    login: `auth/login`,
    refresh: `auth/refresh`,
    logout: `auth/logout`,
    yopli: 'auth/yopli',
  },
  coach: {
    getAllJugadores: `coach/list-all-jugadores`,
    saveVistaPerfil: (informacionPersonalId: number) => `coach/save-vista-perfil/${informacionPersonalId}`,
    saveFavoritoPerfil: (informacionPersonalId: number) => `coach/save-favorito-perfil/${informacionPersonalId}`,
    getAllJugadoresFavoritos: `coach/list-all-jugadores-favoritos`,
  },
  comentario: {
    save: `comentarios-perfil-jugador/save`,
    getAllComentarioByInformacionPersonalId: (informacionPersonalId: number) => `comentarios-perfil-jugador/perfil/${informacionPersonalId}`,
  }
}
