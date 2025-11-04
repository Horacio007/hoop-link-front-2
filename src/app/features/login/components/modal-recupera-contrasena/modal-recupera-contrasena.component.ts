import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LogLevel, SeverityMessageType, CommonMessages } from 'src/app/core/enums';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';
import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { IRecuperaContrasena } from 'src/app/shared/interfaces/usuario/registro.interface';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { correoElectronicoValidator } from 'src/app/shared/validators';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonIcon, ModalController, IonButtons, IonCard, IonCardContent, IonNote, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-modal-recupera-contrasena',
  templateUrl: './modal-recupera-contrasena.component.html',
  styleUrls: ['./modal-recupera-contrasena.component.scss'],
  imports: [IonNote, IonCardContent, IonCard, IonButtons, IonIcon, IonContent, IonButton, IonTitle, IonToolbar, IonHeader, ReactiveFormsModule, IonIcon, IonInput]
})
export class ModalRecuperaContrasenaComponent  implements OnInit, OnDestroy {

//#region Propiedades
  @Input() esVisibleRecuperaContrasenaDialog!: boolean;
  @Output() esVisibleRecuperaContrasenaDialogChange = new EventEmitter<boolean>();
  public formulario: FormGroup;

  private readonly _contextLog = 'ModalRecuperaContrasenaComponent';
  private _destroy$ = new Subject<void>();
//#endregion

//#region Constructor
  constructor(
    private readonly usuarioService:UsuarioService, private fb: FormBuilder,
    private readonly _formularioUtils:FormularioUtilsService, private readonly toastService: ToastService,
    private readonly blockUserIService:BlockUiService, private readonly _logger: LoggerService,
    private modalCtrl: ModalController,
  ) {
    this.formulario = this.fb.group({
      correo: new FormControl('', {
        validators: [Validators.required, correoElectronicoValidator()]
      })
    });

    addIcons({
      closeOutline
    });

  }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.resetForm();
    this.esVisibleRecuperaContrasenaDialogChange.emit(false);
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }

//#endregion

//#region Generales
  public enviar():void {
    if(this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> enviar`, 'Formulario inválido.', this.formulario.value);
      return;
    } else if (this.formulario.valid) {
      this._formularioUtils.aplicaTrim(this.formulario);
      const registro = this.formulario.value as IRecuperaContrasena;
      this.blockUserIService.show();
      this.usuarioService.recuperaContrasena(registro)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response:IResponse<any>) => {
          this._logger.log(LogLevel.Info, `${this._contextLog} >> enviar`, 'Correo de recuperación enviado.', response);
          this.toastService.showMessage(SeverityMessageType.Success, '¡Genial 📩! Correo enviado.', response.mensaje, 7500);
          this.formulario.reset();
          this.blockUserIService.hide();
          this.onDidDismiss();
          this.esVisibleRecuperaContrasenaDialogChange.emit(false);
        },
        error: (error) => {
          this._logger.log(LogLevel.Error, `${this._contextLog} >> enviar`, 'Error al enviar correo.', error);
          this.toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, error.error.message);
          this.blockUserIService.hide();
        }
      });
    }
  }

  public esValido(campo: string):boolean| null {
    return this._formularioUtils.esCampoValido(this.formulario, campo);
  }

  public getErrores(campo: string, nombreMostrar:string):string | null {
    const errores = this._formularioUtils.getCampoError(this.formulario, campo, nombreMostrar);
    return errores;
  }

  private resetForm() {
    this.formulario.reset();
  }

  onDidDismiss() {
    this.modalCtrl.dismiss(false);
    this.resetForm();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> onHide`, 'Dialog cerrado y formulario reseteado.');
  }

  onHide() {
    this.esVisibleRecuperaContrasenaDialogChange.emit(false);
  }

//#endregion

}
