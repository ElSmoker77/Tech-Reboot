import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ContactService,
  MensajeContacto,
} from '../../../services/contact.service';

@Component({
  selector: 'app-admin-contactos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-contactos.component.html',
  styleUrls: ['./admin-contactos.component.scss'],
  providers: [DatePipe],
})
export class AdminContactosComponent implements OnInit {
  mensajes: MensajeContacto[] = [];
  cargando = false;
  error: string | null = null;

  // ✅ Toast local integrado
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  // 🔍 Mensaje seleccionado para ver detalle
  mensajeSeleccionado: MensajeContacto | null = null;

  constructor(
    private contactService: ContactService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.cargarMensajes();
  }

  async cargarMensajes() {
    this.cargando = true;
    this.error = null;
    try {
      this.mensajes = await this.contactService.getMensajes();
      this.showToast('success', 'Mensajes cargados correctamente.');
    } catch (err) {
      console.error(err);
      this.error = 'No se pudieron cargar los mensajes de contacto';
      this.showToast(
        'error',
        'No se pudieron cargar los mensajes de contacto.'
      );
    } finally {
      this.cargando = false;
    }
  }

  fmtFecha(fecha: string): string {
    return (
      this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm', 'es-CL') || fecha
    );
  }

  // 👉 abrir panel de detalle
  verDetalle(mensaje: MensajeContacto): void {
    this.mensajeSeleccionado = mensaje;
  }

  // 👉 cerrar panel de detalle
  cerrarDetalle(): void {
    this.mensajeSeleccionado = null;
  }

  private showToast(type: 'success' | 'error', message: string): void {
    this.toastType = type;
    this.toastMessage = message;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000); // 5 segundos
  }
}
