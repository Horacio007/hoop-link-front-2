import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida que la edad del usuario cumpla con el mínimo requerido según el tipo de usuario.
 *
 * - **Jugador**: mínimo **12 años**
 * - **Otros tipos de usuario**: mínimo **21 años**
 *
 * @returns {ValidatorFn} Un error si la edad no cumple con el requisito.
 */
export function edadSegunTipoUsuarioValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    // Obtener valores del formulario
    const fechaNacimiento = formGroup.get('fechaNacimiento')?.value;
    const tipoUsuario = formGroup.get('tipoUsuario')?.value;

    // console.log('Validando edad: ', { fechaNacimiento, tipoUsuario });

    // Si falta alguno de los valores, no se valida (sin errores)
    if (!fechaNacimiento || !tipoUsuario || typeof tipoUsuario !== 'object' || !tipoUsuario.nombre) {
      return null;
    }

    // Convertir la fecha de nacimiento en un objeto Date
    const fechaNac = new Date(fechaNacimiento);
    if (isNaN(fechaNac.getTime())) {
      return null; // No validar si la fecha no es válida
    }

    const hoy = new Date();

    // Calcular la edad
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNac.getMonth();
    const diaDiferencia = hoy.getDate() - fechaNac.getDate();

    // Ajustar la edad si aún no ha cumplido años este año
    if (mesDiferencia < 0 || (mesDiferencia === 0 && diaDiferencia < 0)) {
      edad--;
    }

    // Determinar la edad mínima requerida según el tipo de usuario
    const nombreTipoUsuario = tipoUsuario.nombre.toLowerCase();
    const edadMinima = nombreTipoUsuario === 'jugador' ? 12 : 21;

    // console.log(`Edad calculada: ${edad}, Edad mínima requerida: ${edadMinima}`);

    // Validar si la edad cumple con el mínimo requerido
    if (edad < edadMinima) {
      return {
        edadInsuficiente: {
          requiredAge: edadMinima, // Edad mínima requerida
          actualAge: edad, // Edad real calculada
        },
      };
    }

    return null; // La edad es válida
  };
}
