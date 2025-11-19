import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  PASOS_PREACOPIO,
  PasoPreacopio,
  BloquePreacopio,
} from './lineatiempo-preacopio.data';

@Component({
  selector: 'app-lineatiempo-preacopio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lineatiempo-preacopio.html',
  styleUrls: ['./lineatiempo-preacopio.scss'],
})
export class LineatiempoPreacopioComponent {
  pasos: PasoPreacopio[] = PASOS_PREACOPIO;

  // bloques únicos en orden de aparición
  bloques: BloquePreacopio[] = Array.from(
    new Set(this.pasos.map((p) => p.bloque))
  ) as BloquePreacopio[];

  bloqueSeleccionado: BloquePreacopio = this.bloques[0];

  pasoSeleccionado: PasoPreacopio = this.pasos[0];

  get indiceActual(): number {
    return this.pasos.findIndex((p) => p.id === this.pasoSeleccionado.id);
  }

  get totalPasos(): number {
    return this.pasos.length;
  }

  /** Pasos filtrados por el bloque seleccionado */
  get pasosDelBloque(): PasoPreacopio[] {
    return this.pasos.filter((p) => p.bloque === this.bloqueSeleccionado);
  }

  seleccionarBloque(bloque: BloquePreacopio): void {
    this.bloqueSeleccionado = bloque;

    // cuando cambia el bloque, seleccionamos el primer paso de ese bloque
    const primeroDelBloque = this.pasos.find((p) => p.bloque === bloque);
    if (primeroDelBloque) {
      this.pasoSeleccionado = primeroDelBloque;
    }
  }

  seleccionarPaso(paso: PasoPreacopio): void {
    this.pasoSeleccionado = paso;
    this.bloqueSeleccionado = paso.bloque;
  }

  irSiguiente(): void {
    const index = this.indiceActual;
    if (index < this.totalPasos - 1) {
      const siguiente = this.pasos[index + 1];
      this.pasoSeleccionado = siguiente;
      this.bloqueSeleccionado = siguiente.bloque;
    } else {
      console.log('Guía de preacopio completada ✅');
    }
  }

  irAnterior(): void {
    const index = this.indiceActual;
    if (index > 0) {
      const anterior = this.pasos[index - 1];
      this.pasoSeleccionado = anterior;
      this.bloqueSeleccionado = anterior.bloque;
    }
  }
}
