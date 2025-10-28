import { ValidatorFn, AbstractControl, ValidationErrors, FormArray } from "@angular/forms";

export function minimoTamanioFBArray(min: number): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (formArray instanceof FormArray) {
      return formArray.length >= min ? null : { minLengthArray: { requiredLength: min } };
    }
    return null;
  };
}
