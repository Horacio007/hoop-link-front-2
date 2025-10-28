import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fechaNoMayorAHoy(control: AbstractControl): ValidationErrors | null {
  const fecha = new Date(control.value);
  const hoy = new Date();

  // Opcional: resetear horas para comparar solo fechas
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  return fecha > hoy ? {fechaMayorHoy: { fechaMayorAHoy: true, hoy:hoy } } : null;
}
