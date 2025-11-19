// particles.ts - Nieve verde suave de fondo para Tech Reboot
import { tsParticles } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

const CONTAINER_ID = 'particles-bg';

const getParticlesOptions = (): ISourceOptions => {
  const options: ISourceOptions = {
    background: {
      color: { value: 'transparent' },
    },
    fpsLimit: 60,
    detectRetina: true,

    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse', // sigue siendo repulse, pero MUY suave
        },
        onClick: {
          enable: true,
          mode: 'push', // deja este si te gusta sumar algunos copitos
        },
        resize: { enable: true },
      },
      modes: {
        repulse: {
          distance: 70,  // antes 140 → briza cerca del mouse, no explota todo
          duration: 0.2, // menos tiempo de empuje
          speed: 0.3,    // briza suave (si tu versión de engine soporta speed)
        },
        push: {
          quantity: 2,
        },
      },
    },

    particles: {
      color: {
        value: ['#16a34a', '#22c55e', '#4ade80'],
      },

      links: {
        enable: false,
      },

      move: {
        enable: true,
        speed: 0.45,
        direction: 'bottom',
        outModes: {
          default: 'out',
        },
        straight: false,
        gravity: {
          enable: true,
          acceleration: 0.25,
          maxSpeed: 1.1,
        },
        attract: {
          enable: false,
        },
      },

      number: {
        value: 80,
        density: {
          enable: true,
          width: 800,
          height: 600,
        },
      },

      opacity: {
        value: 0.85,
        animation: {
          enable: true,
          speed: 0.8,
         
          sync: false,
        },
      },

      shape: {
        type: 'circle',
      },

      size: {
        value: { min: 1.5, max: 3.5 },
        animation: {
          enable: true,
          speed: 1.2,
          
          sync: false,
        },
      },

      rotate: {
        value: 0,
        direction: 'clockwise',
        animation: {
          enable: false,
          speed: 0,
        },
      },

      collisions: {
        enable: true,
        mode: 'bounce',
      },
    },
  };

  return options;
};

export const iniciarParticulas = async (): Promise<void> => {
  await loadFull(tsParticles as unknown as Engine);

  await tsParticles.load({
    id: CONTAINER_ID,
    options: getParticlesOptions(),
  });
};
