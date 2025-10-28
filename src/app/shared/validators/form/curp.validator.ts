import { AbstractControl, ValidationErrors } from '@angular/forms';

export function curpValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value?.toUpperCase() || '';
  const regex = /^[A-Z][AEIOU][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]\d$/;

  if (!valor) {
    return null; // si está vacío, deja que otro validador (como required) lo valide
  }

  return regex.test(valor) ? null : { curpInvalido: true };
}
