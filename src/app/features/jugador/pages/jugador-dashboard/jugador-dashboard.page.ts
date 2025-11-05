import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline, closeOutline } from 'ionicons/icons';
import { FooterComponent } from "src/app/layouts/components/footer/footer.component";
import { HeaderAuthenticatedComponent } from "src/app/layouts/authenticated-layout/components/header-authenticated/header-authenticated.component";
import { ActivatedRoute, Data, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger/logger.service'; // 🚨 Importar LoggerService y LogLevel
import { LogLevel } from 'src/app/core/enums';
import { BannerSpaceComponent } from 'src/app/layouts/authenticated-layout/components/banner-space/banner-space.component';
import { NewsBarComponent } from 'src/app/layouts/authenticated-layout/components/news-bar/news-bar.component';
import { InfoCardsComponent } from 'src/app/layouts/authenticated-layout/components/info-cards/info-cards.component';

@Component({
 selector: 'app-jugador-dashboard',
 templateUrl: './jugador-dashboard.page.html',
 styleUrls: ['./jugador-dashboard.page.scss'],
 standalone: true,
 imports: [IonContent, CommonModule, FormsModule, FooterComponent, HeaderAuthenticatedComponent, RouterOutlet, RouterModule, BannerSpaceComponent, NewsBarComponent, InfoCardsComponent]
})
export class JugadorDashboardPage implements OnInit, OnDestroy {

  // 🚨 Definir el contexto del log
  private readonly LOG_CONTEXT = 'JugadorDashboard';

//#region Propiedades
  public pageTitle: string = 'Dashboard';
  private routerSubscription: Subscription | null = null;
//#endregion

//#region Constructor
 constructor(
  private router: Router,
  private activatedRoute: ActivatedRoute, // Usamos esta ruta para el snapshot inicial
  private logger: LoggerService // 🚨 Inyección del LoggerService
  ) {
    addIcons({
      settingsOutline, closeOutline
    })
    // 🚨 Log INFO al inicializar el componente, usando la sintaxis log(NIVEL, CONTEXTO, MENSAJE)
    this.logger.log(LogLevel.Info, `${this.LOG_CONTEXT} >> constructor`, 'Constructor ejecutado.');
  }
//#endregion

//#region Ng
  ngOnInit(): void {
    this.logger.log(LogLevel.Debug, `${this.LOG_CONTEXT} >> ngOnInit`, 'ngOnInit iniciado. Configurando suscripción de rutas.');

    const titleUpdater$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event) => {
          // 🚨 Log DEBUG al finalizar la navegación, incluyendo la URL en los datos
          this.logger.log(LogLevel.Debug, `${this.LOG_CONTEXT} >> routeEvent`, 'Navegación completa.', (event as NavigationEnd).urlAfterRedirects);
          return this.getDeepestRouteData(this.activatedRoute.root);
      })
    );

    // Suscripción para actualizar el título cuando la navegación finaliza
    this.routerSubscription = titleUpdater$.subscribe(routeData => {
      const title = this.extractRouteTitle(routeData);
      if (title) {
        // Usamos solo la primera parte del título si hay separador
        const cleanTitle = title.split('|')[0].trim();
        this.pageTitle = cleanTitle;
        this.logger.log(LogLevel.Info, `${this.LOG_CONTEXT} >> titleSubscription`, 'Título de página actualizado.', cleanTitle);
      } else {
        // Fallback si no hay título en la ruta profunda
        this.pageTitle = 'Dashboard';
        this.logger.log(LogLevel.Warn, `${this.LOG_CONTEXT} >> titleSubscription`, 'No se encontró título de ruta, usando fallback.', routeData);
      }
    });

    // 🚨 Log DEBUG al leer el título inicial
    this.logger.log(LogLevel.Debug, `${this.LOG_CONTEXT} >> ngOnInit`, 'Leyendo título inicial.');

    // Leer el título inicial (al cargar el layout)
    const initialData = this.getDeepestRouteData(this.activatedRoute.root);
    const initialTitle = this.extractRouteTitle(initialData);
    if (initialTitle) {
      // Usamos solo la primera parte del título si hay separador
      const cleanTitle = initialTitle.split('|')[0].trim();
      this.pageTitle = cleanTitle;
    }

  }

  ngOnDestroy(): void {
    // 🚨 Log INFO al destruir el componente
    this.logger.log(LogLevel.Info, `${this.LOG_CONTEXT} >> ngOnDestroy`, 'ngOnDestroy ejecutado. Desuscribiendo.');
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
//#endregion

//#region Generales
  /**
   * Método auxiliar para buscar la data (incluyendo el título) en la ruta más profunda.
   */
  private getDeepestRouteData(route: ActivatedRoute): Data {
    // Crea una referencia mutable a la ruta actual
    let currentRoute: ActivatedRoute = route;

    // Itera mientras exista un primer hijo
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    // Acceso seguro al data del snapshot de la ruta más profunda
    return currentRoute.snapshot?.data || {};
  }

    /**
    * Extrae el título de la data de la ruta, buscando la clave del Symbol o la clave 'title'.
    */
    private extractRouteTitle(routeData: Data): string | undefined {
      if (!routeData) return undefined;

      // 1. Búsqueda por Symbol (donde Angular guarda los títulos definidos en la ruta)
      for (const key of Object.getOwnPropertySymbols(routeData)) {
        if (key.toString().includes('RouteTitle')) {
          return routeData[key] as string;
        }
      }
      // 2. Fallback por clave 'title' (si se definió explícitamente en data: { title: '...' })
      return routeData['title'] as string | undefined;
    }
//#endregion


}
