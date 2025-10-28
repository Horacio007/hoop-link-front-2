import { IBasketballInformacionPersonal } from "./basketball-informacion-personal.interface";
import { IExperienciaInformacionPersonal } from "./experiencia-informacion-personal.interface";
import { IFuerzaResistenciaInformacionPersonal } from "./fuerza-resistencia-informacion-personal.interface";
import { IPerfilInformacionPersonal } from "./perfil-informacion-personal.interface";
import { IRedesSocialesInformacionPersonal } from "./redes-sociales-informacion-personal.interface";
import { IVideosInformacionPersonal } from "./videos-informacion-personal.interface";
import { IVisionInformacionPersonal } from "./vision-informacion-personal.interface";

export interface IRegistraInformacionPersonal {
  perfil: IPerfilInformacionPersonal,
  fuerzaResistencia: IFuerzaResistenciaInformacionPersonal,
  basketball: IBasketballInformacionPersonal,
  experiencia: IExperienciaInformacionPersonal,
  vision: IVisionInformacionPersonal,
  videos: IVideosInformacionPersonal,
  redes: IRedesSocialesInformacionPersonal,
}
