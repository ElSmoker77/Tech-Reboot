// lineatiempo-preacopio.data.ts

export type BloquePreacopio =
  | 'Antes de salir de casa'
  | 'En el punto de acopio'
  | 'Cómo seguimos nosotros';

export interface PasoPreacopio {
  id: number;
  bloque: BloquePreacopio;
  tituloCorto: string;
  titulo: string;
  icono: string;
  resumenCorto: string;
  descripcion: string;
  puntos: string[];
  mensajeExtra?: string;
  imagen: string;           // 👈 NUEVO: ruta de imagen
}

export const PASOS_PREACOPIO: PasoPreacopio[] = [
  // 🧩 Bloque 1: Antes de salir de casa
  {
    id: 1,
    bloque: 'Antes de salir de casa',
    tituloCorto: 'Identifica tu residuo',
    titulo: 'Paso 1 · Identifica tu residuo',
    icono: '🔍',
    resumenCorto: 'Ten claro qué vas a entregar y si realmente ya no lo usarás.',
    descripcion:
      'Antes de salir de casa, define qué tipo de residuo electrónico vas a llevar y asegúrate de que no sea algo que todavía puedas usar o recuperar.',
    puntos: [
      'Puede ser: notebook, cargador, celular, tele, ampolletas, batería, etc.',
      'Piensa si realmente ya no lo vas a usar o si podría reutilizarse.',
      'Si el equipo aún funciona, considera primero donarlo, venderlo o repararlo.',
    ],
    imagen: 'assets/preacopio/paso-1.png',
  },
  {
    id: 2,
    bloque: 'Antes de salir de casa',
    tituloCorto: 'Desconecta y limpia',
    titulo: 'Paso 2 · Desconecta y limpia de forma segura',
    icono: '🧹',
    resumenCorto:
      'Desenchufa, deja que se enfríe y limpia sin desarmar el equipo.',
    descripcion:
      'Manipula tus equipos con calma para evitar daños o accidentes antes de llevarlos al punto de acopio.',
    puntos: [
      'Desenchufa el equipo y espera unos minutos si se calentaba.',
      'No lo abras ni desarmes si no sabes: hay partes peligrosas (condensadores, baterías, tubos, etc.).',
      'Límpialo suavemente con un paño seco para retirar polvo y suciedad.',
      'Si tiene vidrios o partes cortantes, envuélvelo en cartón o plástico burbuja para evitar accidentes.',
    ],
    imagen: 'assets/preacopio/paso-2.png',
  },
  {
    id: 3,
    bloque: 'Antes de salir de casa',
    tituloCorto: 'Protege tus datos',
    titulo: 'Paso 3 · Protege tus datos (para dispositivos con memoria)',
    icono: '🔒',
    resumenCorto:
      'Haz respaldo, borra tus datos y retira tarjetas SIM/SD antes de entregar.',
    descripcion:
      'En equipos con memoria, el cuidado de tu información es clave antes de entregar el dispositivo.',
    puntos: [
      'Aplica a: computadores, notebooks, tablets, celulares, discos duros y pendrives.',
      'Haz respaldo de la información importante que quieras conservar.',
      'Cierra sesión en tus cuentas (Google, Apple ID, redes sociales, correos, etc.).',
      'Restablece el dispositivo a valores de fábrica o borra los datos desde Ajustes.',
      'Retira la tarjeta SIM y la tarjeta SD si corresponde.',
    ],
    mensajeExtra: 'Antes de entregar → borra tus datos y retira SIM/SD.',
    imagen: 'assets/preacopio/paso-3.png',
  },
  {
    id: 4,
    bloque: 'Antes de salir de casa',
    tituloCorto: 'Separa elementos',
    titulo: 'Paso 4 · Separa elementos especiales (sin desarmar equipos)',
    icono: '🧩',
    resumenCorto:
      'Baterías, cables y ampolletas, mejor separados para un manejo más seguro.',
    descripcion:
      'Si puedes, agrupa ciertos elementos por separado para que el manejo en el punto de acopio sea más seguro y ordenado.',
    puntos: [
      'Agrupa baterías sueltas (pilas, baterías de litio, baterías de notebook).',
      'Separa cables y cargadores en un paquete aparte.',
      'Junta ampolletas y tubos fluorescentes con cuidado: son frágiles.',
      'No abras baterías ni equipos sellados. Si algo está hinchado, quemado o con olor raro, coméntalo en el punto de acopio.',
    ],
    imagen: 'assets/preacopio/paso-4.png',
  },
  {
    id: 5,
    bloque: 'Antes de salir de casa',
    tituloCorto: 'Embala y etiqueta',
    titulo: 'Paso 5 · Embala y etiqueta',
    icono: '📦',
    resumenCorto:
      'Usa una caja resistente y, si puedes, agrega una nota con lo que entregas.',
    descripcion:
      'Un buen embalaje protege tus equipos y facilita el trabajo de clasificación cuando llegas al punto de acopio.',
    puntos: [
      'Usa una caja o bolsa resistente para trasladar tus residuos.',
      'Guarda piezas pequeñas en bolsas dentro de la caja para que no se pierdan.',
      'Opcional: agrega una nota corta indicando qué contiene la caja.',
    ],
    mensajeExtra:
      'Ejemplo de etiqueta: “Residuo electrónico – 1 notebook, 2 cargadores, 3 pilas AA”.',
    imagen: 'assets/preacopio/paso-5.png',
  },

  // 🧩 Bloque 2: En el punto de acopio
  {
    id: 6,
    bloque: 'En el punto de acopio',
    tituloCorto: 'Anúnciate al llegar',
    titulo: 'Paso 6 · Al llegar, avísanos',
    icono: '👋',
    resumenCorto:
      'Al llegar al punto de acopio, avisa que traes residuos electrónicos.',
    descripcion:
      'En el punto de acopio te ayudamos a clasificar y manejar correctamente tus residuos.',
    puntos: [
      'Al llegar, coméntale al equipo que traes residuos electrónicos.',
      'Te indicarán en qué contenedor va cada tipo de residuo.',
      'Si traes algo peligroso (batería hinchada, tubo roto, olor extraño), menciónalo para que se gestione aparte.',
    ],
    mensajeExtra:
      'Mensaje clave: “Al llegar, avísanos: te ayudamos a clasificar”.',
    imagen: 'assets/preacopio/paso-6.png',
  },
  {
    id: 7,
    bloque: 'En el punto de acopio',
    tituloCorto: 'Entrega y clasificación',
    titulo: 'Paso 7 · Entrega y clasificación',
    icono: '📥',
    resumenCorto:
      'Entregas tus residuos por categoría: grandes equipos, pequeños, cables, baterías, luminarias.',
    descripcion:
      'En esta etapa tus residuos se distribuyen en las categorías adecuadas para su manejo responsable.',
    puntos: [
      'Grandes equipos: TVs, monitores, CPU, impresoras, etc.',
      'Pequeños equipos: celulares, tablets, relojes, accesorios.',
      'Cables y cargadores, agrupados y sin enredos cuando sea posible.',
      'Baterías y pilas, separadas del resto de los equipos.',
      'Luminarias: ampolletas y tubos fluorescentes, con manejo especial.',
    ],
    mensajeExtra:
      'Si lo deseas, puedes dejar un correo o contacto para asociar tu entrega a sistemas de trazabilidad o certificados.',
    imagen: 'assets/preacopio/paso-7.png',
  },

  // 🧩 Bloque 3: Cómo seguimos nosotros
  {
    id: 8,
    bloque: 'Cómo seguimos nosotros',
    tituloCorto: 'Recepción y registro',
    titulo: 'Recepción y registro de tus residuos',
    icono: '📝',
    resumenCorto:
      'Registramos lo que recibimos para llevar control y trazabilidad.',
    descripcion:
      'Una vez que entregas tus residuos, comienza nuestro proceso interno para gestionarlos de forma responsable.',
    puntos: [
      'Pesamos o contamos los residuos según su tipo.',
      'Podemos asociar la entrega a tu nombre, organización o empresa (si corresponde).',
    ],
    imagen: 'assets/preacopio/paso-8.png',
  },
  {
    id: 9,
    bloque: 'Cómo seguimos nosotros',
    tituloCorto: 'Pre-clasificación',
    titulo: 'Pre-clasificación y evaluación',
    icono: '🧪',
    resumenCorto:
      'Separamos por tipo de residuo y detectamos elementos peligrosos.',
    descripcion:
      'Realizamos una pre-clasificación para definir el mejor destino para cada tipo de residuo.',
    puntos: [
      'Separamos por tipo de residuo y nivel de peligrosidad.',
      'Derivamos algunos materiales a gestores autorizados (por ejemplo, baterías y luminarias).',
    ],
    imagen: 'assets/preacopio/paso-9.png',
  },
  {
    id: 10,
    bloque: 'Cómo seguimos nosotros',
    tituloCorto: 'Desmontaje y valorización',
    titulo: 'Desmontaje y valorización',
    icono: '♻️',
    resumenCorto: 'Desarmamos equipos para recuperar materiales reciclables.',
    descripcion:
      'En esta etapa se aprovechan al máximo los materiales que contienen los equipos que entregaste.',
    puntos: [
      'Desarmamos los equipos en partes: plásticos, metales, placas electrónicas, etc.',
      'Lo que se puede reciclar se envía a recicladores especializados.',
      'Lo que no se puede reciclar se deriva a disposición final controlada.',
    ],
    imagen: 'assets/preacopio/paso-10.png',
  },
  {
    id: 11,
    bloque: 'Cómo seguimos nosotros',
    tituloCorto: 'Trazabilidad e impacto',
    titulo: 'Trazabilidad e impacto',
    icono: '📊',
    resumenCorto:
      'Registramos datos para medir impacto y, si aplica, emitir reportes.',
    descripcion:
      'Finalmente registramos la gestión realizada para transparentar y mejorar el impacto ambiental.',
    puntos: [
      'Registramos peso y tipo de materiales gestionados.',
      'Con estos datos es posible generar reportes de impacto y, si tu servicio lo incluye, certificados de gestión responsable.',
    ],
    mensajeExtra:
      'Así evitamos que tus residuos electrónicos terminen en vertederos y los transformamos en nuevos recursos.',
    imagen: 'assets/preacopio/paso-11.png',
  },
];
