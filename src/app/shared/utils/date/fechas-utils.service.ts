import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FechasUtilsService {

  //#region Propiedades

  //#endregion Propiedades

  //#region Constructor
  constructor() { }
  //#endregion Constructor

  //#region Fechas
  diferenciaEnAniosEntreFechas(fechaInicial:Date, fechaFinal:Date): number {
    let diferencia = fechaFinal.getFullYear() - fechaInicial.getFullYear();
    const mesActual = fechaFinal.getMonth();
    const diaActual = fechaFinal.getDate();
    const mesInicial = fechaInicial.getMonth();
    const diaInicial = fechaInicial.getDate();

    // Restar un año si aún no ha pasado el cumpleaños
    if (mesActual < mesInicial || (mesActual === mesInicial && diaActual < diaInicial)) {
      diferencia--;
    }

    return diferencia;
  }

  esFechaValida(fecha: string) {
    // Validar formato con RegExp
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = fecha.match(regex);
    if (!match) {
      return false;
    } else {
      console.log(fecha);
    }

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10) - 1; // Los meses empiezan desde 0
    const anio = parseInt(match[3], 10);

    const fechaObj = new Date(anio, mes, dia);

    // Validar que sea una fecha real
    return (
      fechaObj.getFullYear() === anio &&
      fechaObj.getMonth() === mes &&
      fechaObj.getDate() === dia
    );
  }
  //#endregion Fechas

}
