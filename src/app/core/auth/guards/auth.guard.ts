import { inject } from '@angular/core';
import { CanActivateFn, CanLoadFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, combineLatest, filter, take, of, tap, switchMap } from 'rxjs';
import { LoggerService } from '../../services/logger/logger.service'
import { LogLevel } from '../../enums';

export const authGuard: CanActivateFn & CanLoadFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  return authService.checkAuth().pipe(
    tap(() => logger.log(LogLevel.Debug, 'AuthGuard', 'checkAuth() llamado')),
    switchMap(() =>
      combineLatest([authService.user$, authService.authChecked$]).pipe(
        filter(([_, checked]) => checked),
        take(1),
        map(([user]) => {
          if (user) {
            logger.log(LogLevel.Info, 'AuthGuard', 'Usuario autenticado, acceso permitido');
            return true;
          } else {
            logger.log(LogLevel.Warn, 'AuthGuard', 'Usuario no autenticado, redirigiendo a /login');
            return router.parseUrl('/login');
          }
        }),
        catchError((err) => {
          logger.log(LogLevel.Error, 'AuthGuard', 'Error verificando autenticación', err);
          return of(router.parseUrl('/login'));
        })
      )
    )
  );
};


