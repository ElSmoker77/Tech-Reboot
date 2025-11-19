import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface MiembroEquipo {
  nombre: string;
  rol: string;
  descripcion: string;
  email: string;
  foto: string;
}

@Component({
  selector: 'app-equipo',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})

export class EquipoComponent {
  miembros: MiembroEquipo[] = [
   {
  nombre: 'Erwin Ormeño',
  rol: 'Coordinador General / TI',
  descripcion:
    'Coordina Tech Reboot, gestiona los puntos de acopio en Los Sauces y se encarga de la organización, documentación y soporte TI.',
  email: 'erwin@techreboot.cl',
  foto: 'assets/equipo/erwin.png',
},
{
  nombre: 'Jean Herrera',
  rol: 'Desarrollador Frontend',
  descripcion:
    'Diseña y desarrolla la interfaz web, cuida la experiencia de usuario y apoya en la documentación técnica.',
  email: 'jean@techreboot.cl',
  foto: 'assets/equipo/jean.png',
},
{
  nombre: 'Isaías Mayer',
  rol: 'Desarrollador Backend',
  descripcion:
    'Implementa la lógica del servidor, conecta con la base de datos, desarrolla las APIs y participa en el despliegue de la plataforma.',
  email: 'isaias@techreboot.cl',
  foto: 'assets/equipo/isaias.png',
},

  ];
}
