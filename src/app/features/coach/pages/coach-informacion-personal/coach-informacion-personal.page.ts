import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { IonCard, IonCardContent, IonTextarea, IonModal, IonCardHeader, IonCardTitle, IonIcon, IonHeader, IonToolbar, IonContent, IonButtons, IonButton, IonInput } from '@ionic/angular/standalone';
import { SkeletonComponent } from "src/app/shared/components/ionic/skeleton/skeleton.component";
import { ProfileImageComponent } from "src/app/shared/components/profile-image/profile-image.component";
import { LogLevel, SeverityMessageType, CommonMessages } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { ErrorImagenPerfil } from 'src/app/shared/components/profile-image/enums/error-profile-image.enum';
import { FormularioUtilsService } from 'src/app/shared/utils/form/formulario-utils.service';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { informationCircleOutline, arrowBackOutline, close, addCircleOutline, trash } from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';
import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';
import { CoachService } from 'src/app/core/services/coach/coach.service';
import { finalize, forkJoin, Subject, takeUntil } from 'rxjs';
import { IInformacionPersonalCoach, IRegistraInformacionPersonal } from '../../interfaces/informacion-personal.interface';
import { JugadorConstants } from 'src/app/features/jugador/constants/general/general.constants';
import { InfoPersonalSummary } from 'src/app/features/jugador/constants';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';

@Component({
  selector: 'app-coach-informacion-personal',
  templateUrl: './coach-informacion-personal.page.html',
  styleUrls: ['./coach-informacion-personal.page.scss'],
  standalone: true,
  imports: [IonInput, IonModal, IonButton, IonButtons, IonContent, IonToolbar, IonHeader, IonIcon, IonCardTitle, IonCardHeader, IonTextarea, IonCardContent, IonCard, CommonModule, FormsModule, SkeletonComponent, ProfileImageComponent, ReactiveFormsModule, SkeletonComponent, ProfileImageComponent,]
})
export class CoachInformacionPersonalPage implements OnInit, ViewWillEnter, OnDestroy {

//#region Propiedades
  public fotoPreviewUrl: string | null = null;
  public nuevoArchivoFoto: File | null = null;

  public form!: FormGroup;

  private readonly _contextLog = 'CoachInformacionPersonalPage';
  private readonly _destroy$ = new Subject<void>();

  public cargandoData = false;

