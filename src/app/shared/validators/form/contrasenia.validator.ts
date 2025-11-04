import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function contraseniaFuerteValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value || ''; // Aseguramos que sea una cadena vacía si es null/undefined

    // Objeto para almacenar los errores específicos
    const errors: ValidationErrors = {};

    // 1. Validar longitud mínima
    const isLongEnough = password.length >= 8;
    if (!isLongEnough) {
      errors['minimoOchoCaracteres'] = true;
    }

    // 2. Validar minúscula
    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) {
      errors['letraMinuscula'] = true;
    }

    // 3. Validar mayúscula
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      errors['letraMayuscula'] = true;
    }

    // 4. Validar número
    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
      errors['unNumero'] = true;
    }

    // Si el objeto 'errors' tiene alguna propiedad, devolvemos los errores.
    // Si está vacío, la contraseña es válida, devolvemos null.
    return Object.keys(errors).length ? errors : null;
  };
}
