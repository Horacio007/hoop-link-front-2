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
    uploadVideos: (tipo:string, id: string) => `informacion-personal/upload-video/${tipo}${id}`
  },
  auth:{
    login: `auth/login`,
    refresh: `auth/refresh`,
    logout: `auth/logout`,
    yopli: 'auth/yopli',
  },
  coach: {
    getAllJugadores: `coach/list-all-jugadores`
  }
}
