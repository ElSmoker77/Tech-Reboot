import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponenteServicio, Componente } from 'src/app/services/componentes.service';

@Component({
  selector: 'app-componentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ComponenteServicio],
  templateUrl: './componentes.html',
  styleUrls: ['./componentes.scss']
})
export class ComponentesComponent implements OnInit {
  componente: Partial<Componente> = {
    nombre: '',
    categoria: '',
    estado: '',
    ubicacion: '',
    // el input[type="date"] trabaja con string 'yyyy-MM-dd'
    fechaIngreso: '',
    responsable: '',
    descripcion: '',
    pesoKg: undefined
  };

  guardado = false;
  isEditing = false;
  currentId: string | null = null;

  listaComponentes: Componente[] = [];
  listaFiltrada: Componente[] = [];

  filtro: string = '';

  // ⚖️ Total de kilos (según la lista filtrada)
  totalKg: number = 0;

  categorias = [
    'placa', 'batería', 'pantalla', 'cable',
    'periférico', 'electrodoméstico', 'otro'
  ];

  estados = ['reacondicionable', 'reutilizable', 'desecho'];

  constructor(
    private servicio: ComponenteServicio,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarComponentes();
  }

  // 🟢 Cargar los componentes del usuario logueado
  cargarComponentes(): void {
    const usuarioEmail = localStorage.getItem('usuario');
    if (!usuarioEmail) {
      console.warn('⚠️ No se encontró usuario logueado, redirigiendo al login.');
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.servicio.getComponentesPorUsuario(usuarioEmail).subscribe({
      next: (data) => {
        this.listaComponentes = data;
        this.listaFiltrada = [...data];
        this.recalcularTotalKg();
      },
      error: (err) => {
        console.error('Error al cargar componentes:', err);
        alert('No se pudieron cargar los componentes.');
      }
    });
  }

  // 🟢 Guardar o actualizar componente
  async guardar(): Promise<void> {
    try {
      const usuarioEmail = localStorage.getItem('usuario');
      if (!usuarioEmail) {
        alert('Error: No se ha identificado el usuario.');
        return;
      }

      const payload: Componente = {
        ...this.componente,
        // convertimos string del input a Date real para el backend
        fechaIngreso: this.parseDate(this.componente.fechaIngreso as string),
        usuarioEmail
      } as Componente;

      if (this.isEditing && this.currentId) {
        await this.servicio.updateComponente(this.currentId, payload).toPromise();
      } else {
        await this.servicio.createComponente(payload).toPromise();
      }

      this.guardado = true;
      setTimeout(() => (this.guardado = false), 1800);

      this.resetForm();
      this.cargarComponentes();
    } catch (err) {
      console.error('Error al guardar componente:', err);
      alert('No se pudo guardar el componente.');
    }
  }

  // ✏️ Editar componente
  editarComponente(c: Componente): void {
    this.isEditing = true;
    this.currentId = c._id ?? null;

    const fecha = c.fechaIngreso
      ? this.formatDateForInput(c.fechaIngreso)
      : '';

    this.componente = {
      nombre: c.nombre ?? '',
      categoria: c.categoria ?? '',
      estado: c.estado ?? '',
      ubicacion: c.ubicacion ?? '',
      fechaIngreso: fecha,
      responsable: c.responsable ?? '',
      descripcion: c.descripcion ?? '',
      pesoKg: c.pesoKg ?? undefined
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ❌ Eliminar componente
  async eliminarComponente(id: string): Promise<void> {
    const ok = confirm('¿Eliminar este componente? Esta acción no se puede deshacer.');
    if (!ok) return;

    try {
      await this.servicio.deleteComponente(id).toPromise();
      this.cargarComponentes();
    } catch (err) {
      console.error('Error al eliminar componente:', err);
      alert('No se pudo eliminar el componente.');
    }
  }

  // 🔍 Filtrar componentes
  filtrarComponentes(): void {
    const texto = this.filtro.trim().toLowerCase();
    if (!texto) {
      this.listaFiltrada = [...this.listaComponentes];
      this.recalcularTotalKg();
      return;
    }

    this.listaFiltrada = this.listaComponentes.filter(c =>
      c.nombre?.toLowerCase().includes(texto) ||
      c.categoria?.toLowerCase().includes(texto) ||
      c.estado?.toLowerCase().includes(texto) ||
      c.responsable?.toLowerCase().includes(texto) ||
      c.ubicacion?.toLowerCase().includes(texto)
    );

    this.recalcularTotalKg();
  }

  // ⚖️ Recalcular total de kilos según la lista filtrada
  private recalcularTotalKg(): void {
    this.totalKg = (this.listaFiltrada || []).reduce(
      (sum, c) => sum + (c.pesoKg || 0),
      0
    );
  }

  // 🚪 Cerrar sesión
  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    console.log('Sesión cerrada correctamente');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  // 🔄 Limpiar formulario
  resetForm(): void {
    this.componente = {
      nombre: '',
      categoria: '',
      estado: '',
      ubicacion: '',
      fechaIngreso: '',
      responsable: '',
      descripcion: '',
      pesoKg: undefined
    };
    this.isEditing = false;
    this.currentId = null;
  }

  // 🗓️ Utilidades para fechas
  private parseDate(value: string | Date): Date {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
