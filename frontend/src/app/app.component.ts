import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { iniciarParticulas } from './particles';
import { startLeafRain } from 'src/leaf-rain';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ position: 'fixed', width: '100%' })
        ], { optional: true }),
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            animate('400ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true }),
          query(':leave', [
            style({ opacity: 1 }),
            animate('300ms ease', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Tech Reboot';

 async ngAfterViewInit(): Promise<void> {
    try {
      await iniciarParticulas();
      startLeafRain();

    } catch (e) {
      console.warn('Error iniciando partículas', e);
    }
  }
}