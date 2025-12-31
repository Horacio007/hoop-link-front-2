import { Component, OnInit, Input, effect } from '@angular/core';
import { Router } from '@angular/router';
import { IonButtons, IonToolbar, IonMenuButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { LogLevel } from 'src/app/core/enums';
import { LoggerService } from 'src/app/core/services/logger/logger.service';

@Component({
  selector: 'app-header-authenticated',
  templateUrl: './header-authenticated.component.html',
  styleUrls: ['./header-authenticated.component.scss'],
  imports: [IonMenuButton, IonButtons, IonToolbar]
})
export class HeaderAuthenticatedComponent  implements OnInit {

//#region Propiedades
  @Input() pageTitle!: string;
  private readonly _contextLog = 'HeaderAuthenticatedComponent';
//#endregion

//#region Constructor

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _logger: LoggerService
  ) { }
//#endregion

  ngOnInit() {}

//#region Generales
  public redirectDashboard(): void {
    const user = this._authService.user();

    switch (user?.rol) {
      case 'jugador':
        this._logger.log(
          LogLevel.Info,
          `${this._contextLog} >> redirectDashboard`,
          'Redirigiendo al dashboard de jugador.'
        );

        this._router.navigate(['/desktop/jugador']);
        break;
      case 'coach':
        this._logger.log(
          LogLevel.Info,
          `${this._contextLog} >> redirectDashboard`,
          'Redirigiendo al dashboard de coach.'
        );

        this._router.navigate(['/desktop/coach']);
        break;
      case 'admin':
        this._logger.log(
          LogLevel.Info,
          `${this._contextLog} >> redirectDashboard`,
          'Redirigiendo al dashboard de administrador.'
        );

        this._router.navigate(['/desktop/admin']);
        break;
      default:
        this._logger.log(
          LogLevel.Warn,
          `${this._contextLog} >> redirectDashboard`,
          `Rol desconocido: ${user?.rol}. Redirigiendo a access-denied.`
        );

        this._router.navigate(['/access-denied']);
    }
  }
//#endregion

}
