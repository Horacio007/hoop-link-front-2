import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRouterOutlet, IonTitle, IonToolbar, IonHeader, IonMenu, IonIcon, IonButtons, IonMenuButton, IonLabel, IonList, IonItem, MenuController } from '@ionic/angular/standalone';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';
import { ViewWillEnter } from '@ionic/angular';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { IAuthUser } from 'src/app/core/auth/interfaces';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { addIcons } from 'ionicons';
import { personOutline, cogOutline, logOutOutline, barChartOutline, closeOutline, accessibilityOutline } from 'ionicons/icons';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.page.html',
  styleUrls: ['./authenticated-layout.page.scss'],
  standalone: true,
  imports: [IonItem, IonList, IonLabel, IonMenuButton, IonButtons, IonIcon, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, FormsModule, IonRouterOutlet, RouterModule]
})
export class AuthenticatedLayoutPage implements OnInit, OnDestroy, ViewWillEnter {

//#region Propiedades
  private readonly _contextLog = 'AuthenticatedLayoutPage';
  public user: IAuthUser | null = null;
  private _destroy$ = new Subject<void>();
//#endregion

//#region Constructor
  constructor(
    private readonly _logger: LoggerService, private readonly _authService: AuthService,
    private readonly _router: Router, private readonly _menuController: MenuController
  ) {
    effect(() => {
      this.user = this._authService.user();

      const checked = this._authService.authChecked();

      if (!checked) return;

      if (!this.user) {
        this._logger.log(
          LogLevel.Warn,
          `${this._contextLog} >> constructor`,
          'No hay usuario autenticado. Redirigiendo al login.'
        );

        this._router.navigate(['/login']);
        return;
      }
    });

    addIcons({
      personOutline, cogOutline, logOutOutline, barChartOutline, closeOutline, accessibilityOutline
    });
  }

//#endregion

//#region Ng
  ngOnInit() {
    this._logger.log(LogLevel.Debug, `${this._contextLog} >> ngOnInit`, `Componente inicializado.`);
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
  logout(): void {
    this._logger.log(LogLevel.Info, `${this._contextLog} >> logout`, 'Intentando cerrar sesión...');

    this._authService.logout()
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: async () => {
        this._logger.log(LogLevel.Info, `${this._contextLog} >> logout`, 'Sesión cerrada correctamente.');
        await this._menuController.close();
        this._router.navigate(['/login']); // redirige a login
      },
      error: (error) => {
        // Manejar error si quieres
        this._logger.log(LogLevel.Error, `${this._contextLog} >> logout`, 'Error al cerrar sesión.', error);
      }
    })
  }

  public async closeMenu() {
    await this._menuController.close();
  }
//#endregion

}
