// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  correo = '';
  password = '';
  mensaje = '';
  estadoMensaje: 'error' | 'success' | '' = '';
  isSubmitting = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('🔄 [Login] ngOnInit. isLoggedIn =', this.auth.isLoggedIn());

    // 🚫 Si ya está logeado, no tiene sentido ver el login
    if (this.auth.isLoggedIn()) {
      const rol = localStorage.getItem('rol');
      const esAdminFlag = localStorage.getItem('esAdmin') === 'true';

      console.log('🔄 [Login] Ya hay sesión. rol =', rol, 'esAdminFlag =', esAdminFlag);

      if (rol === 'admin' || esAdminFlag) {
        console.log('➡️ [Login] Redirigiendo a /admin/componentes desde ngOnInit');
        this.router.navigate(['/admin/componentes']);
      } else {
        console.log('➡️ [Login] Redirigiendo a /componentes desde ngOnInit');
        this.router.navigate(['/componentes']);
      }
    }
  }

  async login() {
    console.log('🚪 [Login] Intentando iniciar sesión con:', this.correo);

    if (!this.correo || !this.password) {
      this.estadoMensaje = 'error';
      this.mensaje = 'Debes ingresar tu correo y contraseña.';
      console.warn('⚠️ [Login] Campos vacíos');
      return;
    }

    this.isSubmitting = true;
    this.estadoMensaje = '';
    this.mensaje = '';

    const correoNormalizado = this.correo.trim().toLowerCase();
    console.log('✉️ [Login] Correo normalizado:', correoNormalizado);

    try {
      const res = await this.auth.login({
        correo: correoNormalizado,
        password: this.password
      });

      console.log('✅ [Login] Respuesta del backend:', res);

      // guardar token
      if (res?.token) {
        localStorage.setItem('token', res.token);
        console.log('💾 [Login] Token guardado en localStorage');
      } else {
        console.warn('⚠️ [Login] No vino token en la respuesta');
      }

      // guardar correo
      if (res?.correo) {
        localStorage.setItem('usuario', res.correo);
        console.log('💾 [Login] Correo guardado (res.correo):', res.correo);
      } else {
        localStorage.setItem('usuario', correoNormalizado);
        console.log('💾 [Login] Correo guardado (normalizado):', correoNormalizado);
      }

      // guardar rol / admin si viene del backend
      if (res?.rol) {
        localStorage.setItem('rol', res.rol);
        console.log('💾 [Login] Rol guardado:', res.rol);
      }
      if (typeof res?.esAdmin === 'boolean') {
        localStorage.setItem('esAdmin', String(res.esAdmin));
        console.log('💾 [Login] esAdmin guardado:', res.esAdmin);
      }

      this.estadoMensaje = 'success';
      this.mensaje = res?.msg ?? 'Inicio de sesión exitoso.';

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const esAdmin = res?.esAdmin || res?.rol === 'admin';

      console.log('🔁 [Login] returnUrl =', returnUrl, 'esAdmin =', esAdmin);

      setTimeout(() => {
        // 1️⃣ Caso especial: afiliado de acopio
        if (returnUrl === '/solicitud-afiliado') {
          console.log('➡️ [Login] Navegando al returnUrl especial:', returnUrl);
          this.router.navigateByUrl(returnUrl);
          return;
        }

        // 2️⃣ Admin → siempre panel admin
        if (esAdmin) {
          console.log('➡️ [Login] Navegando a /admin/componentes (admin)');
          this.router.navigate(['/admin/componentes']);
          return;
        }

        // 3️⃣ Usuario con otro returnUrl
        if (returnUrl) {
          console.log('➡️ [Login] Navegando al returnUrl:', returnUrl);
          this.router.navigateByUrl(returnUrl);
          return;
        }

        // 4️⃣ Usuario normal sin returnUrl
        console.log('➡️ [Login] Navegando a /componentes (usuario normal)');
        this.router.navigate(['/componentes']);
      }, 300);
    } catch (err: any) {
      console.error('❌ [Login] Error al iniciar sesión:', err);
      this.estadoMensaje = 'error';
      this.mensaje =
        err?.error?.msg ||
        'Correo o contraseña incorrectos. Intenta nuevamente.';
    } finally {
      this.isSubmitting = false;
      console.log('🔚 [Login] Fin de login, isSubmitting = false');
    }
  }
}
