import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonNote, IonInput, IonInputPasswordToggle, IonButton, ModalController } from '@ionic/angular/standalone';
import { HeaderComponent } from "src/app/layouts/public-layout/components/header/header.component";
import { FooterComponent } from "src/app/layouts/components/footer/footer.component";
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ILogin } from 'src/app/core/auth/interfaces';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { LogLevel, SeverityMessageType, CommonMessages } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { correoElectronicoValidator } from 'src/app/shared/validators';
import { ViewWillEnter } from '@ionic/angular';
import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';
import { ModalTokenValidoComponent } from '../../components/modal-token-valido/modal-token-valido.component';
import { ModalRecuperaContrasenaComponent } from '../../components/modal-recupera-contrasena/modal-recupera-contrasena.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonNote, IonCardContent, IonCard, IonContent, CommonModule, FormsModule, HeaderComponent, FooterComponent, ReactiveFormsModule, IonInputPasswordToggle ]
})
export class LoginPage implements OnInit, OnDestroy, ViewWillEnter {
//#region Propiedades
  public esVisibleDialog:boolean = false;
  public formulario: FormGroup;

  private readonly _contextLog = 'LoginPageComponent';
  private _destroy$ = new Subject<void>();
//#endregion


//#region Constructor
  constructor(
    private readonly usuarioService:UsuarioService, private fb: FormBuilder,
    private readonly _formularioUtils:FormularioUtilsService, private readonly router:Router,
    private readonly toastService: ToastService, private readonly blockUIService:BlockUiService,
    private readonly authService: AuthService, private readonly _logger: LoggerService,
    private modalCtrl: ModalController,
  ) {
    this.formulario = this.fb.group({
      correo: new FormControl('', {
        validators: [Validators.required, correoElectronicoValidator()]
      }),
      contrasena: new FormControl('', {
        validators: [Validators.required]
      }),
    });

  }
//#endregion Constructor

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
    this.inicializa();
  }

  ionViewWillEnter(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  private inicializa() {
    this.muestraEsTokenValido();
  }

  private muestraEsTokenValido() {
    if (this.usuarioService.usuarioTokenValidado) {
      this.presentModal();
    }
  }

  public async enviar(): Promise<void>  {
    if(this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> enviar`, 'Formulario inválido.', this.formulario.value);
      return;
    } else if (this.formulario.valid) {
      this._formularioUtils.aplicaTrim(this.formulario);
      const credenciales = this.formulario.value as ILogin;
      this.blockUIService.show();
      this.authService.login(credenciales)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
       next: () => {
          this._logger.log(LogLevel.Info, `${this._contextLog} >> enviar`, 'Login exitoso.');
          this.formulario.reset();
          this.router.navigateByUrl('/desktop');
        },
        error: (error) => {
          this._logger.log(LogLevel.Error, `${this._contextLog} >> enviar`, 'Error en login.', error);
          this.toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, error.error.message);
          this.blockUIService.hide();
        },
        complete: () => {
          this.blockUIService.hide();
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

  public registrarme():void {
    this.router.navigateByUrl('/registro');
  }

  public muestraRecuperaContrasena() {
    this.presentModalOlvide();
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalTokenValidoComponent,
      cssClass: 'custom-modal-token-valido'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
  }

  async presentModalOlvide() {
    const modal = await this.modalCtrl.create({
      component: ModalRecuperaContrasenaComponent,
      cssClass: 'custom-modal-recupera-contrasena'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
  }

//#endregion Metodos

}
