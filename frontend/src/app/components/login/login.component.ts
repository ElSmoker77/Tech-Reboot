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
    // 🚫 Si ya está logeado, no tiene sentido ver el login
    if (this.auth.isLoggedIn()) {
      const rol = localStorage.getItem('rol');
      const esAdminFlag = localStorage.getItem('esAdmin') === 'true';

      if (rol === 'admin' || esAdminFlag) {
        this.router.navigate(['/admin/componentes']);
      } else {
        this.router.navigate(['/componentes']);
      }
    }
  }

  async login() {
    if (!this.correo || !this.password) {
      this.estadoMensaje = 'error';
      this.mensaje = 'Debes ingresar tu correo y contraseña.';
      return;
    }

    this.isSubmitting = true;
    this.estadoMensaje = '';
    this.mensaje = '';

    const correoNormalizado = this.correo.trim().toLowerCase();

    try {
      const res = await this.auth.login({
        correo: correoNormalizado,
        password: this.password
      });

      // guardar token
      if (res?.token) {
        localStorage.setItem('token', res.token);
      }

      // guardar correo
      if (res?.correo) {
        localStorage.setItem('usuario', res.correo);
      } else {
        localStorage.setItem('usuario', correoNormalizado);
      }

      // guardar rol / admin si viene del backend
      if (res?.rol) {
        localStorage.setItem('rol', res.rol);
      }
      if (typeof res?.esAdmin === 'boolean') {
        localStorage.setItem('esAdmin', String(res.esAdmin));
      }

      this.estadoMensaje = 'success';
      this.mensaje = res?.msg ?? 'Inicio de sesión exitoso.';

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const esAdmin = res?.esAdmin || res?.rol === 'admin';

      setTimeout(() => {
        // 1️⃣ Caso especial: afiliado de acopio
        if (returnUrl === '/solicitud-afiliado') {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        // 2️⃣ Admin → siempre panel admin
        if (esAdmin) {
          this.router.navigate(['/admin/componentes']);
          return;
        }

        // 3️⃣ Usuario con otro returnUrl
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        // 4️⃣ Usuario normal sin returnUrl
        this.router.navigate(['/componentes']);
      }, 300);
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      this.estadoMensaje = 'error';
      this.mensaje =
        err?.error?.msg ||
        'Correo o contraseña incorrectos. Intenta nuevamente.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
