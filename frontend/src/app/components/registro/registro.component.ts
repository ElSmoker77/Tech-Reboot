import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface RegistroForm {
  nombre: string;
  correo: string;
  password: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  user: RegistroForm = { nombre: '', correo: '', password: '' };
  mensaje = '';
  estadoMensaje: 'success' | 'error' | '' = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 🚫 Si ya está logueado, no dejar entrar al registro
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

  async registrar(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      this.estadoMensaje = 'error';
      this.mensaje = 'Completa todos los campos obligatorios.';
      return;
    }

    this.isSubmitting = true;
    this.estadoMensaje = '';
    this.mensaje = '';

    const payload: RegistroForm = {
      nombre: this.user.nombre.trim(),
      correo: this.normalizarCorreo(this.user.correo),
      password: this.user.password
    };

    try {
      const res = await this.auth.register(payload);
      this.estadoMensaje = 'success';
      this.mensaje = res?.msg || 'Usuario registrado correctamente.';
      form.resetForm();
      this.user = { nombre: '', correo: '', password: '' };

      setTimeout(() => this.router.navigate(['/login']), 1800);
    } catch (error: any) {
      console.error('�?O Error al registrar:', error);
      this.estadoMensaje = 'error';

      if (error?.status === 403) {
        // Bloqueo de registro de correos admin
        this.mensaje = error?.error?.msg || 'No se permite el registro de cuentas de administrador.';
      } else if (error?.status === 400) {
        this.mensaje = error?.error?.msg || 'Este correo ya esta registrado.';
      } else {
        this.mensaje = error?.error?.msg || 'Error al registrar el usuario. Intenta mas tarde.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  volver() {
    this.router.navigate(['/login']);
  }

  private normalizarCorreo(value: string): string {
    return value?.trim().toLowerCase();
  }
}
