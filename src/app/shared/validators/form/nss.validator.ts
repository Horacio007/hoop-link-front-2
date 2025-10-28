import { AbstractControl, ValidationErrors } from '@angular/forms';

export function nssValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value || '';
  const regex = /^\d{11}$/;

  if (!valor) {
    return null; // otro validador como required lo manejará
  }

  return regex.test(valor) ? null : { nssInvalido: true };
}
