import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponenteServicio, Componente } from 'src/app/services/componentes.service';
import { ToastrService } from 'ngx-toastr';

// Extiende la interfaz para incluir pesoKg sin tocar el service
type ComponenteConPeso = Componente & {
  pesoKg?: number | null;
};

@Component({
  selector: 'app-admin-componentes-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ComponenteServicio],
  templateUrl: './admin-componentes-form.component.html',
  styleUrls: ['./admin-componentes-form.component.scss']
})
export class AdminComponentesFormComponent implements OnInit {

  // 🧩 Modelo del formulario
  componente: Partial<ComponenteConPeso> = {
    nombre: '',
    categoria: '',
    estado: '',
    descripcion: '',
    ubicacion: '',
    fechaIngreso: '',
    responsable: '',
    pesoKg: null
  };

  guardado = false;
  isEditing = false;
  currentId: string | null = null;

  categorias = [
    'placa',
    'batería',
    'pantalla',
    'cable',
    'periférico',
    'electrodoméstico',
    'otro'
  ];

  estados = ['reacondicionable', 'reutilizable', 'desecho'];

  private readonly ADMIN_EMAIL = 'admin@techreboot.cl';

  constructor(
    private servicio: ComponenteServicio,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Seguridad extra por si alguien entra directo a la URL
    const correo = (localStorage.getItem('usuario') || '').trim().toLowerCase();
    if (correo !== this.ADMIN_EMAIL) {
      this.router.navigate(['/inicio']);
    }
  }

  // 🟢 Guardar o actualizar componente
  async guardar(form?: NgForm): Promise<void> {
    // Validación básica de template-driven form si se pasa la ref
    if (form && form.invalid) {
      form.control.markAllAsTouched();
      this.toastr.error(
        'Por favor completa los campos obligatorios.',
        'Formulario incompleto'
      );
      return;
    }

    try {
      const usuarioEmail = localStorage.getItem('usuario');
      if (!usuarioEmail) {
        this.toastr.error(
          'No se ha identificado el usuario. Inicia sesión nuevamente.',
          'Sesión no válida'
        );
        this.router.navigate(['/login']);
        return;
      }

      const payload: ComponenteConPeso = {
        ...this.componente,
        // Aseguramos que fechaIngreso sea Date
        fechaIngreso: this.parseDate(this.componente.fechaIngreso as any),
        // usuarioEmail se maneja en el servicio según tu lógica
      } as any;

      if (this.isEditing && this.currentId) {
        await this.servicio
          .updateComponente(this.currentId, payload as any)
          .toPromise();

        this.toastr.success(
          'Componente actualizado correctamente.',
          'Actualización exitosa'
        );
      } else {
        await this.servicio
          .createComponente(payload as any)
          .toPromise();

        this.toastr.success(
          'Componente registrado correctamente.',
          'Registro exitoso'
        );
      }

      this.guardado = true;
      setTimeout(() => (this.guardado = false), 1800);

      this.resetForm(form);
    } catch (err) {
      console.error('Error al guardar componente (ADMIN):', err);
      this.toastr.error(
        'No se pudo guardar el componente. Inténtalo nuevamente.',
        'Error al guardar'
      );
    }
  }

  // 🚪 Cerrar sesión
  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // 🔄 Limpiar formulario
  resetForm(form?: NgForm): void {
    this.componente = {
      nombre: '',
      categoria: '',
      estado: '',
      descripcion: '',
      ubicacion: '',
      fechaIngreso: '',
      responsable: '',
      pesoKg: null
    };
    this.isEditing = false;
    this.currentId = null;

    if (form) {
      form.resetForm();
    }
  }

  // 🗓️ Utilidades de fecha
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
