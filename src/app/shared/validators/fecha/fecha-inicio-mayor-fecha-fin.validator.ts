import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// export function fechasInicioMayorAFechaFinValidator(nombreCampoFechaInicio: string, nombreCampoFechaFin: string): ValidatorFn {
//   return (group: AbstractControl): ValidationErrors | null => {
//     const fechaInicio = group.get(nombreCampoFechaInicio)?.value;
//     const fechaFin = group.get(nombreCampoFechaFin)?.value;

//     if (!fechaInicio || !fechaFin) return null;

//     const inicio = new Date(fechaInicio);
//     const fin = new Date(fechaFin);

//     return inicio > fin ? { fechaInicioMayor: true } : null;
//   };
// }
export function fechasInicioMayorAFechaFinValidator(nombreCampoFechaInicio: string, nombreCampoFechaFin: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fechaInicioControl = group.get(nombreCampoFechaInicio);
    const fechaFinControl = group.get(nombreCampoFechaFin);

    if (!fechaInicioControl || !fechaFinControl) return null;

    const fechaInicio = new Date(fechaInicioControl.value);
    const fechaFin = new Date(fechaFinControl.value);

    if (!fechaInicioControl.value || !fechaFinControl.value) {
      // Evita limpiar errores si todavía están vacíos
      return null;
    }

    if (fechaInicio > fechaFin) {
      fechaInicioControl.setErrors({ ...fechaInicioControl.errors, fechaInicioMayor: true });
      return { fechaInicioMayor: true };
    } else {
      // Limpia el error fechaInicioMayor si ya no aplica
      const errors = fechaInicioControl.errors;
      if (errors) {
        delete errors['fechaInicioMayor'];
        if (Object.keys(errors).length === 0) {
          fechaInicioControl.setErrors(null);
        } else {
          fechaInicioControl.setErrors(errors);
        }
      }
      return null;
    }
  };
}

