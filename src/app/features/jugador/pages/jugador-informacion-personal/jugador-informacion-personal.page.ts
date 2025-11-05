import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ITab } from 'src/app/shared/components/responsive-tabs/interfaces/responsive-tabs.interface';
import { ResponsiveTabsComponent } from 'src/app/shared/components/responsive-tabs/responsive-tabs.component';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { InformacionPersonalService } from 'src/app/core/services/informacion-personal/informacion-personal.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';

@Component({
  selector: 'app-jugador-informacion-personal',
  templateUrl: './jugador-informacion-personal.page.html',
  styleUrls: ['./jugador-informacion-personal.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ResponsiveTabsComponent]
})
export class JugadorInformacionPersonalPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  private readonly _contextLog = 'JugadorInformacionPersonalPage';
  public formularioPrincipal!: FormGroup;
  public tabs:ITab[] = [
    {
      tabName: 'Perfil',
      icon: 'fa-solid fa-id-card'
    },
    {
      tabName: 'Fuerza y Resistencia',
      icon: 'fa-solid fa-dumbbell',
    },
    {
      tabName: 'Basketball',
      icon: 'fa-solid fa-basketball',
    },
    {
      tabName: 'Experiencia',
      icon: 'fa-solid fa-award',
    },
    {
      tabName: 'Visión',
      icon: 'fa-solid fa-crosshairs',
    },
    {
      tabName: 'Tests',
      icon: 'fa-solid fa-brain',
    },
    {
      tabName: 'Videos',
      icon: 'fa-solid fa-video',
    },
    {
      tabName: 'Redes',
      icon: 'fa-solid fa-globe',
    },
  ];
  public cargandoData = true;
  private readonly _destroy$ = new Subject<void>();
//#endregion

//#region Constructor
  constructor(
    private readonly _fb: FormBuilder, private readonly _toastService: ToastService,
    private readonly _blockUserIService:BlockUiService, private readonly _formularioService:FormularioUtilsService,
    private readonly _informacionPersonalService:InformacionPersonalService, private readonly _authService:AuthService,
    private readonly _logger: LoggerService
  ) { }
//#endregion


//#region Ng
  ngOnInit(): void {
    this.inicializa();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
  }

  ionViewWillEnter() {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  private inicializa(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> inicializa`, 'Preparando formulario y cargando datos...');
    this.prepareFormularios();
    // this.cargaDatos();
  }

  private prepareFormularios(): void {
    this.formularioPrincipal = this._fb.group({
      perfil: this._fb.group({
        informacionPersonalId: new FormControl(null),
        usuarioId: new FormControl(null),
        fotoPerfil: new FormControl(null),
        altura: new FormControl(null, Validators.required),
        peso: new FormControl(null, Validators.required),
        estatusBusquedaJugador: new FormControl('', Validators.required),
        medidaMano: new FormControl(null, Validators.required),
        largoBrazo: new FormControl(null, Validators.required),
        quienEres: new FormControl(null, Validators.required),
      }),
      fuerzaResistencia: this._fb.group({
        alturaSaltoVertical: new FormControl(null, Validators.required),
        distanciaSaltoHorizontal: new FormControl(null, Validators.required),
        pesoBenchPress: new FormControl(null),
        pesoSquats: new FormControl(null),
        pesoPressMilitar: new FormControl(null),
        pesoRepeticionBenchPress: new FormControl(null),
        pesoRepeticionSquats: new FormControl(null),
        pesoRepeticionPressMilitar: new FormControl(null),
        tiempoDistanciaCienMts: new FormControl(null),
        tiempoDistanciaUnKm: new FormControl(null),
        tiempoDistanciaTresKm: new FormControl(null),
        tiempoDistanciaCincoKm: new FormControl(null),
      }),
      basketball: this._fb.group({
        anioEmpezoAJugar: new FormControl(null, Validators.required),
        manoJuego: new FormControl(false, Validators.required),
        posicionJuegoUno: new FormControl('', Validators.required),
        posicionJuegoDos: new FormControl('', Validators.required),
        clavas: new FormControl(false, Validators.required),
        puntosPorJuego: new FormControl(null),
        asistenciasPorJuego: new FormControl(null),
        rebotesPorJuego: new FormControl(null),
        porcentajeTirosMedia: new FormControl(null),
        porcentajeTirosTres: new FormControl(null),
        porcentajeTirosLibres: new FormControl(null),
      }),
      experiencia: this._fb.group({
        desdeCuandoJuegas: new FormControl(null, Validators.required),
        horasEntrenamientoSemana: new FormControl(null),
        horasGymSemana: new FormControl(null),
        pertenecesClub: new FormControl(false, Validators.required) ,
        nombreClub: new FormControl(null) ,
        historialEquipos: this._fb.array([]) ,
        historialEntrenadores: this._fb.array([]) ,
        logrosClave: this._fb.array([]) ,
      }),
      vision: this._fb.group({
        objetivos: new FormControl(null, Validators.required),
        valores: new FormControl(null, Validators.required),
      }),
      videos: this._fb.group({
        videoBotando: new FormControl(null),
        videoTirando: new FormControl(null),
        videoColada: new FormControl(null),
        videoEntrenando: new FormControl(null),
        videoJugando: new FormControl(null),
      }),
      redes: this._fb.group({
        facebook: new FormControl(null),
        instagram: new FormControl(null),
        tiktok: new FormControl(null),
        youtube: new FormControl(null),
      }),
    });

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> prepareFormularios`, 'Formulario principal preparado.');

  }
//#endregion

}
