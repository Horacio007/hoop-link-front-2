import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular';
import { CommonMessages, LogLevel, SeverityMessageType } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ITab } from 'src/app/shared/components/responsive-tabs/interfaces/responsive-tabs.interface';
import { ResponsiveTabsComponent } from 'src/app/shared/components/responsive-tabs/responsive-tabs.component';
import { finalize, forkJoin, Subject, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { InformacionPersonalService } from 'src/app/core/services/informacion-personal/informacion-personal.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';
import { IInformacinPersonal, IRegistraInformacionPersonal, IPerfilInformacionPersonal, IFuerzaResistenciaInformacionPersonal, IBasketballInformacionPersonal, IExperienciaInformacionPersonal, IVisionInformacionPersonal, IRedesSocialesInformacionPersonal } from 'src/app/shared/interfaces/informacion-personal';
import { IVideosInformacionPersonal } from 'src/app/shared/interfaces/informacion-personal/videos-informacion-personal.interface';
import { InfoPersonalSummary, InfoPersonalDetail } from '../../constants';
import { JugadorConstants } from '../../constants/general/general.constants';
import { JugadorPerfilPage } from "./jugador-perfil/jugador-perfil.page";
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { TooltipInfoComponent } from "src/app/shared/components/tooltip-info/tooltip-info.component";
import { CatalogoService } from '../../../../shared/services/catalogo/catalogo.service';
import { ICatalogo } from 'src/app/shared/interfaces/catalogo/catalogo.interface';
import { JugadorFuerzaResistenciaPage } from "./jugador-fuerza-resistencia/jugador-fuerza-resistencia.page";
import { JugadorBasketballPage } from "./jugador-basketball/jugador-basketball.page";
import { JugadorExperienciaPage } from "./jugador-experiencia/jugador-experiencia.page";

@Component({
  selector: 'app-jugador-informacion-personal',
  templateUrl: './jugador-informacion-personal.page.html',
  styleUrls: ['./jugador-informacion-personal.page.scss'],
  standalone: true,
  imports: [IonIcon, CommonModule, FormsModule, ResponsiveTabsComponent, ReactiveFormsModule, JugadorPerfilPage, TooltipInfoComponent, JugadorFuerzaResistenciaPage, JugadorBasketballPage, JugadorExperienciaPage]
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
  public estatusJugadorCatalogo: ICatalogo[] | undefined;
  public posicionJugadorCatalogo: ICatalogo[] | undefined;
  private readonly _destroy$ = new Subject<void>();

  private catalogosCargados: { [key: string]: boolean } = {};
//#endregion

//#region Constructor
  constructor(
    private readonly _fb: FormBuilder, private readonly _toastService: ToastService,
    private readonly _blockUserIService:BlockUiService, private readonly _formularioService:FormularioUtilsService,
    private readonly _informacionPersonalService:InformacionPersonalService, private readonly _authService:AuthService,
    private readonly _logger: LoggerService, private readonly _catalogoService: CatalogoService,
  ) {

    addIcons({
      informationCircleOutline
    });

  }
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
    this.cargaDatos();
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

  private cargaDatos() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos`, 'Obteniendo información personal...');

    // 1. Definir los Observables a esperar
    const dataPrincipal$ = this._informacionPersonalService.getInformacionPersonal().pipe(
      takeUntil(this._destroy$)
    );

    // Asumo que tienes un _catalogoService inyectado
    const catalogoEstatus$ = this._catalogoService.getAllEstatusBusquedaJugador().pipe(
      takeUntil(this._destroy$)
    );

    // 2. Usar forkJoin para esperar ambos
    forkJoin({
      dataPrincipal: dataPrincipal$,
      catalogoEstatus: catalogoEstatus$
    })
    .pipe(
      // El finalize se ejecuta SOLO después de que forkJoin termine (éxito o error)
      finalize(() => {
          this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos`, 'Finalizada la carga CRÍTICA. Ocultando Skeleton.');
          this.cargandoData = false;
      })
    ).subscribe({
      next: (results: { dataPrincipal: IResponse<IInformacinPersonal>, catalogoEstatus: ICatalogo[] }) => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> cargaDatos`, 'Datos recibidos', results);

        this.estatusJugadorCatalogo = results.catalogoEstatus;


        const { data } = results.dataPrincipal;

        // preparo la informacion
        const { perfil, fuerzaResistencia, basketball, experiencia, vision, videos, redes } = this.preparaSeccionesToSetEnFormulario(data);

        // actualizo la informacion
        this.setPerfilEnFormulario(perfil);
        this.setFuerzaResistenciaEnFormulario(fuerzaResistencia);
        this.setBasketballEnFormulario(basketball);
        this.setExperienciaEnFormulario(experiencia);
        this.setVisionEnFormulario(vision);
        this.setVideosEnFormulario(videos);
        this.setRedesEnFormulario(redes);
      },
      error: (error) => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> cargaDatos`, 'Error al obtener información personal', error);
        this._toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, 'No se pudo cargar la información personal.');
      }
    });
  }

  private preparaSeccionesToSetEnFormulario(infoPersonal?: IInformacinPersonal): IRegistraInformacionPersonal {
    const perfil: IPerfilInformacionPersonal = {
      altura: infoPersonal?.altura,
      peso: infoPersonal?.peso,
      estatusBusquedaJugador: infoPersonal?.estatusBusquedaJugador ?? { id: '', nombre: ''},
      largoBrazo: infoPersonal?.largoBrazo,
      medidaMano: infoPersonal?.medidaMano,
      quienEres: infoPersonal?.quienEres ?? '',
      informacionPersonalId: infoPersonal?.informacionPersonalId,
      fotoPerfil: infoPersonal?.fotoPerfilPublicUrl
    }

    const fuerzaResistencia: IFuerzaResistenciaInformacionPersonal = {
      alturaSaltoVertical: infoPersonal?.alturaSaltoVertical,
      distanciaSaltoHorizontal: infoPersonal?.distanciaSaltoHorizontal,
      pesoBenchPress: infoPersonal?.pesoBenchPress,
      pesoSquats: infoPersonal?.pesoSquats,
      pesoPressMilitar: infoPersonal?.pesoPressMilitar,
      pesoRepeticionBenchPress: infoPersonal?.pesoRepeticionBenchPress,
      pesoRepeticionSquats: infoPersonal?.pesoRepeticionSquats,
      pesoRepeticionPressMilitar: infoPersonal?.pesoRepeticionPressMilitar,
      tiempoDistanciaCienMts: infoPersonal?.tiempoDistanciaCienMts,
      tiempoDistanciaUnKm: infoPersonal?.tiempoDistanciaUnKm,
      tiempoDistanciaTresKm: infoPersonal?.tiempoDistanciaTresKm,
      tiempoDistanciaCincoKm: infoPersonal?.tiempoDistanciaCincoKm,
    }

    const basketball: IBasketballInformacionPersonal = {
      anioEmpezoAJugar: infoPersonal?.anioEmpezoAJugar ?? undefined,
      manoJuego: infoPersonal?.manoJuego ?? false,
      posicionJuegoUno: infoPersonal?.posicionJuegoUno ?? { id: '', nombre: ''},
      posicionJuegoDos: infoPersonal?.posicionJuegoDos ?? { id: '', nombre: ''},
      clavas: infoPersonal?.clavas ?? false,
      puntosPorJuego: infoPersonal?.puntosPorJuego,
      asistenciasPorJuego: infoPersonal?.asistenciasPorJuego,
      rebotesPorJuego: infoPersonal?.rebotesPorJuego,
      porcentajeTirosMedia: infoPersonal?.porcentajeTirosMedia,
      porcentajeTirosTres: infoPersonal?.porcentajeTirosTres,
      porcentajeTirosLibres: infoPersonal?.porcentajeTirosLibres,
    }

    const experiencia: IExperienciaInformacionPersonal = {
      desdeCuandoJuegas: infoPersonal?.desdeCuandoJuegas ?? undefined,
      horasEntrenamientoSemana: infoPersonal?.horasEntrenamientoSemana ,
      horasGymSemana: infoPersonal?.horasGymSemana ,
      pertenecesClub: infoPersonal?.pertenecesClub ?? false ,
      nombreClub: infoPersonal?.nombreClub ,
      historialEquipos: infoPersonal?.historialEquipos ,
      historialEntrenadores: infoPersonal?.historialEntrenadores ,
      logrosClave: infoPersonal?.logrosClave,
    }

    const vision: IVisionInformacionPersonal = {
      objetivos: infoPersonal?.objetivos ?? '',
      valores: infoPersonal?.valores ?? '',
    }

    const videos: IVideosInformacionPersonal = {
      videoBotando: infoPersonal?.videoBotandoPublicUrl,
      videoTirando: infoPersonal?.videoTirandoPublicUrl,
      videoColada: infoPersonal?.videoColadaPublicUrl,
      videoEntrenando: infoPersonal?.videoEntrenandoPublicUrl,
      videoJugando: infoPersonal?.videoJugandoPublicUrl,
    }

    const redes: IRedesSocialesInformacionPersonal = {
      facebook: infoPersonal?.facebook,
      instagram: infoPersonal?.instagram,
      tiktok: infoPersonal?.tiktok,
      youtube: infoPersonal?.youtube,
    }

    const infoPersonalPreparada: IRegistraInformacionPersonal = {
      perfil,
      fuerzaResistencia,
      basketball,
      experiencia,
      vision,
      videos,
      redes,
    }

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> preparaSeccionesToSetEnFormulario`, 'Formulario preparado con datos del servidor.');

    return infoPersonalPreparada;
  }

  private setRedesEnFormulario(redes: IRedesSocialesInformacionPersonal) {
    this.redes.patchValue({
      facebook: redes?.facebook,
      instagram: redes?.instagram,
      tiktok: redes?.tiktok,
      youtube: redes?.youtube,
    });

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> setRedesEnFormulario`, 'Formulario actualizado con datos del servidor.');
  }

  private setVideosEnFormulario(videos: IVideosInformacionPersonal) {
    this.videos.patchValue({
      videoBotando: videos.videoBotando,
      videoTirando: videos.videoTirando,
      videoColada: videos.videoColada,
      videoEntrenando: videos.videoEntrenando,
      videoJugando: videos.videoJugando,
    });

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> setVideosEnFormulario`, 'Formulario actualizado con datos del servidor.');
  }

  private setVisionEnFormulario(vision: IVisionInformacionPersonal) {
    this.vision.patchValue({
      objetivos: vision?.objetivos,
      valores: vision?.valores,
    });

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> setVisionEnFormulario`, 'Formulario actualizado con datos del servidor.');
  }

  private setExperienciaEnFormulario(experiencia: IExperienciaInformacionPersonal) {
    this.experiencia.patchValue({
      desdeCuandoJuegas: experiencia?.desdeCuandoJuegas !== undefined ? new Date(experiencia?.desdeCuandoJuegas) : undefined,
      horasEntrenamientoSemana: experiencia?.horasEntrenamientoSemana,
      horasGymSemana: experiencia?.horasGymSemana,
      pertenecesClub: experiencia?.pertenecesClub,
      nombreClub: experiencia?.nombreClub,
    });

    // patcheo los que pueden tener mas de uno
    const { historialEntrenadores, historialEquipos, logrosClave } = experiencia;

    if (Array.isArray(historialEquipos)) {
      // --- Historial de eventos ---
      const historialEquiposFormArray = this.experiencia.get('historialEquipos') as FormArray;
      historialEquiposFormArray.clear();
      experiencia.historialEquipos?.forEach(evento => {
        historialEquiposFormArray.push(this._fb.group({
          id: [evento.id],
          nombre: [evento.nombre],
        }));
      });
    }

    if (Array.isArray(historialEntrenadores)) {
      // --- Historial de entrenadores ---
      const historialEntrenadoresFormArray = this.experiencia.get('historialEntrenadores') as FormArray;
      historialEntrenadoresFormArray.clear();
      experiencia.historialEntrenadores?.forEach(entrenador => {
        historialEntrenadoresFormArray.push(this._fb.group({
          id: [entrenador.id],
          nombre: [entrenador.nombre],
        }));
      });
    }

    if (Array.isArray(logrosClave)) {
      // --- Logros clave ---
      const logrosClaveFormArray = this.experiencia.get('logrosClave') as FormArray;
      logrosClaveFormArray.clear();
      experiencia.logrosClave?.forEach(logro => {
        logrosClaveFormArray.push(this._fb.group({
          id: [logro.id],
          nombre: [logro.nombre],
        }));
      });
    }

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> setExperienciaEnFormulario`, 'Formulario actualizado con datos del servidor.');
  }

  private setBasketballEnFormulario(basketball: IBasketballInformacionPersonal) {
    this.basketball.patchValue({
      anioEmpezoAJugar: basketball?.anioEmpezoAJugar !== undefined ? new Date(basketball?.anioEmpezoAJugar) : undefined,
      manoJuego: basketball?.manoJuego,
      posicionJuegoUno: basketball?.posicionJuegoUno,
      posicionJuegoDos: basketball?.posicionJuegoDos,
      clavas: basketball?.clavas,
      puntosPorJuego: basketball?.puntosPorJuego,
      asistenciasPorJuego: basketball?.asistenciasPorJuego,
      rebotesPorJuego: basketball?.rebotesPorJuego,
      porcentajeTirosMedia: basketball?.porcentajeTirosMedia,
      porcentajeTirosTres: basketball?.porcentajeTirosTres,
      porcentajeTirosLibres: basketball?.porcentajeTirosLibres,
    });

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> setBasketballEnFormulario`, 'Formulario actualizado con datos del servidor.');
  }

  private setFuerzaResistenciaEnFormulario(fuerzaResistencia: IFuerzaResistenciaInformacionPersonal) {
    this.fuerzaResistencia.patchValue({
      alturaSaltoVertical: fuerzaResistencia.alturaSaltoVertical,
      distanciaSaltoHorizontal: fuerzaResistencia.distanciaSaltoHorizontal,
      pesoBenchPress: fuerzaResistencia.pesoBenchPress,
      pesoSquats: fuerzaResistencia.pesoSquats,
      pesoPressMilitar: fuerzaResistencia.pesoPressMilitar,
      pesoRepeticionBenchPress: fuerzaResistencia.pesoRepeticionBenchPress,
      pesoRepeticionSquats: fuerzaResistencia.pesoRepeticionSquats,
      pesoRepeticionPressMilitar: fuerzaResistencia.pesoRepeticionPressMilitar,
      tiempoDistanciaCienMts: fuerzaResistencia.tiempoDistanciaCienMts,
      tiempoDistanciaUnKm: fuerzaResistencia.tiempoDistanciaUnKm,
      tiempoDistanciaTresKm: fuerzaResistencia.tiempoDistanciaTresKm,
      tiempoDistanciaCincoKm: fuerzaResistencia.tiempoDistanciaCincoKm,
    });

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> setFuerzaResistenciaEnFormulario`, 'Formulario actualizado con datos del servidor.');
  }

  private setPerfilEnFormulario(perfil: IPerfilInformacionPersonal) {
    this.perfil.patchValue({
      informacionPersonalId: perfil.informacionPersonalId,
      fotoPerfil: perfil.fotoPerfil,
      altura: perfil.altura,
      peso: perfil.peso,
      estatusBusquedaJugador: perfil.estatusBusquedaJugador,
      medidaMano: perfil.medidaMano,
      largoBrazo: perfil.largoBrazo,
      quienEres: perfil.quienEres,
    });

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> setFuerzaResistenciaEnFormulario`, 'Formulario actualizado con datos del servidor.');
  }

  get perfil(): FormGroup {
    return this.formularioPrincipal.get('perfil') as FormGroup;
  }

  get fuerzaResistencia(): FormGroup {
    return this.formularioPrincipal.get('fuerzaResistencia') as FormGroup;
  }

  get basketball(): FormGroup {
    return this.formularioPrincipal.get('basketball') as FormGroup;
  }

  get experiencia(): FormGroup {
    return this.formularioPrincipal.get('experiencia') as FormGroup;
  }

  get vision(): FormGroup {
    return this.formularioPrincipal.get('vision') as FormGroup;
  }

  get videos(): FormGroup {
    return this.formularioPrincipal.get('videos') as FormGroup;
  }

  get redes(): FormGroup {
    return this.formularioPrincipal.get('redes') as FormGroup;
  }

  public onTabChange(tab: string) {
    console.warn('entro al tab')
    if (tab === 'Basketball' && this.catalogosCargados['basketball'] === undefined) {
      this.cargarCatalogosBasketball();
    } else {
      console.warn(tab === 'Basketball' && !this.catalogosCargados['basketball'], this.catalogosCargados['basketball'])
    }
  }

  private cargarCatalogosBasketball() {
    this.catalogosCargados['Basketball'] = true;

    this._catalogoService.getAllPosicionJugador() // Asume un servicio que trae el catálogo
    .pipe(
      take(1),
      // Usa finalize para asegurar que el loader se oculte
      finalize(() => {
        // Opcional: this._blockUserIService.hide();
      })
    )
    .subscribe({
      next: (catalogo) => {
        this.posicionJugadorCatalogo = catalogo;
        this._logger.log(LogLevel.Info, `${this._contextLog} >> Basketball`, 'Catálogo de posiciones cargado.');

        // 🚨 IMPORTANTE: Aquí puedes setear una bandera LOCAL en el hijo si no usas [allPosicionJugador] en el HTML del hijo para manejar el Skeleton.
      },
      error: (error) => {
        this.catalogosCargados['Basketball'] = false; // Permite reintentar si falla
        this._logger.log(LogLevel.Error, `${this._contextLog} >> Basketball`, 'Error al cargar catálogos', error);
      }
    });
  }

  private validaPerfil() {
    if (this._formularioService.tieneErroresEnControlEspecifico(this.formularioPrincipal, 'perfil')) {
      this._toastService.showMessage(SeverityMessageType.Warn, InfoPersonalSummary.SECCION_FALTANTE, InfoPersonalDetail.PERFIL_INCOMPLETO, 5000);
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Errores en sección: Perfil`);
    }
  }

  private validaFuerzaResistencia() {
    if (this._formularioService.tieneErroresEnControlEspecifico(this.formularioPrincipal, 'fuerzaResistencia')) {
      this._toastService.showMessage(SeverityMessageType.Warn, InfoPersonalSummary.SECCION_FALTANTE, InfoPersonalDetail.FUERZA_RESISTENCIA_INCOMPLETO, 5000);
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Errores en sección: Fuerza y Resistencia`);
    }
  }

  private validaBasketball() {
    if (this._formularioService.tieneErroresEnControlEspecifico(this.formularioPrincipal, 'basketball')) {
      this._toastService.showMessage(SeverityMessageType.Warn, InfoPersonalSummary.SECCION_FALTANTE, InfoPersonalDetail.BASKETBALL, 5000);
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Errores en sección: Basketball`);
    }
  }

  private validaExperiencia() {
    if (this._formularioService.tieneErroresEnControlEspecifico(this.formularioPrincipal, 'experiencia')) {
      this._toastService.showMessage(SeverityMessageType.Warn, InfoPersonalSummary.SECCION_FALTANTE, InfoPersonalDetail.EXPERIENCIA, 5000);
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Errores en sección: Experiencia`);
    }
  }

  private validaVision() {
    if (this._formularioService.tieneErroresEnControlEspecifico(this.formularioPrincipal, 'vision')) {
      this._toastService.showMessage(SeverityMessageType.Warn, InfoPersonalSummary.SECCION_FALTANTE, InfoPersonalDetail.VISION, 5000);
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Errores en sección: Vision`);
    }
  }

   private validaRedes() {
    if (this._formularioService.tieneErroresEnControlEspecifico(this.formularioPrincipal, 'redes')) {
      this._toastService.showMessage(SeverityMessageType.Warn, InfoPersonalSummary.SECCION_FALTANTE, InfoPersonalDetail.REDES, 5000);
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Errores en sección: Redes`);
    }
  }

  private validaErrores() {
    this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Validando formularios...`);
    this.validaPerfil();
    this.validaFuerzaResistencia();
    this.validaBasketball();
    this.validaExperiencia();
    this.validaVision();
    this.validaRedes();
  }

  public onSubmit(): void {
    function dtoToFormData(dto: IRegistraInformacionPersonal, formularioPrincipal: FormGroup): FormData {
      const formData = new FormData();

      // Guardamos la referencia a fotoPerfil y luego la borramos para no duplicar en JSON
      const fotoPerfil = dto.perfil?.fotoPerfil;

      if (dto.perfil) {
        // Eliminamos fotoPerfil del objeto antes de hacer JSON
        dto.perfil.fotoPerfil = undefined;
      }

      // Serializamos sin el archivo
      formData.append('datos', JSON.stringify(dto));

      // Si fotoPerfil existe y es un File, lo agregamos
      if (fotoPerfil && fotoPerfil instanceof File) {
        formData.append('fotoPerfil', fotoPerfil);
      }

      return formData;
    }

    if (this.formularioPrincipal.invalid) {
      this.formularioPrincipal.markAllAsTouched();
      this.validaErrores();
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> onSubmit`, 'Formulario inválido al intentar guardar.');
    } else {

      this._blockUserIService.show(JugadorConstants.APLICANDO_CAMBIOS);
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> onSubmit`, 'Enviando datos al servidor.');

      const raw = this.formularioPrincipal.getRawValue();

      let formCompleto: IRegistraInformacionPersonal;
      formCompleto = {
        perfil: raw.perfil,
        fuerzaResistencia: raw.fuerzaResistencia,
        basketball: raw.basketball,
        experiencia: raw.experiencia,
        vision: raw.vision,
        videos: raw.videos,
        redes: raw.redes,
      }
      const formData = dtoToFormData(formCompleto, this.formularioPrincipal);

      this._informacionPersonalService.save(formData).pipe(
        takeUntil(this._destroy$),
        finalize(() => this._blockUserIService.hide())
      ).subscribe({
        next: (response: any) => {
          this._logger.log(LogLevel.Info, `${this._contextLog} >> onSubmit`, 'Información guardada correctamente', response);
          this._toastService.showMessage(SeverityMessageType.Success, 'Genial', response.mensaje, 5000);
          this.cargaDatos();
        },
        error: (error: any) => {
          // Aquí puedes mostrar un toast, modal o mensaje en pantalla
          this._logger.log(LogLevel.Error, `${this._contextLog} >> onSubmit`, 'Error guardando información', error);
          this._toastService.showMessage(SeverityMessageType.Error, 'Error al guardar', error.error.message || 'Algo salió mal');
          this._blockUserIService.hide();
        }
      });
    }
  }
//#endregion

}
