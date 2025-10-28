import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextoUtilsService {

//#region Propiedades

//#endregion Propiedades

//#region Constructor
  constructor() { }
//#endregion Constructor

//#region Texto
  reemplazarMarcadores(texto: string, ...args: string[]): string {
    let resultado = texto;
    for (let i = 0; i < args.length; i++) {
      const marcador = `{${i}}`;
      resultado = resultado.replace(new RegExp(marcador.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), args[i]);
    }
    return resultado;
  }

//#endregion Texto
}
