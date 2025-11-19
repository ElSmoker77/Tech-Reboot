// src/app/services/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    // 1) ¿Está logueado?
    if (!this.authService.isLoggedIn()) {
      // guardar la URL solicitada para redirigir después del login
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // 2) ¿Alguna ruta en la jerarquía requiere admin?
    const pathRequiresAdmin =
      route.pathFromRoot?.some(r => r.data?.['requiresAdmin'] === true) || false;

    if (!pathRequiresAdmin) {
      // Ruta normal: solo necesita estar logueado
      return true;
    }

    // 3) Si requiere admin → preguntamos al backend
    return this.authService.isAdminFromApi().then(isAdmin => {
      if (!isAdmin) {
        // No es admin → lo saco de la zona admin
        this.router.navigate(['/inicio']);
        return false;
      }

      // Es admin → puede pasar
      return true;
    });
  }

  // Reusar la misma lógica para rutas hijas
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    return this.canActivate(route, state);
  }
}
