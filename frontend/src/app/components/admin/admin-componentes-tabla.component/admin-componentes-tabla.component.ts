import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponenteServicio, Componente } from 'src/app/services/componentes.service';

@Component({
  selector: 'app-admin-componentes-tabla',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-componentes-tabla.component.html',
  styleUrls: ['./admin-componentes-tabla.component.scss']
})
export class AdminComponentesTablaComponent implements OnInit {
  // Lista completa desde backend
  listaComponentes: Componente[] = [];
  // Lista filtrada (por buscador)
  listaFiltrada: Componente[] = [];

  // Buscador
  filtro: string = '';

  // Para saber si el usuario es admin
  esAdmin = false;

  // Para el panel de detalle
  componenteSeleccionado: Componente | null = null;

  // Edición parcial por fila
  editingId: string | null = null;
  editBuffer: {
    estado?: string;
    ubicacion?: string;
    responsable?: string;
  } = {};

  // opciones (reutilizamos las que ya usas)
  estados = ['reacondicionable', 'reutilizable', 'desecho'];

  // Toast local
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private servicio: ComponenteServicio) {}

  ngOnInit(): void {
    const correo = localStorage.getItem('usuario') || '';
    this.esAdmin = this.servicio.esAdminEmail(correo);
    this.cargarTodos();
  }

  // Traer todos los componentes (sin filtro de usuario)
  cargarTodos(): void {
    this.servicio.getComponentes().subscribe({
      next: (data) => {
        this.listaComponentes = data || [];
        this.listaFiltrada = [...this.listaComponentes];
      },
      error: (err) => {
        console.error('Error al cargar componentes (admin):', err);
        this.showToast('error', 'No se pudieron cargar los componentes.');
      }
    });
  }

  // Buscador básico
  filtrar(): void {
    const texto = this.filtro.trim().toLowerCase();
    if (!texto) {
      this.listaFiltrada = [...this.listaComponentes];
      return;
    }

    this.listaFiltrada = this.listaComponentes.filter((c) =>
      (c.nombre || '').toLowerCase().includes(texto) ||
      (c.categoria || '').toLowerCase().includes(texto) ||
      (c.estado || '').toLowerCase().includes(texto) ||
      (c.responsable || '').toLowerCase().includes(texto) ||
      (c.usuarioEmail || '').toLowerCase().includes(texto) ||
      (c.ubicacion || '').toLowerCase().includes(texto)
    );
  }

  // Empezar a editar una fila (solo algunos campos)
  comenzarEdicion(c: Componente): void {
    this.editingId = c._id || null;
    this.editBuffer = {
      estado: c.estado,
      ubicacion: c.ubicacion,
      responsable: c.responsable
    };
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.editingId = null;
    this.editBuffer = {};
  }

  // Guardar cambios de una fila
  guardarEdicion(c: Componente): void {
    if (!c._id) return;

    const payload: Componente = {
      ...c,
      estado: this.editBuffer.estado ?? c.estado,
      ubicacion: this.editBuffer.ubicacion ?? c.ubicacion,
      responsable: this.editBuffer.responsable ?? c.responsable
    };

    this.servicio.updateComponente(c._id, payload).subscribe({
      next: (upd) => {
        const idx = this.listaComponentes.findIndex((x) => x._id === c._id);
        if (idx !== -1) {
          this.listaComponentes[idx] = upd;
        }
        this.filtrar();
        this.cancelarEdicion();
        this.showToast('success', 'Componente actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar componente:', err);
        this.showToast('error', 'No se pudo actualizar el componente.');
      }
    });
  }

  // Eliminar componente
  eliminar(c: Componente): void {
    if (!c._id) return;
    const ok = confirm(`¿Eliminar el componente "${c.nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;

    this.servicio.deleteComponente(c._id).subscribe({
      next: () => {
        this.listaComponentes = this.listaComponentes.filter((x) => x._id !== c._id);
        this.filtrar();
        this.showToast('success', 'Componente eliminado correctamente.');
      },
      error: (err) => {
        console.error('Error al eliminar componente:', err);
        this.showToast('error', 'No se pudo eliminar el componente.');
      }
    });
  }

  // Detalles (panel estilo solicitudes)
  verDetalles(c: Componente): void {
    this.componenteSeleccionado = c;
  }

  cerrarDetalles(): void {
    this.componenteSeleccionado = null;
  }

  // Toast helper
  private showToast(type: 'success' | 'error', message: string): void {
    this.toastType = type;
    this.toastMessage = message;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000); // 5 segundos
  }
}
