import { Component, AfterViewInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-localizacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.css']
})
export class LocalizacionComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;

  constructor(
    private router: Router,
    private el: ElementRef,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initMap();

        const tiempos = [300, 1000, 2000, 4000];
        tiempos.forEach(t => setTimeout(() => this.map.invalidateSize(), t));
      }, 800);
    });
  }

  private ensureMapVisible(): void {
    const mapContainer = this.el.nativeElement.querySelector('#map');

    if (!mapContainer) return;

    const checkSize = setInterval(() => {
      const { width, height } = mapContainer.getBoundingClientRect();
      if (width > 0 && height > 0) {
        clearInterval(checkSize);
        this.initMap();
      }
    }, 100);
  }

  private initMap(): void {
    // Centro del mapa en tu coordenada
    const centroMapa: L.LatLngExpression = [-37.855140, -72.692049];

    if (this.map) {
      this.map.off();
      this.map.remove();
    }

    this.map = L.map('map', {
      center: centroMapa,
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      detectRetina: true
    }).addTo(this.map);
    
    const icon = L.icon({
      iconUrl: 'assets/Icono_Mapa/icono-reciclaje.png',
      iconSize: [48, 48],     // tamaño recomendado
      iconAnchor: [24, 48],   // ancla inferior al centro
      popupAnchor: [0, -40]   // posiciona el popup arriba del icono
    });

    // Puntos de acopio
    const puntos = [
      // Punto Angol, Depa Isa
      { nombre: 'Tech Reboot Centro', coords: [-37.789443, -72.697032] },
      // Punto Angol, Casa Fercita ñinda <3
      { nombre: 'Tech Reboot Este', coords: [-37.816015, -72.709995] },
      // Punto Valle San Juan, Casa Jean
      { nombre: 'Punto de Acopio Principal', coords: [-37.855140, -72.692049] },
      // Punto Los Sauces, Casa Maty
      { nombre: 'Punto de Acopio Los Sauces', coords: [-37.97734679105822, -72.84440895139338] },
      // Punto Purén, Casa Ale
      { nombre: 'Punto de Acopio Puren', coords: [-38.03517155770511, -73.06945601405839] }
    ];

    const marcadores = puntos.map(p =>
      L.marker(p.coords as L.LatLngExpression, { icon })
        .bindPopup(`<b>${p.nombre}</b><br>Punto de reciclaje`)
        .addTo(this.map)
    );

    const grupo = L.featureGroup(marcadores);
    const bounds = grupo.getBounds().pad(0.2);
    this.map.fitBounds(bounds, { animate: true, maxZoom: 14 });

    setTimeout(() => {
      this.map.invalidateSize(true);
      this.map.fitBounds(bounds, { animate: true, maxZoom: 14 });
    }, 800);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }
}