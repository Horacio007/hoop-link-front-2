import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-color-picker-personalizado',
  templateUrl: './color-picker-personalizado.component.html',
  styleUrls: ['./color-picker-personalizado.component.scss'],
  providers: [
    {
      // Esto registra el componente para que funcione con ngModel
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerPersonalizadoComponent),
      multi: true
    }
  ]
})
export class ColorPickerPersonalizadoComponent implements ControlValueAccessor {

  // Propiedad que guarda el valor del color (ej: '#ff0000')
  @Input() color: string = '#000000';
  @Input() disabled: boolean = false; // Permite deshabilitar el selector

  // Funciones placeholder que serán reemplazadas por Angular Forms
  onChange = (color: any) => {};
  onTouched = () => {};

  constructor() {}

  /**
   * Escribe el valor que viene desde el ngModel hacia la propiedad interna.
   */
  writeValue(value: any): void {
    if (value) {
      this.color = value;
    }
  }

  /**
   * Registra una función para cuando el valor cambia.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra una función para cuando el control es "tocado" (interacción del usuario).
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Habilita o deshabilita el control.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Captura el cambio de color del input nativo y lo emite al formulario.
   */
  onColorChange(event: any): void {
    this.color = event.target.value;
    this.onChange(this.color); // Emite el nuevo valor al ngModel
    this.onTouched();
  }
}
