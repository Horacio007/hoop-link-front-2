import { IHistorialTrabajoInformacionPersonal } from "./historial-trabajo-informacion-personal-coach";

export interface IRegistraInformacionPersonal
{
  fotoPerfilId?: number,
  fotoPerfil?: string | File,
  coachId?: number,
  trabajoActual: string,
  personalidad: string,
  valores: string,
  objetivos: string,
  antiguedad?: number,
  historialTrabajoCoaches:IHistorialTrabajoInformacionPersonal[],
  fotoPerfilPublicUrl: string,
}

export interface IInformacionPersonalCoach {
    informacionPersonalCoachId: number,
    fotoPerfilId: number,
    coachId: number,
    trabajoActual: string,
    personalidad: string,
    valores: string,
    objetivos: string,
    historialTrabajoCoaches?: IHistorialTrabajoCoach[] ,
    fotoPerfilPublicUrl: string,
    antiguedad?: number,
}

export interface IHistorialTrabajoCoach {
    id: string;
    nombre: string;
}
