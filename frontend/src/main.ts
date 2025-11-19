import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { provideToastr } from 'ngx-toastr';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AppRoutingModule,
      FormsModule,
      HttpClientModule,
    ),
    provideAnimations(),

    // ⭐ TOAST NUEVO AGREGADO
    provideToastr({
      positionClass: 'toast-top-right',  // esquina superior derecha
      timeOut: 5000,                     // 5 segundos
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      preventDuplicates: true,
    }),
  ]
}).catch(err => console.error('Error al iniciar Angular:', err));
