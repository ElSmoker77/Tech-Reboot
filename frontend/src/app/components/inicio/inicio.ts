// src/app/components/inicio/inicio.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { LocalizacionComponent } from '../localizacion/localizacion.component';
import { ContactoComponent } from '../contacto/contacto.component';
import { Diagramaeconomia } from '../educacion/diagramaeconomia/diagramaeconomia';
import { EquipoComponent } from '../equipo/equipo';
import { LineatiempoComponent } from '../educacion/lineatiempo-degradacion/lineatiempo-degradacion';
import { LineatiempoPreacopioComponent } from '../educacion/lineatiempo-preacopio/lineatiempo-preacopio';

import {
  DashboardService,
  DashboardStatsResponse,
} from '../../services/dashboard.service';

import { AuthService } from '../../services/auth.service';

type Stat = { label: string; value: number };
type InfoTab = 'economia' | 'degradacion' | 'preacopio';

type TutorialMini = {
  id: string;
  titulo: string;
  miniatura: string;
  watchUrl: string;
  canal?: string;
};

/** Card reutilizable */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  inputs: ['title'],
  template: `
    <div class="rounded-2xl shadow-sm border border-gray-100 bg-white">
      <div class="px-5 pt-5">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
      </div>
      <div class="px-5 pb-5 text-sm text-gray-600">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class CardComponent {
  title = '';
}

/** Página completa Tech Reboot */
@Component({
  selector: 'app-techreboot',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    RouterModule,
    CardComponent,
    LocalizacionComponent,
    ContactoComponent,
    Diagramaeconomia,
    EquipoComponent,
    LineatiempoComponent,
    LineatiempoPreacopioComponent,
  ],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
})
export class TechRebootComponent implements OnInit {
  year = new Date().getFullYear();

  // 📊 Stats dinámicas
  stats: Stat[] = [];
  cargandoStats = false;
  errorStats: string | null = null;

  // pestaña seleccionada en la sección Educación
  infoTabSeleccionado: InfoTab = 'economia';

  // 🔁 estado de visibilidad de la sección de tutoriales
  mostrarTutoriales = false;

  // 🎥 Tutoriales destacados (mini versión)

    tutorialesDestacados: TutorialMini[] = [
      {
        id: 'PFl44fBRi2w',
        titulo: 'Aprendiendo sobre reciclaje de aparatos electrónicos y eléctricos',
        miniatura: 'https://img.youtube.com/vi/PFl44fBRi2w/hqdefault.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=PFl44fBRi2w',
        canal: 'Comunicación Hélice',
      },
      {
        id: 'ztKdciFqMEg',
        titulo: '¿Reciclaje de componentes electrónicos?',
        miniatura: 'https://img.youtube.com/vi/ztKdciFqMEg/hqdefault.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=ztKdciFqMEg',
        canal: 'Kit electrónica',
      },
      {
        id: '8FKjY6u1eGo',
        titulo: 'Reciclar Equipos Viejos. Componentes Electrónicos y Piezas',
        miniatura: 'https://img.youtube.com/vi/8FKjY6u1eGo/hqdefault.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=8FKjY6u1eGo',
        canal: 'El Taller de Jesus Rojas',
      },
      {
        id: 'Dmm8r3eaJsQ',
        titulo: 'Basura electrónica',
        miniatura: 'https://img.youtube.com/vi/Dmm8r3eaJsQ/hqdefault.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=Dmm8r3eaJsQ',
        canal: 'Tu Club Tecnológico',
      },

      {
        id: 'vICswvJa-Ko',
        titulo: '¿Cómo reciclar componentes electrónicos?',
        miniatura: 'https://img.youtube.com/vi/vICswvJa-Ko/hqdefault.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=vICswvJa-Ko',
        canal: 'Mundo Electrónica',
      },
      {
        id: 'Ir7fa1E3xDg',
        titulo: 'Reciclaje tecnológico - Día a Día - Teleamazonas',
        miniatura: 'https://img.youtube.com/vi/Ir7fa1E3xDg/hqdefault.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=Ir7fa1E3xDg',
        canal: 'Día a Día - Teleamazonas',
      },
      {
        id: 'dETYUOtWlhI',
        titulo: 'Cómo Hacer un Mini Robot Araña Casero',
        miniatura: 'https://img.youtube.com/vi/dETYUOtWlhI/hqdefault.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=dETYUOtWlhI',
        canal: 'Proyectos Caseros',
      },
      {
        id: 'FtS2fuveBIw',
        titulo: 'Basura Tecnológica: La intoxicación silenciosa',
        miniatura: 'https://img.youtube.com/vi/FtS2fuveBIw/hqdefault.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=FtS2fuveBIw',
        canal: 'Tecnonauta',
      }
    ];


  placeholders = {
    heroImage:
      'https://images.unsplash.com/photo-1581093458791-9d09b5c83e0a?q=80&w=1200&auto=format&fit=crop',
  };

  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarStats();
  }

  private cargarStats(): void {
    this.cargandoStats = true;
    this.errorStats = null;

    this.dashboardService.getStats().subscribe({
      next: (res: DashboardStatsResponse) => {
        this.stats = [
          { label: 'Kg recuperados', value: res.kgRecuperados },
          {
            label: 'Equipos reacondicionados / reutilizables',
            value: res.equiposReacondicionados,
          },
          { label: 'CO₂ evitado (kg aprox.)', value: res.co2EvitadoKg },
          {
            label: 'Vecinos participantes (usuarios)',
            value: res.totalUsuarios,
          },
        ];
        this.cargandoStats = false;
      },
      error: (err) => {
        console.error(err);
        this.errorStats = 'No se pudieron cargar las estadísticas';
        this.cargandoStats = false;

        // opcional: fallback en cero
        this.stats = [
          { label: 'Kg recuperados', value: 0 },
          {
            label: 'Equipos reacondicionados / reutilizables',
            value: 0,
          },
          { label: 'CO₂ evitado (kg aprox.)', value: 0 },
          { label: 'Vecinos participantes (usuarios)', value: 0 },
        ];
      },
    });
  }

  fmt(n: number): string {
    return n.toLocaleString('es-CL', { maximumFractionDigits: 1 });
  }

  cambiarTab(tab: InfoTab): void {
    this.infoTabSeleccionado = tab;
  }

  // 🔁 Mostrar / ocultar panel de tutoriales
  toggleTutoriales(): void {
    this.mostrarTutoriales = !this.mostrarTutoriales;

    if (this.mostrarTutoriales) {
      // pequeño scroll para que se vea el panel cuando se abre
      setTimeout(() => {
        const el = document.getElementById('tutoriales');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  }

  // 🚀 Versión PRO: decide destino según backend
  async irARegistroComponentes() {
    // si no está logueado → login
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/componentes' } });
      return;
    }

    const esAdmin = await this.auth.isAdminFromApi();

    if (esAdmin) {
      this.router.navigate(['/admin/componentes']);
    } else {
      this.router.navigate(['/componentes']);
    }
  }
}
