import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonNote, IonModal, IonLabel, IonItem, IonList, IonTextarea  } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { ICatalogo } from 'src/app/shared/interfaces/catalogo/catalogo.interface';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { CatalogoService } from 'src/app/shared/services/catalogo/catalogo.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';
import { SkeletonComponent } from "src/app/shared/components/ionic/skeleton/skeleton.component";
import { ProfileImageComponent } from "src/app/shared/components/profile-image/profile-image.component";
import { LogLevel, SeverityMessageType, CommonMessages } from 'src/app/core/enums';
import { ErrorImagenPerfil } from 'src/app/shared/components/profile-image/enums/error-profile-image.enum';
import { CatalogoConstants } from 'src/app/shared/constants/catalogo/catalogo.constants';
import { SelectListSearchComponent } from "src/app/shared/components/ionic/select-list-search/select-list-search.component";

@Component({
  selector: 'app-jugador-perfil',
  templateUrl: './jugador-perfil.page.html',
  styleUrls: ['./jugador-perfil.page.scss'],
  standalone: true,
  imports: [IonTextarea ,IonModal, IonList, IonItem, IonLabel, IonNote, CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, ProfileImageComponent, IonInput, SelectListSearchComponent]
})
export class JugadorPerfilPage implements OnInit {

//#region Propiedades
  @Input({required: true}) form!: FormGroup;
  @Input({required: true}) cargandoData: boolean = true;
  @Input({ required: true }) allEstatusJugador!: ICatalogo[];

  public fotoPreviewUrl: string | null = null;

  private readonly _contextLog = 'JugadorPerfilPage';

  @ViewChild('modalEstatusJugador', { static: true }) modalEstatusJugador!: IonModal;
  public selectedEstatusJugadorNombre: string = 'Selecciona El Estatus Jugador';
  public selectedEstatusJugadorId: string | undefined = undefined;
  public estatusJugadorValido: boolean = false;
//#endregion

//#region Constructor
  constructor(
    private readonly _formularioUtils: FormularioUtilsService, private readonly _catalagoService: CatalogoService,
    private readonly _blockUserIService:BlockUiService, private readonly _toastService: ToastService,
    private readonly _logger: LoggerService,  ) { }
//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ngOnInit`, 'Inicializando componente.');
    this.form.valueChanges.subscribe(val => {
      this.cargaFotoPerfil();
      this.setValoresCatalogoEstatusJugador(this.form.get('estatusBusquedaJugador')?.value);
    });
  }

//#endregion

//#region Generales

  private setValoresCatalogoEstatusJugador(item: ICatalogo): void {
    this.selectedEstatusJugadorNombre = item.nombre;
    this.selectedEstatusJugadorId = item.id
  }

  private cargaFotoPerfil() {
    this.fotoPreviewUrl = this.form.get('fotoPerfil')?.value;
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaFotoPerfil`, 'Actualizando vista previa de foto de perfil', this.fotoPreviewUrl);
  }

  public esValido(campo: string):boolean| null {
    return this._formularioUtils.esCampoValido(this.form, campo);
  }

  public esOpcionalValido(campo: string):boolean| null {
    return this._formularioUtils.esCampoOpcionalValido(this.form, campo);
  }

  public getErrores(campo: string, nombreMostrar:string):string | null {
    const errores = this._formularioUtils.getCampoError(this.form, campo, nombreMostrar);
    return errores;
  }

  public onFileSelected(file: File): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> onFileSelected`, 'Archivo seleccionado', file.name);
    this.form.get('fotoPerfil')?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.fotoPreviewUrl = reader.result;
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> onFileSelected`, 'Vista previa generada');
      }
    };
    reader.readAsDataURL(file);
  }

  public handleFileTooLarge(size: number): void {
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    this._logger.log(LogLevel.Warn, `${this._contextLog} >> handleFileTooLarge`, `Archivo demasiado grande (${sizeMB} MB)`);
    this._toastService.showMessage(SeverityMessageType.Warn, `${CommonMessages.Atencion}: ${ErrorImagenPerfil.ArchivoDemasiadoGrande}`, `La imagen supera los 7 MB (actual: ${sizeMB} MB)`, 5000);
  }

  public openEstatusModal() {
    // Aquí puedes preparar data o asegurar que el catálogo esté listo
    // (Ej. this.currentSelectedEstatus = this.form.get('estatusBusquedaJugador')?.value?.id;)

    // Abrir el modal manualmente
    this.modalEstatusJugador.present();
  }

    /**
   * Maneja el cambio de selección del estado (un solo ID)
   * @param event El ID seleccionado (string) o undefined/null si se deseleccionó.
   */
  public estatusJugadorSelectionChanged(selectedId: string | undefined) {
    // 1. Almacenar el ID seleccionado
    this.selectedEstatusJugadorId = selectedId;

    // 2. Buscar el nombre para mostrarlo en la UI (UX)
    const estatusJugadorSeleccionado = this.allEstatusJugador!.find(e => e.id === selectedId);

    // 3. Actualizar la variable de la UI
    if (estatusJugadorSeleccionado) {
      this.selectedEstatusJugadorNombre = estatusJugadorSeleccionado.nombre;
      const estatusJugador: ICatalogo = {
        id: this.selectedEstatusJugadorId!,
        nombre: this.selectedEstatusJugadorNombre
      };

      this.form.controls['estatusBusquedaJugador'].setValue(estatusJugador);
      this.form.controls['estatusBusquedaJugador'].markAsTouched();
    } else {
      this.selectedEstatusJugadorId = 'Selecciona El Estatus Jugador';
      this.form.controls['estatusBusquedaJugador'].markAsTouched();

      if (this.esValido('estatusBusquedaJugador')) {
        this.estatusJugadorValido = true;
      }
    }

    // 4. Cerrar el modal
    this.modalEstatusJugador.dismiss();
  }

  public estatusJugadorCancel() {
    this.form.get('estatusBusquedaJugador')?.markAsTouched();

    if (this.esValido('estatusBusquedaJugador')) {
      this.estatusJugadorValido = true;
    }

    this.modalEstatusJugador.dismiss();
  }

//#endregion



}
