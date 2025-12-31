import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel, IonItem, IonAvatar, IonIcon, IonChip, IonCard, IonCardContent, IonButton, IonCardSubtitle, IonCardHeader, IonCardTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonAccordion, IonAccordionGroup, IonModal, IonNote } from '@ionic/angular/standalone';
import { NewsBarComponent } from "src/app/layouts/authenticated-layout/components/news-bar/news-bar.component";
import { CoachService } from 'src/app/core/services/coach/coach.service';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { BlockUiService } from 'src/app/core/services/blockUI/block-ui.service';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ToastService } from 'src/app/core/services/messages/toast.service';
import { finalize, firstValueFrom, forkJoin, Subject, takeUntil } from 'rxjs';
import { ViewWillEnter } from '@ionic/angular';
import { CommonMessages, LogLevel, SeverityMessageType } from 'src/app/core/enums';
import { IResponse } from 'src/app/core/interfaces/response/response.interface';
import { ICatalogo } from 'src/app/shared/interfaces/catalogo/catalogo.interface';
import { IInformacinPersonal } from 'src/app/shared/interfaces/informacion-personal';
import { IListadoJugadores } from 'src/app/shared/interfaces/coach/listado-jugadores.interface';

import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ViewChild } from '@angular/core'; // Ya estaba, pero asegúrate
import { CustomPaginatorIntl } from 'src/app/shared/utils/material/custom-paginator-intl';
import { CatalogoService } from 'src/app/shared/services/catalogo/catalogo.service';
import { SelectListSearchComponent } from 'src/app/shared/components/ionic/select-list-search/select-list-search.component';
import { IListadoJugadoresFiltroCoach } from '../../interfaces/filtro-listado-jugadores.interface';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavigationCoachContextService } from 'src/app/core/services/context/navigation-coach-context.service';
import { CoachContext } from 'src/app/core/services/context/types/coach-context.types';

@Component({
  selector: 'app-coach-listado-jugadores',
  templateUrl: './coach-listado-jugadores.page.html',
  styleUrls: ['./coach-listado-jugadores.page.scss'],
  standalone: true,
  imports: [SelectListSearchComponent, IonModal, IonList, IonItem, IonAccordionGroup, IonAccordion, IonLabel, IonSearchbar, IonInfiniteScrollContent, IonInfiniteScroll, IonCardTitle, IonCardHeader, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, IonCardContent, IonCard, IonChip, IonIcon, IonAvatar, CommonModule, FormsModule, NewsBarComponent],
  providers: [
    {
      provide: MatPaginatorIntl,
      useValue: CustomPaginatorIntl('Talentos por página:')
    }
  ]
})
export class CoachListadoJugadoresPage implements OnInit, ViewWillEnter, OnDestroy {
//#region Propiedades
  private readonly _contextLog = 'CoachListadoJugadoresPage';
  public cargandoData = true;
  private readonly _destroy$ = new Subject<void>();

  public allListadoJugadores: IListadoJugadores[] = [];

  // variables para movil
  public allListadoJugadoresParcial: IListadoJugadores[] = [];
  public allListadoJugadoresParcialIndex: number = 0;
  public allListadoJugadoresFiltrados: IListadoJugadores[] = [];
  // end

  // 📌 Estado exclusivo para escritorio
  public filteredDesktopJugadores: IListadoJugadores[] = [];
  public jugadoresDesktopPaginados: IListadoJugadores[] = [];

  private readonly MOBILE_BREAKPOINT = 768;
  // La variable que usaremos en nuestro HTML (*ngIf)
  public isMobileView: boolean = false;


  // variables de escritorio
  public dataSource = new MatTableDataSource<IListadoJugadores>([]);
  public sortDirection: 'asc' | 'desc' = 'asc';
  public lastSortColumn: string | null = null;
  // end

  // Conexión a los elementos del DOM de Mat-Table
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public allEstados: ICatalogo[] = [];
  @ViewChild('modalEstados', { static: true }) modalEstado!: IonModal;
  public selectedEstadoNombre: string = 'Selecciona El Estado';
  public selectedEstadoId: string | undefined = undefined;

  public allMunicipios: ICatalogo[] = [];
  @ViewChild('modalMunicipios', { static: true }) modalMunicipio!: IonModal;
  public selectedMunicipioNombre: string = 'Selecciona El Municipio';
  public selectedMunicipioId: string | undefined = undefined;

