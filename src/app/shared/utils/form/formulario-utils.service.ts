import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormularioUtilsService {

  //#region Propiedades

  //#endregion Propiedades

  //#region Constructor
  constructor() { }
  //#endregion Constructor

  //#region Formularios
  /**
   * Valida si un campo es inválido y ha sido tocado (útil para mostrar errores)
   */
  public esCampoValido(formulario: FormGroup | AbstractControl, campo: string): boolean | null {
    const control = formulario.get(campo);
    if (!control) return null;

    return control.invalid && (control.dirty || control.touched);
  }

  public esCampoOpcionalValido(formulario: FormGroup, campo: string): boolean {
    const control = formulario.get(campo);
    return !!control && control.valid && (control.dirty || control.touched) && !!control.value;
  }


  /**
   * Retorna mensajes de error personalizados de un campo
   */
  public getCampoError(formulario: FormGroup | AbstractControl, campo: string, nombreMostrar: string): string | null {
    const control = formulario.get(campo);
    if (!control) return null;

    const errors = control.errors || {};
    const mensajes: string[] = [];

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          mensajes.push(`* El campo ${nombreMostrar} es obligatorio.`);
          break;
        case 'minlength':
          mensajes.push(`* Mínimo ${errors['minlength'].requiredLength} caracteres.`);
          break;
        case 'edadMinima':
          mensajes.push(`* Debes tener al menos ${errors['edadMinima'].requiredAge} años.<br> Actualmente tienes ${errors['edadMinima'].actualAge} años.`);
          break;
        case 'correoInvalido':
        case 'contraseniaDebil':
        case 'rfcInvalido':
        case 'curpInvalido':
        case 'nssInvalido':
        case 'codigoPostalInvalido':
          mensajes.push(`* El campo ${nombreMostrar} no tiene un formato válido.`);
          break;
        case 'fechaMayorHoy':
          mensajes.push(`* El campo ${nombreMostrar} no debe ser mayor a hoy.`);
          break;
      }
    }

    // Validación a nivel de grupo si aplica
    const errorEdad = formulario.errors?.['edadInsuficiente'];
    if (errorEdad && (campo === 'tipoUsuario')) {
      mensajes.push(`* Debes tener al menos ${errorEdad.requiredAge} años.<br> Actualmente tienes ${errorEdad.actualAge} años.`);
    }

    return mensajes.length > 0 ? mensajes.join('<br>') : null;
  }

  /**
   * Aplica trim() a todos los controles de texto de un FormGroup
   */
  public aplicaTrim(grupo: FormGroup): void {
    Object.keys(grupo.controls).forEach(key => {
      const control = grupo.get(key);
      if (control && control instanceof FormControl && typeof control.value === 'string') {
        control.setValue(control.value.trim(), { emitEvent: false });
      }
    });
  }

  /**
   * Método publico que obtiene el control correctamente ya sea en FormGroup o FormArray
   */
  public getControl(grupo: AbstractControl, campo: string): AbstractControl | null {
    if (grupo instanceof FormGroup || grupo instanceof FormArray) {
      return grupo.get(campo) ?? null;
    }
    return null;
  }

  /**
   * Método publico que regresa si tiene errores un FormGroup o FormArray
   */
  public tieneErroresEnControlEspecifico(
    controlRaiz: AbstractControl,
    nombreControl: string
  ): boolean {
    const controlEspecifico = controlRaiz.get(nombreControl);

    if (!controlEspecifico) {
      console.warn(`El control con el nombre "${nombreControl}" no se encontró.`);
      return false;
    }

    return this.tieneErroresEnAlgunControl(controlEspecifico);
  }

  public tieneErroresEnAlgunControl(control: AbstractControl): boolean {
    if (control.errors) {
      return true;
    }

    if (control instanceof FormGroup) {
      const grupo = control as FormGroup;
      for (const nombreControl in grupo.controls) {
        if (grupo.controls[nombreControl]) {
          if (this.tieneErroresEnAlgunControl(grupo.controls[nombreControl])) {
            return true;
          }
        }
      }
    }

    if (control instanceof FormArray) {
      const array = control as FormArray;
      for (const controlArray of array.controls) {
        if (this.tieneErroresEnAlgunControl(controlArray)) {
          return true;
        }
      }
    }

    if (control instanceof FormArray) {
      const array = control as FormArray;
      if (array.length == 0) return true;
    }

    return false;
  }

//#endregion Formularios

}
