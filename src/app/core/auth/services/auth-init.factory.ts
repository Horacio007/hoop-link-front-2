// src/app/core/auth/services/auth-init.factory.ts
import { AuthService } from './auth.service';

export function authInitializerFactory(authService: AuthService) {
  return () => authService.checkAuth().toPromise();
}
