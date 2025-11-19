export type StepId =
  | 'materias'
  | 'diseno'
  | 'produccion'
  | 'distribucion'
  | 'consumo'
  | 'recogida'
  | 'reciclado'
  | 'centro';

export interface CircularStep {
  id: StepId;
  titulo: string;
  // Pequeño texto tipo "¿Qué es?"
  queEs: string;
  // Desarrollo principal
  detalle: string;
  // Texto de ejemplos / casos reales
  ejemplo?: string;
}

export const ECONOMIA_CIRCULAR_STEPS: CircularStep[] = [
  {
    id: 'materias',
    titulo: 'Materias primas',
    queEs:
      'Son los recursos que extraemos de la naturaleza: minerales, metales, madera, agua, combustibles y otros materiales básicos.',
    detalle: `En una economía circular no se trata de extraer cada vez más, sino de usar mejor lo que ya tenemos. Por eso se busca:
- Reducir al mínimo el uso de materia prima virgen.
- Priorizar insumos reciclados, renovables o recuperados.
- Hacer la extracción con menos impacto en agua, suelo y comunidades.
- Ver los residuos industriales como posibles nuevas materias primas.`,
    ejemplo: `La planta Magnetita de Compañía Minera del Pacífico, en Atacama, procesa relaves mineros para recuperar hierro y otros materiales. En vez de desechar esos relaves, los convierte en nueva materia prima, siendo un caso emblemático de minería circular en el país.`
  },

  {
    id: 'diseno',
    titulo: 'Diseño',
    queEs:
      'Es la etapa en la que se define de qué materiales será el producto, cuánto durará y qué tan fácil será repararlo, reutilizarlo y reciclarlo.',
    detalle: `El eco-diseño circular entiende que la mayoría del impacto ambiental se decide antes de fabricar nada. Por eso se promueve:
- Productos duraderos, reparables y actualizables.
- Menos piezas y menos tipos de materiales para facilitar el reciclaje.
- Escoger materiales reciclables y libres de sustancias peligrosas.
- Diseñar desde el inicio pensando en la reutilización y el desmontaje.`,
    ejemplo: `Emprendimientos como Idea-Tec rediseñan productos para usar residuos como insumo: transforman plumavit desechado en pintura, reduciendo el uso de materias primas vírgenes y demostrando que el diseño puede integrar el reciclaje desde el origen.`
  },

  {
    id: 'produccion',
    titulo: 'Producción y reelaboración',
    queEs:
      'Es la fase de fabricación, donde la materia prima se transforma en productos, idealmente con procesos limpios, eficientes y con baja generación de residuos.',
    detalle: `En una producción alineada con la economía circular se intenta:
- Usar energía renovable cuando sea posible y mejorar la eficiencia energética.
- Incorporar materiales reciclados o recuperados en las líneas de producción.
- Reducir, reutilizar o reciclar los residuos generados en planta.
- Aplicar remanufactura: reconstruir productos a partir de piezas usadas o recuperadas.`,
    ejemplo: `Muchos sectores productivos participan en Acuerdos de Producción Limpia (APL), compromisos voluntarios para mejorar eficiencia energética, reducir residuos y usar mejor el agua y los materiales. Son una herramienta clave para acercar la industria chilena a la economía circular.`
  },

  {
    id: 'distribucion',
    titulo: 'Distribución',
    queEs:
      'Es la etapa en la que el producto se mueve desde la fábrica hasta las personas: transporte, centros de venta y todos los embalajes usados en el camino.',
    detalle: `Una distribución circular busca que el producto viaje con el menor impacto posible, mediante:
- Menos embalajes y eliminación de envases de un solo uso innecesarios.
- Preferencia por envases reutilizables, retornables o fácilmente reciclables.
- Optimización de rutas y cargas de transporte para emitir menos CO₂.
- Logística inversa para traer de vuelta envases y productos usados.`,
    ejemplo: `Empresas y municipalidades están impulsando sistemas de envases retornables y puntos de recolección para botellas y embalajes. Así los envases vuelven a la cadena productiva en vez de terminar en rellenos sanitarios.`
  },

  {
    id: 'consumo',
    titulo: 'Consumo, utilización, reutilización, reparación',
    queEs:
      'Es la etapa en que las personas usan el producto. La lógica circular reemplaza el “usar y botar” por alargar la vida útil todo lo posible.',
    detalle: `El consumo responsable en economía circular pone el foco en cuidar lo que ya existe:
- Reparar en lugar de desechar cuando algo se daña.
- Reutilizar mediante segunda mano, intercambio, arriendo o donaciones.
- Valorar productos reacondicionados y reconstruidos.
- Sacar el máximo provecho a los equipos antes de reemplazarlos por uno nuevo.`,
    ejemplo: `Las tiendas solidarias de organizaciones como COANIQUEM reciben ropa, muebles y artículos del hogar donados por la comunidad y los ponen nuevamente en circulación. Así evitan que productos en buen estado terminen como basura y generan recursos para causas sociales.`
  },

  {
    id: 'recogida',
    titulo: 'Recogida',
    queEs:
      'Es el momento en que los productos dejan de usarse y se convierten en residuos que deben ser correctamente recolectados y separados.',
    detalle: `Sin una buena recogida, la economía circular no funciona: todo se pierde mezclado en la basura. Por eso esta etapa debe:
- Promover la separación de residuos por tipo (papel, vidrio, plásticos, metales, orgánicos, electrónicos, textiles, etc.).
- Contar con puntos limpios, campañas de devolución y sistemas puerta a puerta.
- Facilitar que los materiales lleguen a recicladores, reparadores y reutilizadores.
- Cumplir metas y obligaciones de la Ley REP y otras normas de gestión de residuos.`,
    ejemplo: `La campaña de reciclaje de vidrio de COANIQUEM y los puntos limpios municipales permiten que botellas y frascos se separen desde el origen. Ese vidrio limpio se convierte en insumo para nuevas botellas, evita residuos en vertederos y además financia programas sociales.`
  },

  {
    id: 'reciclado',
    titulo: 'Reciclado',
    queEs:
      'Es el proceso en el que los residuos se transforman nuevamente en materias primas que pueden volver a usarse en nuevos productos.',
    detalle: `El reciclaje es una pieza importante de la economía circular (aunque no la única). Cuando funciona bien:
- Reduce la extracción de recursos vírgenes y la presión sobre ecosistemas.
- Disminuye el consumo de energía en comparación con producir desde cero.
- Baja las emisiones de gases de efecto invernadero.
- Evita que materiales valiosos terminen en rellenos sanitarios o en el entorno.`,
    ejemplo: `La empresa Idea-Tec recicla plumavit, un residuo complejo de manejar, y lo convierte en pintura para uso vial y doméstico. Han reciclado decenas de toneladas de este material, demostrando que es posible transformar residuos difíciles en productos útiles.`
  },

  {
    id: 'centro',
    titulo: 'Economía circular',
    queEs:
      'Es un modelo que busca mantener los recursos en uso el mayor tiempo posible, reduciendo residuos y regenerando los sistemas naturales en lugar de agotarlos.',
    detalle: `La economía circular cambia la lógica lineal de “extraer, producir, usar y botar” por un ciclo continuo donde los materiales circulan una y otra vez.

En este enfoque se propone:
- Rediseñar productos y servicios para que generen menos residuos desde el inicio.
- Reutilizar, reparar, remanufacturar y reciclar antes de extraer nuevos recursos.
- Crear empleos verdes y modelos de negocio que integren a comunidades y territorios.
- Conectar políticas públicas, empresas y ciudadanía para cerrar el círculo entre producción y consumo.`,
    ejemplo: `La Estrategia Nacional de Economía Circular, la Ley REP, los Acuerdos de Producción Limpia y múltiples emprendimientos verdes muestran que es posible avanzar hacia un modelo donde los residuos se convierten en recursos y se reduce la presión sobre la naturaleza.`
  }
];