  public allPosiciones: ICatalogo[] = [];
  @ViewChild('modalPosiciones', { static: true }) modalPosicion!: IonModal;
  public selectedPosicionNombre: string = 'Selecciona La Posición';
  public selectedPosicionId: string | undefined = undefined;

  public allEstatusJugador: ICatalogo[] = [];
  @ViewChild('modalEstatus', { static: true }) modalEstatus!: IonModal;
  public selectedEstatusNombre: string = 'Selecciona El Estatus';
  public selectedEstatusId: string | undefined = undefined;

  public existeFiltracion: boolean = false;
  public allFiltrosAplicados: IListadoJugadoresFiltroCoach[] = []

  public vistaDeFavoritos: boolean = false;
//#endregion

//#region Constructor
  constructor(
    private readonly _coachService: CoachService, private readonly _toastService: ToastService,
    private readonly _blockUiService:BlockUiService, private readonly _logger: LoggerService,
    private readonly catalagoService: CatalogoService, private readonly _router:Router,
    private readonly route: ActivatedRoute, private readonly _navigationCoachContextSercvice: NavigationCoachContextService
  ) {
    this.vistaDeFavoritos = this.route.snapshot.data['vistaDeFavoritos'];
  }
//#endregion

//#region Ng
  async ngOnInit(): Promise<void> {
    this.route.data.subscribe(data => {
      this.vistaDeFavoritos = data['vistaDeFavoritos'];
      this.handleContextChange();
      this.cargaDatos();
    });
    this.inicializa();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, 'Componente inicializado.');
    this.checkScreenSize();
    await this.cargarCatalogos();
    this.restaurarEstadoVista();
  }

  ionViewWillEnter() {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> ionViewWillEnter`, 'La vista está a punto de entrar (cargando datos).');
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    // this._coachService.clear(this.vistaDeFavoritos);
    this._destroy$.next();
    this._destroy$.complete();
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnDestroy`, 'Componente destruido.');
  }
//#endregion

