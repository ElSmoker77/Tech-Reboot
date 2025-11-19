// src/app/components/admin/admin-solicitudes-afiliado/admin-solicitudes-afiliado.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  SolicitudAfiliadoService,
  SolicitudAfiliado,
} from '../../../services/solicitud-afiliado.service';

type EstadoSolicitud = 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada';
type FiltroEstado = 'todas' | EstadoSolicitud;

@Component({
  selector: 'app-admin-solicitudes-afiliado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-solicitudes-afiliado.component.html',
  styleUrls: ['./admin-solicitudes-afiliado.component.scss'],
})
export class AdminSolicitudesAfiliadoComponent implements OnInit {

  /** ===============================
   *  LISTAS / ESTADOS
   *  =============================== */
  solicitudes: SolicitudAfiliado[] = [];
  cargando = false;
  error: string | null = null;

  filtroEstado: FiltroEstado = 'todas';
  solicitudSeleccionada: SolicitudAfiliado | null = null;

  actualizandoEstado = false;

  /** Etiquetas humanizadas para UI */
  estadoLabels: Record<EstadoSolicitud, string> = {
    pendiente: 'Pendiente',
    en_revision: 'En revisión',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
  };

  // ✅ Toast local
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private solicitudesService: SolicitudAfiliadoService) {}

  /** ===============================
   *  INIT
   *  =============================== */
  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  /** ===============================
   *  CARGA DE SOLICITUDES
   *  =============================== */
  cargarSolicitudes(): void {
    this.cargando = true;
    this.error = null;

    const estadoParam =
      this.filtroEstado === 'todas' ? undefined : this.filtroEstado;

    this.solicitudesService.getSolicitudes(estadoParam).subscribe({
      next: (data) => {
        /** Ordenamos por fecha más reciente primero */
        this.solicitudes = [...data].sort((a, b) => {
          const fechaA = new Date(a.fechaSolicitud || a.createdAt || '').getTime();
          const fechaB = new Date(b.fechaSolicitud || b.createdAt || '').getTime();
          return fechaB - fechaA;
        });

        this.cargando = false;
        this.showToast('success', 'Solicitudes cargadas correctamente.');
      },
      error: (err) => {
        console.error(err);
        this.error =
          err?.error?.error || 'No se pudieron obtener las solicitudes';
        this.cargando = false;
        this.showToast('error', this.error);
      },
    });
  }

  /** Cambiar filtro y recargar */
  onCambiarFiltroEstado(estado: FiltroEstado): void {
    this.filtroEstado = estado;
    this.cargarSolicitudes();
  }

  /** ===============================
   *  DETALLE (popup tipo panel glass)
   *  =============================== */
  verDetalle(s: SolicitudAfiliado): void {
    this.solicitudSeleccionada = s;
  }

  cerrarDetalle(): void {
    this.solicitudSeleccionada = null;
  }

  /** ===============================
   *  CAMBIO DE ESTADO
   *  =============================== */
  cambiarEstado(
    solicitud: SolicitudAfiliado,
    nuevoEstado: EstadoSolicitud
  ): void {
    if (!solicitud._id) return;
    if (solicitud.estado === nuevoEstado) return;

    const confirmar = confirm(
      `¿Seguro que quieres cambiar el estado a "${this.estadoLabels[nuevoEstado]}"?`
    );

    if (!confirmar) return;

    this.actualizandoEstado = true;

    this.solicitudesService
      .actualizarEstado(solicitud._id, nuevoEstado)
      .subscribe({
        next: (resp) => {
          solicitud.estado = resp?.solicitud?.estado || nuevoEstado;
          this.actualizandoEstado = false;
          this.showToast(
            'success',
            `Estado actualizado a "${this.estadoLabels[solicitud.estado as EstadoSolicitud]}".`
          );
        },
        error: (err) => {
          console.error(err);
          const msg =
            err?.error?.error ||
            'No se pudo actualizar el estado de la solicitud';
          this.actualizandoEstado = false;
          this.showToast('error', msg);
        },
      });
  }

  /** ===============================
   *  UI HELPERS
   *  =============================== */

  /** Devuelve la clase visual según el estado */
  badgeClass(estado?: string): string {
    switch (estado) {
      case 'pendiente':
        return 'badge badge--warning';
      case 'en_revision':
        return 'badge badge--info';
      case 'aprobada':
        return 'badge badge--success';
      case 'rechazada':
        return 'badge badge--danger';
      default:
        return 'badge';
    }
  }

  formatearFecha(fecha?: Date | string): string {
    if (!fecha) return '-';
    const f = new Date(fecha);

    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0');
    const año = f.getFullYear();

    const horas = f.getHours().toString().padStart(2, '0');
    const minutos = f.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  }

  /** ===============================
   *  TOAST LOCAL
   *  =============================== */
  private showToast(type: 'success' | 'error', message: string): void {
    this.toastType = type;
    this.toastMessage = message;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000); // 5 segundos
  }
}
