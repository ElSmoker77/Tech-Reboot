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

import { AuthService } from '../../services/auth.service'; // 👈 versión pro

type Stat = { label: string; value: number };
type InfoTab = 'economia' | 'degradacion' | 'preacopio';

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

  // 🚀 Versión PRO: decide destino según backend
  async irARegistroComponentes() {
    // si no está logueado → login
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/componentes' } });
      return;
    }

    const esAdmin = await this.auth.isAdminFromApi();

    if (esAdmin) {
      // 👑 Admin
      this.router.navigate(['/admin/componentes']);
    } else {
      // 👤 Usuario normal
      this.router.navigate(['/componentes']);
    }
  }
}