  @ViewChild('modalAttr', { static: true }) modalAttr!: IonModal;
  @ViewChild('modalTrayectoria', { static: true }) modalTrayectoria!: IonModal;
//#endregion

//#region Constructor
  constructor(
    private readonly _formularioUtils: FormularioUtilsService, private readonly _toastService: ToastService,
    private readonly _logger: LoggerService, private readonly _fb: FormBuilder,
    private readonly _blockUserIService:BlockUiService, private readonly _coachService: CoachService
  ) {
    addIcons({
      informationCircleOutline, close, arrowBackOutline, addCircleOutline, trash
    });

  }
//#endregion

//#region Ng
  ngOnInit() {
    this.inicializa();
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ngOnInit`, 'Inicializando componente.');
    this.form.valueChanges.subscribe(val => {
      this.cargaFotoPerfil();
    });
    this.cargaFotoPerfil();
  }

  ionViewWillEnter(): void {
    this.cargaFotoPerfil();
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
    this.form = this._fb.group({
      informacionPersonalId: new FormControl(null),
      usuarioId: new FormControl(null),
      fotoPerfil: new FormControl(null),
      fotoPerfilFile: [null],
      trabajoActual: new FormControl(null, Validators.required),
      personalidad: new FormControl(null, Validators.required),
      valores: new FormControl(null, Validators.required),
      objetivos: new FormControl('', Validators.required),
      antiguedad: new FormControl('', Validators.required),
      historialTrabajoCoaches: this._fb.array([]) ,
    });

    this._logger.log(LogLevel.Debug, `${this._contextLog} >> prepareFormularios`, 'Formulario principal preparado.');
  }

  private cargaFotoPerfil() {
    const valorForm = this.form.get('fotoPerfil')?.value;

    if (typeof valorForm === 'string') {
        this.fotoPreviewUrl = valorForm;
    }
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaFotoPerfil`, 'Actualizando vista previa de foto de perfil', this.fotoPreviewUrl);
  }

  public onFileSelected(file: File): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> onFileSelected`, 'Archivo seleccionado', file.name);
    // this.form.get('fotoPerfil')?.setValue(file);
    this.form.get('fotoPerfilFile')?.setValue(file);
    this.nuevoArchivoFoto = file;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const previewUrl = reader.result;

        this.form.get('fotoPerfil')?.setValue(previewUrl);

        this.fotoPreviewUrl = previewUrl;
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> onFileSelected`, 'Vista previa generada');
      }
    };
    reader.readAsDataURL(file);
  }

  public handleFileTooLarge(size: number): void {
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    this._logger.log(LogLevel.Warn, `${this._contextLog} >> handleFileTooLarge`, `Archivo demasiado grande (${sizeMB} MB)`);
    this._toastService.showMessage(SeverityMessageType.Warning, `${CommonMessages.Atencion}: ${ErrorImagenPerfil.ArchivoDemasiadoGrande}`, `La imagen supera los 7 MB (actual: ${sizeMB} MB)`, 5000);
  }

  private cargaDatos() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos`, 'Obteniendo información personal...');

    // 1. Definir los Observables a esperar
    const dataPrincipal$ = this._coachService.getInformacionPersonal().pipe(
      takeUntil(this._destroy$)
    );

    // 2. Usar forkJoin para esperar ambos
    forkJoin({
      dataPrincipal: dataPrincipal$,
    })
    .pipe(
      // El finalize se ejecuta SOLO después de que forkJoin termine (éxito o error)
      finalize(() => {
          this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos >> ReadOnly`, 'Finalizada la carga CRÍTICA. Ocultando Skeleton.');
          this.cargandoData = false;
      })
    ).subscribe({
      next: (results: { dataPrincipal: IResponse<IInformacionPersonalCoach | undefined>}) => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> cargaDatos >> ReadOnly`, 'Datos recibidos', results);

        const { data } = results.dataPrincipal;

        if (data) {
           this.form.patchValue({
              informacionPersonalId: data.informacionPersonalCoachId,
              usuarioId: data.coachId,
              fotoPerfil: data.fotoPerfilPublicUrl,
              trabajoActual: data.trabajoActual,
              personalidad: data.personalidad,
              valores: data.valores,
              objetivos: data.objetivos,
              antiguedad: data.antiguedad,
          });

          if (Array.isArray(data.historialTrabajoCoaches)) {
            // --- Historial de eventos ---
            const historialEquiposFormArray = this.form.get('historialTrabajoCoaches') as FormArray;
            historialEquiposFormArray.clear();
            data.historialTrabajoCoaches?.forEach(evento => {
              historialEquiposFormArray.push(this._fb.group({
                id: [evento.id],
                nombre: [evento.nombre],
              }));
            });
          }

          this._logger.log(LogLevel.Debug, `${this._contextLog} >> setFuerzaResistenciaEnFormulario`, 'Formulario actualizado con datos del servidor.');
        }
      },
      error: (error) => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> cargaDatos`, 'Error al obtener información personal', error);
        this._toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, 'No se pudo cargar la información personal.');
      }
    });

  }


  private crearFormularioTrabajos(): FormGroup {
    const grupo = this._fb.group({
      id: [uuidv4()],
      nombre: ['', Validators.required],
    });

    return grupo;
  }

  get Trabajo(): FormArray {
    return this.form.get('historialTrabajoCoaches') as FormArray;
  }

  public onAgregaTrabajo() {
    this.Trabajo.push(this.crearFormularioTrabajos());
  }

  public onEliminaTrabajo(index: number): void {
    this.Trabajo.removeAt(index);
  }

  public openModalAttr() {
    this.modalAttr.present();
  }

  public closeModalAttr() {
    this.modalAttr.dismiss();
  }

  public openModalTrayectoria() {
    this.modalTrayectoria.present();
  }

  public closeModalTrayectoria() {
    this.modalTrayectoria.dismiss();
  }

  private validaErrores() {
    this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Validando formularios...`);
    if (this._formularioUtils.tieneErroresEnAlgunControl(this.form)) {
      this._toastService.showMessage(SeverityMessageType.Warn, InfoPersonalSummary.SECCION_FALTANTE, 'Información Personal Incompleta', 5000);
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> validaErrores`, `Errores en sección: Información personal`);
    }
  }

  public onSubmit(): void {
    function dtoToFormData(dto: IRegistraInformacionPersonal, formularioPrincipal: FormGroup): FormData {
      const formData = new FormData();

      // Guardamos la referencia a fotoPerfil y luego la borramos para no duplicar en JSON
      const fotoPerfilFileControl = formularioPrincipal.get('fotoPerfilFile');
      const fileToSend = fotoPerfilFileControl?.value;

      if (dto.fotoPerfil) {
        // Eliminamos fotoPerfil del objeto antes de hacer JSON
        dto.fotoPerfil = undefined;
      }

      // Serializamos sin el archivo
      formData.append('datos', JSON.stringify(dto));

      // Si fotoPerfil existe y es un File, lo agregamos
      if (fileToSend && fileToSend instanceof File) {
        // formData.append('fotoPerfil', fotoPerfil);
        formData.append('fotoPerfil', fileToSend!, fileToSend!.name);
      }

      return formData;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validaErrores();
      this._logger.log(LogLevel.Warn, `${this._contextLog} >> onSubmit`, 'Formulario inválido al intentar guardar.');
    } else {
      // aqui iva la informacion si le pongo otra vez lo de validar todo
      this._blockUserIService.show(JugadorConstants.APLICANDO_CAMBIOS);
      this._logger.log(LogLevel.Debug, `${this._contextLog} >> onSubmit`, 'Enviando datos al servidor.');

      const raw = this.form.getRawValue();

      let formCompleto: IRegistraInformacionPersonal;
      formCompleto = {
        ...raw
      }

      console.log(formCompleto);

      const formData = dtoToFormData(formCompleto, this.form);

      this._coachService.saveInformcionPersonal(formData).pipe(
        takeUntil(this._destroy$),
        finalize(() => this._blockUserIService.hide())
      ).subscribe({
        next: (response: any) => {
          this._logger.log(LogLevel.Info, `${this._contextLog} >> onSubmit`, 'Información guardada correctamente', response);
          this._toastService.showMessage(SeverityMessageType.Success, 'Genial', response.mensaje, 5000);
          this.form.get('fotoPerfilFile')?.setValue(null);
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
