import { AbstractControl, ValidationErrors } from '@angular/forms';

export function rfcValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value?.toUpperCase() || '';

  const regex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

  if (!valor) {
    return null; // no validar si está vacío, deja que otro validador (ej. required) lo haga
  }

  return regex.test(valor) ? null : { rfcInvalido: true };
}
