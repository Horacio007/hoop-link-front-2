import { ICatalogo } from "../catalogo/catalogo.interface";

export interface IBasketballInformacionPersonal {
  anioEmpezoAJugar: Date | undefined,
  manoJuego: boolean,
  posicionJuegoUno: ICatalogo ,
  posicionJuegoDos: ICatalogo ,
  clavas: boolean ,
  puntosPorJuego?: number ,
  asistenciasPorJuego?: number ,
  rebotesPorJuego?: number ,
  porcentajeTirosMedia?: number ,
  porcentajeTirosTres?: number ,
  porcentajeTirosLibres?: number ,
}
