import { Component } from '@angular/core';
import {
  ECONOMIA_CIRCULAR_STEPS,
  CircularStep,
  StepId,
} from './economia-circular.data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diagramaeconomia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagramaeconomia.html',
  styleUrls: ['./diagramaeconomia.scss'],
})
export class Diagramaeconomia {
  steps: CircularStep[] = ECONOMIA_CIRCULAR_STEPS;

  // id de la etapa seleccionada (para resaltar el ítem del círculo)
  selectedStepId: StepId = 'centro';

  // objeto con la info de la etapa seleccionada (para el panel derecho)
  selectedStep: CircularStep =
    this.steps.find((s) => s.id === this.selectedStepId) ?? this.steps[0];

  selectStep(id: StepId): void {
    this.selectedStepId = id;
    const found = this.steps.find((s) => s.id === id);
    if (found) {
      this.selectedStep = found;
    }
  }
}
