import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ImagenPerfilTipoArchivoPermitido } from './enums/tipo-archivo-permitido.enum';

import { LoggerService } from '../../../core/services/logger/logger.service';
import { LogLevel } from '../../../core/enums';

@Component({
  selector: 'app-profile-image',
  imports: [
  ],
  templateUrl: './profile-image.component.html',
  styleUrl: './profile-image.component.css'
})
export class ProfileImageComponent implements OnInit  , OnDestroy {
//#region Propiedades
  @Input() archivosPermitidos:ImagenPerfilTipoArchivoPermitido = ImagenPerfilTipoArchivoPermitido.Imagenes;
  @Input() permiteCargaMultiple:boolean = false;
  @Input() imageUrl: string | null = null;

  @Input({required: true }) isReadOnly: boolean = false;

  @Output() imageSelected = new EventEmitter<File>();
  @Output() fileTooLarge = new EventEmitter<number>();

  private tamanioImagen: number = 7;

  imageUrlPreview: string | null = null;
  isPreviewOpen = false;

  private readonly _contextLog = 'ProfileImageComponent';

//#endregion

//#region Constructor
  constructor(
    private readonly _logger: LoggerService
  ) { }
//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado.`);
  }

  ngOnDestroy(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> onFileSelected`, 'No se seleccionó ningún archivo.');
      return;
    }

    const MAX_SIZE_BYTES = this.tamanioImagen * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> onFileSelected`, `Archivo demasiado grande: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      this.fileTooLarge.emit(file.size);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrlPreview = reader.result as string;
      this.imageSelected.emit(file); // Emitimos el base64 válido
      this._logger.log(LogLevel.Info, `${this._contextLog} >> onFileSelected`, `Archivo seleccionado correctamente: ${file.name}`);
    };

    reader.onerror = (error) => {
      this._logger.log(LogLevel.Error, `${this._contextLog} >> onFileSelected`, 'Error al leer el archivo.', error);
    };

    reader.readAsDataURL(file);
  }

  openPreview() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> openPreview`, 'Mostrando previsualización de imagen.');
    document.body.style.overflow = 'hidden'
    this.isPreviewOpen = true;
  }

  closePreview() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> closePreview`, 'Cerrando previsualización de imagen.');
    document.body.style.overflow = 'auto';
    this.isPreviewOpen = false;
  }

//#endregion
}
