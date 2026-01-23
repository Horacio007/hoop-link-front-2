import { ICatalogo } from "../catalogo/catalogo.interface";

export interface IPerfilInformacionPersonal {
  informacionPersonalId?: number,
  usuarioId?: number,
  fotoPerfil?: string | File,
  alias?: string,
  altura?: number,
  peso?: number,
  estatusBusquedaJugador?: ICatalogo,
  sexo?: ICatalogo,
  medidaMano?: number,
  largoBrazo?: number,
  aperturaBrazo?: number,
  alcanceMaximo?: number,
  quienEres?: string,
}
