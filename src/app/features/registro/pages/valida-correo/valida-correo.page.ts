import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LogLevel, SeverityMessageType } from 'src/app/core/enums';
import { IResponseError } from 'src/app/core/interfaces/error/error.interface';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import { ViewWillEnter } from '@ionic/angular';
import { FooterComponent } from "src/app/layouts/components/footer/footer.component";
import { HeaderComponent } from "src/app/layouts/public-layout/components/header/header.component";

@Component({
  selector: 'app-valida-correo',
  templateUrl: './valida-correo.page.html',
  styleUrls: ['./valida-correo.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, FooterComponent, HeaderComponent]
})
export class ValidaCorreoPage implements OnInit, AfterViewInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  private token!:string;
  public muestraLoader:boolean = true;
  public error:string = '';

  private readonly _contextLog = 'ValidaCorreoComponent';
  private _destroy$ = new Subject<void>();
//#endregion Propiedades

//#region Constructor
  constructor(
    private routeActive: ActivatedRoute,
    private readonly usuarioService:UsuarioService,
    private readonly toastService: ToastService,
    private readonly router:Router,
    private readonly _logger: LoggerService,
    private _cdr: ChangeDetectorRef
  ) { }
//#endregion

//#region Ng
  ngOnInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
    this.routeActive.queryParamMap
    .pipe(takeUntil(this._destroy$))
    .subscribe(params => {
      this.token = params.get('token') ?? '';
    });
  }

  ngAfterViewInit(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngAfterViewInit`, 'Componente despues de inicializado.');
  }

  ionViewWillEnter(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
    this.validaToken();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  private validaToken() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> validaToken`, 'Validando token.');

    this.usuarioService.validaToken(this.token)
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (response:IResponse<string>) => {
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> validaToken`, 'Toekn válido.', response);
        this.toastService.showMessage(SeverityMessageType.Success, 'Excelente', response.mensaje);
        this.usuarioService.usuarioTokenValidado = true;
        setTimeout(() => this.router.navigateByUrl('/login'), 1500);
      },
      error: (error:IResponseError) => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> validaToken`, 'Error al validar token', error);
        // 🚨 ENVOLVER LA ACTUALIZACIÓN EN setTimeout(0)
        setTimeout(() => {
          this.muestraLoader = false;
          this.error = error.error.message;

          // Mantenemos detectChanges para doble seguridad
          this._cdr.detectChanges();
        }, 0);
      }
    });
  }
//#endregion

}
