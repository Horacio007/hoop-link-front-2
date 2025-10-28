import { IHistorialEntrenadoresInformacionPersonal } from "./historial-entrenadores-informacion-personal.interface";
import { IHistorialEquiposInformacionPersonal } from "./historial-equipos-informacion-personal.interface";
import { ILogrosClaveInformacionPersonal } from "./logros-clave-informacion.personal.interface";

export interface IExperienciaInformacionPersonal {
  desdeCuandoJuegas: Date | undefined ,
  horasEntrenamientoSemana?: number ,
  horasGymSemana?: number ,
  pertenecesClub: boolean ,
  nombreClub?: string ,
  historialEquipos?: IHistorialEquiposInformacionPersonal[] ,
  historialEntrenadores?: IHistorialEntrenadoresInformacionPersonal[] ,
  logrosClave?: ILogrosClaveInformacionPersonal[]
}
