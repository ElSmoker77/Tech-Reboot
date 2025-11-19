// src/app/components/admin/admin.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminLayoutComponent {
  sidebarAbierto = true;

  // ✅ Toast integrado
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private router: Router, private auth: AuthService) {}

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  onNavClick() {
    if (window.innerWidth < 992) {
      this.sidebarAbierto = false;
    }
  }

  logout() {
    // usar el servicio para limpiar sesión
    this.auth.logout();

    // mostrar toast de "sesión cerrada"
    this.showToast('success', 'Sesión cerrada correctamente.');

    // esperar para que el usuario lo vea y redirigir
    setTimeout(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    }, 800);
  }

  // 📌 Método de toast (del código nuevo)
  private showToast(type: 'success' | 'error', message: string): void {
    this.toastType = type;
    this.toastMessage = message;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);
  }
}
