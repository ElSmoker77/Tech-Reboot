// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

interface RegisterPayload {
  nombre: string;
  correo: string;
  password: string;
}

interface LoginPayload {
  correo: string;
  password: string;
}

interface AuthResponse {
  msg: string;
  token?: string;
  correo?: string;
  rol?: 'admin' | 'user';
  esAdmin?: boolean;
  nombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ✅ URL FIJA DEL BACKEND (Render)
  private apiUrl = 'https://tech-reboot.onrender.com/api/auth';

  constructor(private http: HttpClient) {
    console.log('🔧 [AuthService] apiUrl =', this.apiUrl);
  }

  private normalizarCorreo(value: string | undefined): string {
    return value?.trim().toLowerCase() ?? '';
  }

  // 🟢 Registrar usuario
  register(user: { nombre: string; correo?: string; email?: string; password: string }) {
    const payload: RegisterPayload = {
      nombre: user.nombre,
      correo: this.normalizarCorreo(user.correo ?? user.email),
      password: user.password
    };

    console.log('📨 [AuthService] POST /register →', `${this.apiUrl}/register`, payload);

    return lastValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }

  // 🟢 Iniciar sesión
  login(credentials: { correo?: string; email?: string; password: string }) {
    const payload: LoginPayload = {
      correo: this.normalizarCorreo(credentials.correo ?? credentials.email),
      password: credentials.password
    };

    console.log('📨 [AuthService] POST /login →', `${this.apiUrl}/login`, payload);

    return lastValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }

  // 🔐 Verificar sesión (solo front)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // 👤 Obtener usuario actual desde el backend (/auth/me)
  async getCurrentUser(): Promise<AuthResponse | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    try {
      console.log('📨 [AuthService] GET /me →', `${this.apiUrl}/me`);
      const res = await lastValueFrom(
        this.http.get<AuthResponse>(`${this.apiUrl}/me`, { headers })
      );
      console.log('✅ [AuthService] Respuesta /me:', res);
      return res;
    } catch (err) {
      console.error('❌ [AuthService] Error al obtener /auth/me:', err);
      return null;
    }
  }

  // 👑 Preguntar al backend si el usuario es admin
  async isAdminFromApi(): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) return false;

    return user.rol === 'admin' || user.esAdmin === true;
  }

  // 🚪 Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('esAdmin');
  }
}
