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

    console.log('🛡️ [AuthGuard] Intentando entrar a:', state.url);

    const isLogged = this.authService.isLoggedIn();
    console.log('🛡️ [AuthGuard] ¿Está logueado?', isLogged);

    // 1) ¿Está logueado?
    if (!isLogged) {
      console.log('🛑 [AuthGuard] No hay token, redirigiendo a /login con returnUrl =', state.url);
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // 2) ¿Alguna ruta en la jerarquía requiere admin?
    const pathRequiresAdmin =
      route.pathFromRoot?.some(r => r.data?.['requiresAdmin'] === true) || false;

    console.log('🛡️ [AuthGuard] ¿La ruta requiere admin?', pathRequiresAdmin);

    if (!pathRequiresAdmin) {
      // Ruta normal: solo necesita estar logueado
      console.log('✅ [AuthGuard] Ruta normal, usuario logueado. Permitir acceso.');
      return true;
    }

    // 3) Si requiere admin → preguntamos al backend
    console.log('🧑‍⚖️ [AuthGuard] Ruta con requiresAdmin = true, verificando con el backend...');

    return this.authService.isAdminFromApi().then(isAdmin => {
      console.log('🧑‍⚖️ [AuthGuard] ¿isAdminFromApi() respondió admin?', isAdmin);

      if (!isAdmin) {
        console.log('⛔ [AuthGuard] Usuario NO es admin. Redirigiendo a /inicio');
        this.router.navigate(['/inicio']);
        return false;
      }

      console.log('✅ [AuthGuard] Usuario es admin. Permitir acceso.');
      return true;
    }).catch(err => {
      console.error('❌ [AuthGuard] Error al verificar admin en isAdminFromApi():', err);
      console.log('⛔ [AuthGuard] Por seguridad, redirigiendo a /inicio');
      this.router.navigate(['/inicio']);
      return false;
    });
  }

  // Reusar la misma lógica para rutas hijas
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    console.log('🛡️ [AuthGuard] canActivateChild para ruta:', state.url);
    return this.canActivate(route, state);
  }
}
