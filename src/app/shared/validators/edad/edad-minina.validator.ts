import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para calcular la diferencia de años entre dos fechas.
 * Verifica que el usuario tenga al menos la edad mínima requerida.
 *
 * @param edadMinima La edad mínima requerida
 * @returns Un ValidatorFn que se puede usar en Angular Reactive Forms
 */
export function edadMinimaValidator(edadMinima: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    if (isNaN(fechaNacimiento.getTime())) {
      return { fechaInvalida: true }; // ❌ Si la fecha no es válida
    }

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    // Verifica si el cumpleaños ya pasó en el año actual
    if (
      hoy.getMonth() < fechaNacimiento.getMonth() ||
      (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }

    return edad >= edadMinima ? null : { edadMinima: { requiredAge: edadMinima, actualAge: edad } };
  };
}
