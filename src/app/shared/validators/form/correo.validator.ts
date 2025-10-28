import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function correoElectronicoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Expresión regular para validar un correo electrónico básico
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const valido = correoRegex.test(control.value);

    // Si no es válido, retorna un error
    return !valido ? { correoInvalido: true } : null;
  };
}