//#region Generales
  private inicializa(): void {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> inicializa`, 'Cargando datos...');
    this.cargaDatos();
  }

  private cargaDatos() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos`, 'Obteniendo información personal...');

    if (this.vistaDeFavoritos) {
      this._coachService.getAllJugadoresFavoritos()
      .pipe(
        finalize(() => {
          this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos`, 'Finalizada la carga CRÍTICA. Ocultando Skeleton.');
          this.cargandoData = false;
          takeUntil(this._destroy$)
        })
      )
      .subscribe({
        next: (response: IResponse<IListadoJugadores[] | undefined>) => {
          this._logger.log(LogLevel.Info, `${this._contextLog} >> cargaDatos`, 'Datos recibidos', response.data);
          const { data } = response;
          this.allListadoJugadores = data!;
          this.allListadoJugadoresParcial = data!;

          this.allListadoJugadoresParcial = [];
          this.allListadoJugadoresParcialIndex = 0;
          this.allListadoJugadoresFiltrados = [...this.allListadoJugadores];

          for (let i = this.allListadoJugadoresParcialIndex; i < this.allListadoJugadoresParcialIndex + 5; i++) {
            if (i < this.allListadoJugadores.length) {
              this.allListadoJugadoresParcial.push(this.allListadoJugadores[i]);
            }
          }
          this.allListadoJugadoresParcialIndex += 5;

          this.filteredDesktopJugadores = [...this.allListadoJugadores];
          this.aplicarPaginacionDesktop(0, 5);

          this.dataSource.data = this.allListadoJugadores;
        },
        error: (error) => {
          this._logger.log(LogLevel.Error, `${this._contextLog} >> cargaDatos`, 'Error al obtener listado de jugadores', error);
          this._toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, 'No se pudo cargar el listado de jugadores.');
        }
      });
    } else {
      this._coachService.getAllJugadores()
      .pipe(
        finalize(() => {
          this._logger.log(LogLevel.Debug, `${this._contextLog} >> cargaDatos`, 'Finalizada la carga CRÍTICA. Ocultando Skeleton.');
          this.cargandoData = false;
          takeUntil(this._destroy$)
        })
      )
      .subscribe({
        next: (response: IResponse<IListadoJugadores[] | undefined>) => {
          this._logger.log(LogLevel.Info, `${this._contextLog} >> cargaDatos`, 'Datos recibidos', response.data);
          const { data } = response;
          this.allListadoJugadores = data!;
          this.allListadoJugadoresParcial = data!;

          this.allListadoJugadoresParcial = [];
          this.allListadoJugadoresParcialIndex = 0;
          this.allListadoJugadoresFiltrados = [...this.allListadoJugadores];

          for (let i = this.allListadoJugadoresParcialIndex; i < this.allListadoJugadoresParcialIndex + 5; i++) {
            if (i < this.allListadoJugadores.length) {
              this.allListadoJugadoresParcial.push(this.allListadoJugadores[i]);
            }
          }
          this.allListadoJugadoresParcialIndex += 5;

          this.filteredDesktopJugadores = [...this.allListadoJugadores];
          this.aplicarPaginacionDesktop(0, 5);

          this.dataSource.data = this.allListadoJugadores;
        },
        error: (error) => {
          this._logger.log(LogLevel.Error, `${this._contextLog} >> cargaDatos`, 'Error al obtener listado de jugadores', error);
          this._toastService.showMessage(SeverityMessageType.Error, CommonMessages.Error, 'No se pudo cargar el listado de jugadores.');
        }
      });
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    // window.innerWidth te da el ancho actual del viewport
    const currentWidth = window.innerWidth;

    // Si el ancho es menor al breakpoint, es vista móvil
    this.isMobileView = currentWidth < this.MOBILE_BREAKPOINT;
    this._logger.log(LogLevel.Warn, `${this._contextLog} >> checkScreenSize`, `Ancho actual: ${currentWidth}px. Es móvil: ${this.isMobileView}`);
  }

  public redirectPerfil(informacionPersonalId: number) {
    this.registraVistaPerfil(informacionPersonalId);
  }

  private handleContextChange() {
    const nuevoContexto = this.vistaDeFavoritos ? 'favoritos' : 'listado';

    if (this._navigationCoachContextSercvice.isContextChange(nuevoContexto)) {
      // Limpia SOLO el contexto que abandonas
      this._coachService.clear(!this.vistaDeFavoritos);
    }

    this._navigationCoachContextSercvice.setContext(nuevoContexto);
  }

//#endregion

//#region Busqueda movil
  public doInfinite(event: any) {

    setTimeout(() => {

      this.cargarSiguienteChunk();

      if (this.allListadoJugadoresParcial.length >= this.allListadoJugadores.length) {
        event.target.disabled = true;
      }

      event.target.complete();
    }, 1000);
  }

  public onSearchChange(event: any) {
    const query = event.detail.value.toLowerCase().trim();

    // Reiniciar paginación
    this.allListadoJugadoresParcial = [];
    this.allListadoJugadoresParcialIndex = 0;

    // Si está vacío => lista original
    if (!query) {
      this.allListadoJugadoresFiltrados = [...this.allListadoJugadores];
      this.cargarSiguienteChunk();
      return;
    }

    // 🔥 dividir en múltiples palabras
    const terms: string[] = query
      .split(' ')          // dividir por espacios
      .map((t: string) => t.trim())  // quitar espacios de cada una
      .filter((t: string) => t.length > 0);     // remover cadenas vacías

    this.allListadoJugadoresFiltrados = this.allListadoJugadores.filter(j => {

      // Unimos los campos relevantes en un solo string
      const searchable = [
        j.municipio,
        j.estado,
        j.posicionJuegoUno,
        j.posicionJuegoDos,
        j.estatus,
        j.altura?.toString(),
        j.peso?.toString(),
      ]
      .join(' ')
      .toLowerCase();

      // ✔ Cada término debe estar presente
      return terms.every(term => searchable.includes(term));
    });

    // cargar los primeros 5 filtrados
    this.cargarSiguienteChunk();
  }

  private cargarSiguienteChunk() {
    const inicio = this.allListadoJugadoresParcialIndex;
    const fin = inicio + 5;

    const chunk = this.allListadoJugadoresFiltrados.slice(inicio, fin);
    this.allListadoJugadoresParcial.push(...chunk);

    this.allListadoJugadoresParcialIndex += 5;
  }
//#endregion

//#region Busqueda escritorio
  public onDesktopSearch(event: any) {

    const query = event.detail.value.toLowerCase().trim();

    // Si está vacío => lista original
    if (!query) {
      this.onResetSeacrh('');
      return;
    }

    // 🔥 dividir en múltiples palabras
    const terms: string[] = query
      .split(' ')          // dividir por espacios
      .map((t: string) => t.trim())  // quitar espacios de cada una
      .filter((t: string) => t.length > 0);     // remover cadenas vacías

    this.filteredDesktopJugadores = this.allListadoJugadores.filter(j => {

      // Unimos los campos relevantes en un solo string
      const searchable = [
        j.nombre,
        j.aPaterno,
        j.aMaterno,
        j.alias,
        j.municipio,
        j.estado,
        j.posicionJuegoUno,
        j.posicionJuegoDos,
        j.estatus,
        j.altura?.toString(),
        j.peso?.toString(),
      ]
      .join(' ')
      .toLowerCase();

      // ✔ Cada término debe estar presente
      return terms.every(term => searchable.includes(term));
    });

    this.aplicarPaginacionDesktop(0, 5);
  }

  public onResetSeacrh(event: any) {
    console.warn('entre');
    this.filteredDesktopJugadores = [...this.allListadoJugadores];
    this.aplicarPaginacionDesktop(0, 5);
  }

  // ↕ Sort
  toggleSortDirection(column: string) {
    if (this.lastSortColumn === column) {
      // Si vuelven a clickear la misma columna → alterna asc/desc
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Nueva columna → inicia en asc
      this.sortDirection = 'asc';
    }

    this.lastSortColumn = column;
  }

  sortBy(column: string) {
    this.toggleSortDirection(column);

    const sort: { active: string; direction: string } = {
      active: column,
      direction: this.sortDirection,
    };

    this.onSortMaterial(sort);
  }

  public onSortMaterial(event: { active: string; direction: string }) {
    const { active, direction } = event;

    if (!active || direction === '') {
      // Si no hay dirección → regresar a lista original
      this.filteredDesktopJugadores = [...this.allListadoJugadores];
      this.aplicarPaginacionDesktop(0, 5);
      return;
    }

    const sorted = [...this.filteredDesktopJugadores].sort((a, b) => {
      let valA = (a as any)[active] ?? '';
      let valB = (b as any)[active] ?? '';

       switch (active) {

        case 'jugador':
          valA = `${a.nombre} ${a.alias} ${a.aPaterno} ${a.aMaterno} ${a.municipio} ${a.estado}`.trim().toLowerCase();
          valB = `${b.nombre} ${b.alias} ${b.aPaterno} ${b.aMaterno} ${b.municipio} ${b.estado}`.trim().toLowerCase();
          break;

        case 'posicion':
          valA = `${a.posicionJuegoUno} ${a.posicionJuegoDos}`.trim().toLowerCase();
          valB = `${b.posicionJuegoUno} ${b.posicionJuegoDos}`.trim().toLowerCase();
          break;

        case 'altura':
          valA = Number(a.altura) || 0;
          valB = Number(b.altura) || 0;
          break;

        case 'peso':
          valA = Number(a.peso) || 0;
          valB = Number(b.peso) || 0;
          break;

        case 'estatus':
          valA = `${a.estatus}`.toLowerCase();
          valB = `${b.estatus}`.toLowerCase();
          break;

        default:
          valA = (a as any)[active] ?? '';
          valB = (b as any)[active] ?? '';
          break;
      }

      // Comparación general
      if (typeof valA === 'number' && typeof valB === 'number') {
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      return direction === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    this.filteredDesktopJugadores = sorted;
    this.aplicarPaginacionDesktop(0, 5);
  }

// 📄 Paginación
  public onPageChange(event: any) {
    const start = event.pageIndex * event.pageSize;
    const end = start + event.pageSize;
    this.aplicarPaginacionDesktop(start, end);
  }

  private aplicarPaginacionDesktop(start: number, end: number) {
    this.jugadoresDesktopPaginados = this.filteredDesktopJugadores.slice(start, end);
  }

  // TrackBy
  public trackByJugador(index: number, jugador: IListadoJugadores) {
    return jugador.informacionPersonalId;
  }
//#endregion

//#region Filtros escritorio
  async cargarCatalogos() {
    // 1. INICIAR CARGA GLOBAL
    this._blockUiService.show('Iniciando carga de catálogos...');

    try {
      // --- 2. Cargar Catálogo de Estados ---
      this._blockUiService.updateMessage('Cargando catálogo de Estados...');

      // Carga secuencial 1
      const estados = await firstValueFrom(this.catalagoService.getAllEstado());
      this.allEstados = estados;
      // console.log('Estados cargados con éxito.');

      // --- 3. Cargar Tipos de Usuario ---
      this._blockUiService.updateMessage('Cargando catálogo de Posiciones...');

      // Carga secuencial 2
      const posiciones = await firstValueFrom(this.catalagoService.getAllPosicionJugador());
      this.allPosiciones = posiciones;

      this._blockUiService.updateMessage('Cargando catálogo de Estatus Jugador...');
      const estatusJugador = await firstValueFrom(this.catalagoService.getAllEstatusBusquedaJugador());
      this.allEstatusJugador = estatusJugador;
      // console.log('Tipos de usuario cargados con éxito.');

      // 4. Éxito total
      this._blockUiService.updateMessage('✅ Catálogos cargados exitosamente.');
      await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa para ver el mensaje de éxito
    } catch (error) {
      // 5. MANEJO DE ERRORES CENTRALIZADO

        // Actualiza el mensaje del loader con el error (si es un error conocido)
        const errorMessageUI = '❌ Error al cargar un catálogo.';
        const errorMessage = (error as any).message || '❌ Error desconocido al cargar un catálogo.';
        this._blockUiService.updateMessage(errorMessageUI);

        this._logger.log(LogLevel.Error, this._contextLog, errorMessage);

        // Opcional: Mostrar una alerta de error (ej: con ion-alert) o dejar el mensaje de error visible por 3 segundos
        await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
      // 6. FINALIZAR
      this._blockUiService.hide();
    }
  }

  // estado

    public async onCambiaEstado(event: string | undefined) {
      // 1. Validar la selección
      if (!event) {
          this.allMunicipios = [];
          return;
      }

      // 2. Mostrar el loader con mensaje dinámico
      this._blockUiService.show('Cargando municipios...');

      try {
        // 3. Realizar la petición de forma asíncrona
        const municipios = await firstValueFrom(
            this.catalagoService.getAllMunicipioByEstado(event)
        );

        // 4. ÉXITO: Procesar la respuesta
        this.allMunicipios = municipios;

        this._logger.log(LogLevel.Debug, 'onCambiaEstado', 'Datos de municipio recibidos', municipios);

      } catch (error) {
        // 5. ERROR: Manejar la falla
        this.allMunicipios = []; // Vaciar la lista

        this._logger.log(LogLevel.Error, 'onCambiaEstado', 'Error cargando municipios', error);

        // Mostrar error en la UI (ej. Toast)
        this._blockUiService.updateMessage('❌ Error al cargar municipios.');
        // Opcional: dejar el mensaje visible por 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));

      } finally {
          // 6. OCULTAR LOADER
          this._blockUiService.hide();
      }
    }

    public estadoSelectionChanged(selectedId: string | undefined) {
      // 1. Almacenar el ID seleccionado
      this.selectedEstadoId = selectedId;

      // 2. Buscar el nombre para mostrarlo en la UI (UX)
      const estadoSeleccionado = this.allEstados.find(e => e.id === selectedId);

      // 3. Actualizar la variable de la UI
      if (estadoSeleccionado) {
        this.selectedEstadoNombre = estadoSeleccionado.nombre;
        this.onCambiaEstado(this.selectedEstadoId);
        this.aplicarFiltrosDesktop();
      }

      // 4. Cerrar el modal
      this.modalEstado.dismiss();
    }

    public onPresentEstado() {
      this.modalEstado.present()
    }

    public estadoCancel() {
      this.modalEstado.dismiss();
    }
  //

  // municipio
    public municipioSelectionChanged(selectedId: string | undefined) {
      // 1. Almacenar el ID seleccionado
      this.selectedMunicipioId = selectedId;

      // 2. Buscar el nombre para mostrarlo en la UI (UX)
      const municipioSeleccionado = this.allMunicipios.find(e => e.id === selectedId);

      // 3. Actualizar la variable de la UI
      if (municipioSeleccionado) {
        this.selectedMunicipioNombre = municipioSeleccionado.nombre;
        this.aplicarFiltrosDesktop();
      }

      // 4. Cerrar el modal
      this.modalMunicipio.dismiss();
    }

    public onPresentMunicipio() {
      this.modalMunicipio.present()
    }

    public municipioCancel() {
      this.modalMunicipio.dismiss();
    }
  // end

  // posicion
    public posicionSelectionChanged(selectedId: string | undefined) {
      // 1. Almacenar el ID seleccionado
      this.selectedPosicionId = selectedId;

      // 2. Buscar el nombre para mostrarlo en la UI (UX)
      const posicionSeleccionado = this.allPosiciones.find(e => e.id === selectedId);

      // 3. Actualizar la variable de la UI
      if (posicionSeleccionado) {
        this.selectedPosicionNombre = posicionSeleccionado.nombre;
        this.aplicarFiltrosDesktop();
      }

      // 4. Cerrar el modal
      this.modalPosicion.dismiss();
    }

    public onPresentPosicion() {
      this.modalPosicion.present()
    }

    public posicionCancel() {
      this.modalPosicion.dismiss();
    }
  // end

  // estatus
    public estatusSelectionChanged(selectedId: string | undefined) {
      // 1. Almacenar el ID seleccionado
      this.selectedEstatusId = selectedId;

      // 2. Buscar el nombre para mostrarlo en la UI (UX)
      const estatusSeleccionado = this.allEstatusJugador.find(e => e.id === selectedId);

      // 3. Actualizar la variable de la UI
      if (estatusSeleccionado) {
        this.selectedEstatusNombre = estatusSeleccionado.nombre;
        this.aplicarFiltrosDesktop();
      }

      // 4. Cerrar el modal
      this.modalEstatus.dismiss();
    }

    public onPresentEstatus() {
      this.modalEstatus.present()
    }

    public estatusCancel() {
      this.modalEstatus.dismiss();
    }
  // end

  // aplica filtros
    aplicarFiltrosDesktop() {
      let filtros = [...this.allListadoJugadores]; // copia completa

      filtros = filtros.filter(jugador => {

        // Filtro por estado
        if (this.selectedEstadoId && jugador.estado.toLowerCase() !== this.selectedEstadoNombre.toLowerCase()) {
          return false;
        } else {
          this.setFiltroChip('estado', this.selectedEstadoNombre);
          // const ef: IListadoJugadoresFiltroCoach = {
          //   tipo: 'estado',
          //   valor: this.selectedEstadoNombre.toLowerCase()
          // }

          // if (this.allFiltrosAplicados.filter( x => x.tipo === 'estado' && x.valor == this.selectedEstadoNombre.toLowerCase()).length === 0 && !this.selectedEstadoNombre.toLowerCase().includes('selecciona') ) {
          //   this.allFiltrosAplicados.push(ef);
          // }

        }

        // Filtro por municipio
        if (this.selectedMunicipioId && jugador.municipio.toLowerCase() !== this.selectedMunicipioNombre.toLowerCase()) {
          return false;
        } else {
          this.setFiltroChip('municipio', this.selectedMunicipioNombre);
          // const mf: IListadoJugadoresFiltroCoach = {
          //   tipo: 'municipio',
          //   valor: this.selectedMunicipioNombre.toLowerCase()
          // }

          // if (this.allFiltrosAplicados.filter( x => x.tipo === 'municipio' && x.valor == this.selectedMunicipioNombre.toLowerCase()).length === 0 && !this.selectedMunicipioNombre.toLowerCase().includes('selecciona')) {
          //   this.allFiltrosAplicados.push(mf);
          // }
        }

        // Filtro por posición
        if (this.selectedPosicionId && jugador.posicionJuegoUno !== this.selectedPosicionNombre) {
          return false;
        } else {
          this.setFiltroChip('posicion', this.selectedPosicionNombre);
          // const pf: IListadoJugadoresFiltroCoach = {
          //   tipo: 'posicion',
          //   valor: this.selectedPosicionNombre.toLowerCase()
          // }

          // if (this.allFiltrosAplicados.filter( x => x.tipo === 'posicion' && x.valor == this.selectedPosicionNombre.toLowerCase()).length === 0 && !this.selectedPosicionNombre.toLowerCase().includes('selecciona')) {
          //   this.allFiltrosAplicados.push(pf);
          // }
        }

        // Filtro por estatus del jugador
        if (this.selectedEstatusId && jugador.estatus?.toLowerCase() !== this.selectedEstatusNombre.toLowerCase()) {
          return false;
        } else {
          this.setFiltroChip('estatus', this.selectedEstatusNombre);
          // const esf: IListadoJugadoresFiltroCoach = {
          //   tipo: 'estatus',
          //   valor: this.selectedEstatusNombre.toLowerCase()
          // }

          // if (this.allFiltrosAplicados.filter( x => x.tipo === 'estatus' && x.valor == this.selectedEstatusNombre.toLowerCase()).length === 0 && !this.selectedEstatusNombre.toLowerCase().includes('selecciona')) {
          //   this.allFiltrosAplicados.push(esf);
          // }
        }

        return true; // pasa todos los filtros
      });



      if (this.allFiltrosAplicados.length > 0) {
        this.existeFiltracion = true;
      } else {
        this.existeFiltracion = false;
      }

      this.filteredDesktopJugadores = filtros;
      this.aplicarPaginacionDesktop(0, 5);
    }

    reseteFiltrosDesktop() {
      this.selectedEstadoNombre = 'Selecciona El Estado';
      this.selectedEstadoId = undefined;

      this.selectedMunicipioNombre = 'Selecciona El Municipio';
      this.selectedMunicipioId = undefined;

      this.selectedPosicionNombre = 'Selecciona La Posición';
      this.selectedPosicionId = undefined;

      this.selectedEstatusNombre = 'Selecciona El Estatus';
      this.selectedEstatusId = undefined;

      let filtros = [...this.allListadoJugadores];
      this.filteredDesktopJugadores = filtros;
      this.allFiltrosAplicados = [];
      this.existeFiltracion = false;
      this.aplicarPaginacionDesktop(0, 5);
    }

    resetFiltrosDesktopByChips(item: IListadoJugadoresFiltroCoach) {

      this.allFiltrosAplicados = this.allFiltrosAplicados.filter(
        x => !(x.tipo === item.tipo &&
              x.valor.toString().trim().toLowerCase() === item.valor.toString().trim().toLowerCase())
      );

      switch (item.tipo) {
        case 'estado':
            this.selectedEstadoNombre = 'Selecciona El Estado';
            this.selectedEstadoId = undefined;

            this.selectedMunicipioNombre = 'Selecciona El Municipio';
            this.selectedMunicipioId = undefined;

            this.allFiltrosAplicados = this.allFiltrosAplicados.filter(
              x => !(x.tipo === 'municipio'));
          break;

        case 'municipio':
          this.selectedMunicipioNombre = 'Selecciona El Municipio';
          this.selectedMunicipioId = undefined;
          break;
        case 'posicion':
            this.selectedPosicionNombre = 'Selecciona La Posición';
            this.selectedPosicionId = undefined;
          break;
        case 'estatus':
            this.selectedEstatusNombre = 'Selecciona El Estatus';
            this.selectedEstatusId = undefined;
          break;
        default:
          this.reseteFiltrosDesktop();
          break;
      }

      this.aplicarFiltrosDesktop();
    }

    private setFiltroChip(tipo: IListadoJugadoresFiltroCoach['tipo'], valor: string) {

      // eliminar chip previo del mismo tipo
      this.allFiltrosAplicados = this.allFiltrosAplicados.filter(
        x => x.tipo !== tipo
      );

      // no agregar si es "Selecciona..."
      if (!valor || valor.toLowerCase().includes('selecciona')) {
        return;
      }

      this.allFiltrosAplicados.push({
        tipo,
        valor: valor.toLowerCase()
      });
    }

  // end
//#endregion

//#region Vistas
  private registraVistaPerfil(informacionPersonalId: number) {
    this.guardarEstadoVista();

    this._coachService.saveVisitaPerfil(informacionPersonalId)
    .pipe(
      takeUntil(this._destroy$),
      finalize(() => {
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> registraVistaPerfil`, 'Finalizada el registro de visita.');
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> registraVistaPerfil`, 'Redirigiendo /desktop/coach/perfil-jugador/', informacionPersonalId);
        this._router.navigate(
          ['/desktop/coach/perfil-jugador', informacionPersonalId],
          {
            queryParams: {
              fromFavoritos: this.vistaDeFavoritos
            }
          }
        );
      })
    )
    .subscribe({
      next:( () => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> registraVistaPerfil`, 'Finalizada el registro de visita con exito');
      }),
      error:( (error) => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> registraVistaPerfil`, 'Error al registrar la visita.', error);
      })
    })
  }
//#endregion

//#region Favoritos
  public actualizaPerfilFavorito(informacionPersonalId: number, jugador: IListadoJugadores) {
    this._coachService.saveFavoritoPerfil(informacionPersonalId)
    .pipe(
      takeUntil(this._destroy$),
      finalize(() => {
        this._logger.log(LogLevel.Debug, `${this._contextLog} >> saveFavoritoPerfil`, 'Finalizada el registro de faavorito.');
        const indexJugador = this.jugadoresDesktopPaginados.findIndex(x => x.informacionPersonalId === informacionPersonalId);
        const interes = !this.jugadoresDesktopPaginados[indexJugador].interesado;

        if (this.vistaDeFavoritos) {
          this.jugadoresDesktopPaginados.splice(indexJugador, 1);
          this._toastService.showMessage(SeverityMessageType.Success, 'Excelente', 'Talento eliminado de favoritos.');
        } else {
          this.jugadoresDesktopPaginados[indexJugador].interesado = interes;
          if (interes) {
            this._toastService.showMessage(SeverityMessageType.Success, 'Excelente', 'Talento agregado a favoritos.');
          } else {
            this._toastService.showMessage(SeverityMessageType.Success, 'Excelente', 'Talento eliminado de favoritos.');
          }
        }

      })
    )
    .subscribe({
      next:( () => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> saveFavoritoPerfil`, 'Finalizada el registro de faavorito con exito');
      }),
      error:( (error) => {
        this._logger.log(LogLevel.Error, `${this._contextLog} >> saveFavoritoPerfil`, 'Error al registrar la faavorito.', error);
      })
    })
  }
