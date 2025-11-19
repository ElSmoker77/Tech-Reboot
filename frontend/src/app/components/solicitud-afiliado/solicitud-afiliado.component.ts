// src/app/components/solicitud-afiliado/solicitud-afiliado.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  SolicitudAfiliadoService
} from '../../services/solicitud-afiliado.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-solicitud-afiliado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [SolicitudAfiliadoService],
  templateUrl: './solicitud-afiliado.component.html',
  styleUrls: ['./solicitud-afiliado.component.css']
})
export class SolicitudAfiliadoComponent implements OnInit {
  usuarioEmail: string | null = null;

  // Formulario de solicitud (solo USER)
  solicitud = {
    nombreCompleto: '',
    correo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    tipoOrganizacion: '',
    descripcionOrganizacion: '',
    capacidadAlmacenamiento: '',
    experienciaReciclaje: false,
    certificaciones: '',
    compromisoAmbiental: false,
    disponibilidadHoraria: '',
    mensajeAdicional: ''
  };

  toastVisible = false;
  toastMensaje = '';
  toastTipo: 'success' | 'error' = 'success';
  isSubmitting = false;

  requisitos = [
    { id: 'experiencia', label: 'Tener experiencia previa en reciclaje o gestión de residuos', checked: false },
    { id: 'espacio', label: 'Contar con espacio físico adecuado para almacenamiento temporal', checked: false },
    { id: 'compromiso', label: 'Compromiso con el cuidado del medio ambiente', checked: false },
    { id: 'disponibilidad', label: 'Disponibilidad para recibir materiales en horarios establecidos', checked: false }
  ];

  constructor(
    private service: SolicitudAfiliadoService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    // 🚫 Si no está logueado → mandarlo a login
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/solicitud-afiliado' }
      });
      return;
    }

    // si el usuario está logueado, prellenamos el correo
    this.usuarioEmail = localStorage.getItem('usuario');
    if (this.usuarioEmail) {
      this.solicitud.correo = this.usuarioEmail;
    }
  }

  async enviar(form: NgForm) {
    if (!form.valid) {
      this.mostrarToast('Por favor, completa todos los campos requeridos', 'error');
      return;
    }

    // Validar requisitos
    const requisitosCompletos = this.requisitos.every(r => r.checked);
    if (!requisitosCompletos) {
      this.mostrarToast('Debes aceptar todos los requisitos para enviar la solicitud', 'error');
      return;
    }

    // Validar checkboxes del formulario
    if (!this.solicitud.experienciaReciclaje || !this.solicitud.compromisoAmbiental) {
      this.mostrarToast('Debes confirmar tu experiencia y compromiso ambiental', 'error');
      return;
    }

    this.isSubmitting = true;

    try {
      const datosEnvio = {
        ...this.solicitud,
        requisitosAceptados: this.requisitos.map(r => ({ id: r.id, aceptado: r.checked }))
      };

      await this.service.enviarSolicitud(datosEnvio);

      this.mostrarToast('¡Solicitud enviada correctamente! Te contactaremos pronto.', 'success');

      // Resetear formulario
      this.solicitud = {
        nombreCompleto: '',
        correo: this.usuarioEmail || '',
        telefono: '',
        direccion: '',
        ciudad: '',
        region: '',
        tipoOrganizacion: '',
        descripcionOrganizacion: '',
        capacidadAlmacenamiento: '',
        experienciaReciclaje: false,
        certificaciones: '',
        compromisoAmbiental: false,
        disponibilidadHoraria: '',
        mensajeAdicional: ''
      };

      this.requisitos.forEach(r => (r.checked = false));
      form.resetForm({
        correo: this.usuarioEmail || ''
      });

      // Redirigir después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/inicio']);
      }, 3000);
    } catch (err: any) {
      console.error('Error al enviar solicitud:', err);
      this.mostrarToast(
        err?.error?.msg || 'Error al enviar la solicitud. Por favor, intenta nuevamente.',
        'error'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error'): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);
  }

  volver(): void {
    this.router.navigate(['/inicio']);
  }

  // Cerrar sesión desde esta vista
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
