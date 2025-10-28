import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function contraseniaFuerteValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password && password.length >= 8;

    if (password && !(hasLowerCase && hasUpperCase && hasNumber && isLongEnough)) {
      return { contraseniaDebil: true };
    }

    return null;
  };
}