//#endregion

//#region Persistencia Filtros
  private guardarEstadoVista() {
    this._coachService.save({
      filtros: {
        estadoId: this.selectedEstadoId,
        estadoNombre: this.selectedEstadoNombre,
        municipioId: this.selectedMunicipioId,
        municipioNombre: this.selectedMunicipioNombre,
        posicionId: this.selectedPosicionId,
        posicionNombre: this.selectedPosicionNombre,
        estatusId: this.selectedEstatusId,
        estatusNombre: this.selectedEstatusNombre,
        chips: this.allFiltrosAplicados,
        existeFiltracion: this.existeFiltracion
      },
      tabla: {
        sortColumn: this.lastSortColumn,
        sortDirection: this.sortDirection,
        pageIndex: this.paginator?.pageIndex ?? 0,
        pageSize: this.paginator?.pageSize ?? 5
      },
      scrollY: window.scrollY
    }, this.vistaDeFavoritos);
  }

  private restaurarEstadoVista() {
    const state = this._coachService.load(this.vistaDeFavoritos);
    if (!state) return;

    // filtros
    this.selectedEstadoId = state.filtros.estadoId;
    this.selectedEstadoNombre = state.filtros.estadoNombre;
    this.selectedMunicipioId = state.filtros.municipioId;
    this.selectedMunicipioNombre = state.filtros.municipioNombre;
    this.selectedPosicionId = state.filtros.posicionId;
    this.selectedPosicionNombre = state.filtros.posicionNombre;
    this.selectedEstatusId = state.filtros.estatusId;
    this.selectedEstatusNombre = state.filtros.estatusNombre;

    this.allFiltrosAplicados = state.filtros.chips ?? [];
    this.existeFiltracion = state.filtros.existeFiltracion ?? false;

    // sort
    this.lastSortColumn = state.tabla.sortColumn;
    this.sortDirection = state.tabla.sortDirection;

    // aplicar filtros y orden
    this.aplicarFiltrosDesktop();
    if (this.lastSortColumn) {
      this.sortBy(this.lastSortColumn);
    }

    //
    if (this.selectedEstadoId && +this.selectedEstadoId > 0) {
      this.onCambiaEstado(this.selectedEstadoId);
    }

    // paginación
    setTimeout(() => {
      this.paginator.pageIndex = state.tabla.pageIndex;
      this.paginator.pageSize = state.tabla.pageSize;
      this.onPageChange({
        pageIndex: state.tabla.pageIndex,
        pageSize: state.tabla.pageSize
      });
    });

    // scroll
    setTimeout(() => {
      window.scrollTo(0, state.scrollY ?? 0);
    }, 100);
  }

//#endregion

}
