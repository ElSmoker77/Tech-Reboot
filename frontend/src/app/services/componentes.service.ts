import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Componente {
  _id?: string;
  nombre: string;
  categoria: string;
  estado: string;
  descripcion?: string;
  ubicacion?: string;
  

  // Puede venir como Date (del frontend) o string ISO (del backend)
  fechaIngreso: string | Date;

  responsable?: string;
  usuarioEmail?: string;

  // ⚖️ Nuevo: peso estimado en kg (opcional)
  pesoKg?: number;
}

const ADMIN_EMAILS = ['admin@techreboot.cl'];
const ADMIN_DOMAINS = ['@techreboot-admin.cl'];

@Injectable({ providedIn: 'root' })
export class ComponenteServicio {
  // URL base del backend
  private apiUrl = '${environment.apiUrl}/api/componentes';

  constructor(private http: HttpClient) {}

  // 🔹 Crea encabezados con el token (si lo usas)
  private headers(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private normalizarCorreo(value: string | null): string {
    return value?.trim().toLowerCase() ?? '';
  }

  esAdminEmail(email: string | null): boolean {
    const normalized = this.normalizarCorreo(email);
    if (!normalized) {
      return false;
    }

    if (ADMIN_EMAILS.includes(normalized)) {
      return true;
    }

    return ADMIN_DOMAINS.some((domain) => normalized.endsWith(domain));
  }

  // 🟢 Obtener todos los componentes (solo para pruebas o admin)
  getComponentes(): Observable<Componente[]> {
    return this.http.get<Componente[]>(this.apiUrl, { headers: this.headers() });
  }

  // 🟢 Obtener componentes solo del usuario actual
  getComponentesPorUsuario(usuarioEmail: string): Observable<Componente[]> {
    return this.http.get<Componente[]>(
      `${this.apiUrl}?usuarioEmail=${usuarioEmail}`,
      { headers: this.headers() }
    );
  }

  // 🟢 Obtener un componente por ID
  getComponente(id: string): Observable<Componente> {
    return this.http.get<Componente>(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }

  // 🟢 Crear un nuevo componente (asociado al usuario actual)
  createComponente(data: Componente): Observable<Componente> {
    const usuarioEmail = this.normalizarCorreo(localStorage.getItem('usuario'));
    const payload = { ...data, usuarioEmail };
    return this.http.post<Componente>(this.apiUrl, payload, { headers: this.headers() });
  }

  // 🟢 Actualizar un componente existente
  updateComponente(id: string, data: Componente): Observable<Componente> {
    const usuarioEmail = this.normalizarCorreo(localStorage.getItem('usuario'));
    const payload = { ...data, usuarioEmail };
    return this.http.put<Componente>(`${this.apiUrl}/${id}`, payload, { headers: this.headers() });
  }

  // 🟢 Eliminar un componente
  deleteComponente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }
}
