// leaf-rain.ts - genera hojas cayendo de forma aleatoria y continua
export function startLeafRain() {
  const container = document.querySelector('.leaves-layer');
  if (!container) return;

  // Esta función crea UNA hoja
  const createLeaf = () => {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';

    // posición horizontal random (0% a 100%)
    const left = Math.random() * 100;

    // duración de caída entre 16s y 26s
    const duration = 16 + Math.random() * 10;

    // pequeño delay aleatorio entre 0 y 2s
    const delay = Math.random() * 2;

    // ligera rotación inicial [-20°, 20°]
    const rotate = (Math.random() - 0.5) * 40;

    // escala entre 0.8 y 1.3 → hojas más grandes o pequeñas
    const scale = 0.8 + Math.random() * 0.5;

    // modelo de hoja (1, 2 o 3)
    const variant = 1 + Math.floor(Math.random() * 3);
    leaf.setAttribute('data-variant', String(variant));

    // estilos inline
    leaf.style.left = `${left}%`;
    leaf.style.animationDuration = `${duration}s`;
    leaf.style.animationDelay = `${delay}s`;
    leaf.style.transform = `rotate(${rotate}deg) scale(${scale})`;

    container.appendChild(leaf);

    // La hoja se elimina cuando ya terminó de caer + un pelito más
    const totalLife = (duration + delay) * 1000;
    setTimeout(() => {
      leaf.remove();
    }, totalLife + 500);
  };

  // Función recursiva para lluvia continua
  const loop = () => {
    createLeaf();

    // intervalo random entre 400ms y 800ms
    const nextIn = 400 + Math.random() * 400;

    setTimeout(loop, nextIn);
  };

  // arrancamos el loop
  loop();
}
