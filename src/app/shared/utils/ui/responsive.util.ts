import { IResizeImg } from "../../interfaces/ui/ui.interface";

export function redibujaImg(resize: IResizeImg, location: number): string {
  const { limSuperior, limMedio, limInferior, valSuperior, valMedio, valInferior  } = resize;

  switch (location) {
    case 1:
        if (window.innerWidth <= limSuperior) {
          return valSuperior.toString();
        } else if (window.innerWidth >= limInferior) {
          return valInferior.toString();
        } else {
          return (window.innerWidth * 0.5).toString(); // Recalcula el tamaño en cada cambio de ventana
        }
      break;
    case 2:
      if (window.innerWidth >= limSuperior) {
        return valSuperior.toString();
      } else if (window.innerWidth <= limInferior) {
        return valInferior.toString();
      } else {
        return (window.innerWidth * 0.5).toString(); // Recalcula el tamaño en cada cambio de ventana
      }
      break;
    default:
      return valSuperior.toString();
      break;
  }
}
