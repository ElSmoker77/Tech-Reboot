import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ResiduoDegradacion {
  id: number;
  nombre: string;
  icono: string;
  tiempoLabel: string;
  categoriaTiempo: string;
  tipo: string;
  resumen: string;
  impacto: string[];
  consejo: string;
  ejemplo: string;
  posicion: number; // 0–100: posición a lo largo de la barra
}

@Component({
  selector: 'app-lineatiempo-degradacion',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './lineatiempo-degradacion.html',
  styleUrls: ['./lineatiempo-degradacion.scss'],
})
export class LineatiempoComponent {
 residuos: ResiduoDegradacion[] = [
  {
    id: 1,
    nombre: 'Cáscara de fruta',
    icono: '🍌',
    tiempoLabel: '3–6 meses',
    categoriaTiempo: 'Meses',
    tipo: 'Orgánico',
    posicion: 10, // lo que menos dura
    resumen:
      'Residuo orgánico que, en condiciones adecuadas, se descompone rápidamente y puede convertirse en abono.',
    impacto: [
      'Si termina en un vertedero y no se separa, se descompone sin oxígeno y genera metano, un gas de efecto invernadero muy potente.',
      'Si se composta, mejora la calidad del suelo y devuelve nutrientes al ecosistema.',
    ],
    consejo:
      'Separa siempre los restos de frutas y verduras y llévalos a compostaje domiciliario o comunitario.',
    ejemplo:
      'Una familia que composta sus residuos orgánicos puede reducir hasta un 40% el volumen de basura que saca cada semana.',
  },
  {
    id: 2,
    nombre: 'Cartón de embalaje',
    icono: '📦',
    tiempoLabel: '6–12 meses',
    categoriaTiempo: 'Meses',
    tipo: 'Papel / Cartón',
    posicion: 18,
    resumen:
      'El cartón se degrada en menos de un año, pero su producción implica consumo de agua, energía y tala de árboles.',
    impacto: [
      'Si no se recicla, aumenta la demanda de fibra virgen para fabricar nuevos empaques.',
      'Al degradarse libera a la atmósfera el carbono que almacenaba la madera de origen.',
    ],
    consejo:
      'Aplasta las cajas, mantenlas limpias y deposítalas en el contenedor de reciclaje de papel/cartón.',
    ejemplo:
      'Reutilizar cajas para envíos, mudanzas o almacenamiento alarga su vida útil antes de reciclarlas.',
  },
  {
    id: 3,
    nombre: 'Cables y cargadores',
    icono: '🔌',
    tiempoLabel: '50–100 años',
    categoriaTiempo: 'Años / Décadas',
    tipo: 'Residuos electrónicos',
    posicion: 28,
    resumen:
      'Están hechos de plásticos y metales. Los plásticos tardan décadas en degradarse y los metales pueden permanecer siglos.',
    impacto: [
      'Si se queman a cielo abierto para recuperar cobre u otros metales, liberan gases tóxicos y contaminan el aire.',
      'Cuando se abandonan en la naturaleza, los plásticos se fragmentan en microplásticos que llegan a suelos y cuerpos de agua.',
    ],
    consejo:
      'No los botes con la basura común. Llévalos a campañas o puntos limpios especializados en residuos electrónicos.',
    ejemplo:
      'Un pequeño contenedor en casa para cables y cargadores en desuso ayuda a acumularlos y llevarlos juntos a reciclaje responsable.',
  },
  {
    id: 4,
    nombre: 'Placas madre y circuitos',
    icono: '🖥️',
    tiempoLabel: 'Más de 100 años',
    categoriaTiempo: 'Décadas / Siglos',
    tipo: 'Residuos electrónicos',
    posicion: 38,
    resumen:
      'Las placas electrónicas mezclan metales, plásticos y componentes con trazas de sustancias peligrosas, muy difíciles de degradar.',
    impacto: [
      'Si se gestionan mal, pueden liberar metales pesados como plomo o cadmio, contaminando suelos y aguas.',
      'Su reciclaje permite recuperar metales valiosos (cobre, oro, plata) y reducir la extracción minera.',
    ],
    consejo:
      'Entrega computadores y placas madre en programas formales de reciclaje o reacondicionamiento, nunca en vertederos informales.',
    ejemplo:
      'Muchas organizaciones reacondicionan computadores donados para uso educativo, alargando su vida útil antes de reciclar componentes.',
  },
  {
    id: 6,
    nombre: 'Pantallas y monitores',
    icono: '🖥️',
    tiempoLabel: 'Más de 100 años',
    categoriaTiempo: 'Siglos',
    tipo: 'Residuos electrónicos',
    posicion: 48,
    resumen:
      'Las pantallas contienen vidrio, plásticos y, según la tecnología, sustancias peligrosas que requieren manejo especializado.',
    impacto: [
      'Un monitor mal gestionado puede filtrar sustancias tóxicas a suelos y aguas subterráneas.',
      'Su reciclaje controlado permite recuperar materiales y evitar riesgos para la salud.',
    ],
    consejo:
      'Nunca dejes pantallas en la calle o basurero común. Llévalas a puntos de acopio de residuos electrónicos autorizados.',
    ejemplo:
      'Muchas municipalidades realizan campañas específicas para recoger televisores y monitores antiguos de manera segura.',
  },
  {
    id: 8,
    nombre: 'Pequeños electrodomésticos',
    icono: '🔧',
    tiempoLabel: 'Más de 100 años',
    categoriaTiempo: 'Siglos',
    tipo: 'Residuos electrónicos',
    posicion: 58,
    resumen:
      'Tostadoras, radios, juguetes electrónicos y otros aparatos combinan plásticos, metales y componentes electrónicos de larga vida.',
    impacto: [
      'Abandonados en vertederos informales se desarman y se queman a cielo abierto, liberando sustancias tóxicas.',
      'Gran parte de sus materiales puede reciclarse o reutilizarse si se gestionan correctamente.',
    ],
    consejo:
      'Antes de botar un aparato, revisa si puede repararse o donarse. Cuando ya no funcione, entrégalo a un sistema de reciclaje formal.',
    ejemplo:
      'Un taller comunitario de reparación ayuda a alargar la vida de electrodomésticos y reduce la cantidad de residuos electrónicos.',
  },
  {
    id: 9,
    nombre: 'Computador completo',
    icono: '💻',
    tiempoLabel: 'Hasta cientos de años',
    categoriaTiempo: 'Décadas / Siglos',
    tipo: 'Residuos electrónicos',
    posicion: 68,
    resumen:
      'Un computador reúne todos los componentes anteriores: plásticos, metales, placas y, muchas veces, baterías.',
    impacto: [
      'Si se abandona como basura común, casi todos sus materiales quedarán en el ambiente por décadas o siglos.',
      'Cuando se recicla de forma adecuada, se recuperan metales y se reduce la necesidad de extraer recursos naturales.',
    ],
    consejo:
      'Entrega computadores en desuso a programas de reacondicionamiento o reciclaje de residuos electrónicos autorizados.',
    ejemplo:
      'Empresas y oficinas pueden donar lotes de computadores antiguos a programas que los reacondicionan para escuelas o bibliotecas.',
  },
  {
    id: 5,
    nombre: 'Carcasas plásticas',
    icono: '📱',
    tiempoLabel: '100–500 años',
    categoriaTiempo: 'Siglos',
    tipo: 'Plástico de equipos',
    posicion: 78,
    resumen:
      'Las carcasas de celulares, controles y otros dispositivos son plásticos de alta resistencia que tardan siglos en degradarse.',
    impacto: [
      'Pueden fragmentarse en microplásticos que permanecen en el ambiente y entran en la cadena alimentaria.',
      'Su producción depende del petróleo y genera emisiones de gases de efecto invernadero.',
    ],
    consejo:
      'Protege tus dispositivos para alargar su vida útil y prefiere repararlos antes de cambiarlos solo por estética.',
    ejemplo:
      'Usar fundas y vidrios protectores reduce golpes y rayas, evitando que un celular funcional termine desechado antes de tiempo.',
  },
  {
    id: 7,
    nombre: 'Baterías de litio',
    icono: '🔋',
    tiempoLabel: '100–1000 años',
    categoriaTiempo: 'Siglos',
    tipo: 'Residuos peligrosos',
    posicion: 88, // lo que más dura
    resumen:
      'Las baterías de litio de celulares, notebooks y otros equipos tardan muchísimo en degradarse y contienen sustancias peligrosas.',
    impacto: [
      'Si se perforan o se exponen al calor pueden incendiarse o explotar, generando incendios en vertederos.',
      'Metales y electrolitos pueden filtrarse y contaminar suelos y cuerpos de agua.',
    ],
    consejo:
      'Guarda las baterías usadas en un lugar seguro y entrégalas solo en puntos limpios o campañas de recolección autorizadas.',
    ejemplo:
      'Al comprar un nuevo dispositivo, pregunta si reciben tu equipo anterior y sus baterías para gestión responsable.',
  },
];


  seleccionado: ResiduoDegradacion = this.residuos[0];

  seleccionarResiduo(residuo: ResiduoDegradacion): void {
    this.seleccionado = residuo;
  }
}
