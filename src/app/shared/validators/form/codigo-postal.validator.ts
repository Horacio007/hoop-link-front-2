import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function codigoPostalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value?.toString() ?? '';

    const regex = /^\d{5}$/;

    return regex.test(valor) ? null : { codigoPostalInvalido: true };
  };
}
