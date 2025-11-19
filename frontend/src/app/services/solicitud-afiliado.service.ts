import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface SolicitudAfiliado {
  _id?: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  region: string;
  tipoOrganizacion: string;
  descripcionOrganizacion: string;
  capacidadAlmacenamiento: string;
  experienciaReciclaje: boolean;
  certificaciones?: string;
  compromisoAmbiental: boolean;
  disponibilidadHoraria: string;
  mensajeAdicional?: string;
  requisitosAceptados?: Array<{ id: string; aceptado: boolean }>;
  estado?: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada';
  fechaSolicitud?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudAfiliadoService {
  private api = `https://tech-reboot.onrender.com/api/solicitudes-afiliado`;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  async enviarSolicitud(data: any) {
    return await lastValueFrom(
      this.http.post(`${this.api}`, data, { headers: this.headers() })
    );
  }

  // Obtener todas las solicitudes (solo para admin)
  getSolicitudes(estado?: string): Observable<SolicitudAfiliado[]> {
    const url = estado ? `${this.api}?estado=${estado}` : this.api;
    return this.http.get<SolicitudAfiliado[]>(url, { headers: this.headers() });
  }

  // Obtener una solicitud específica
  getSolicitud(id: string): Observable<SolicitudAfiliado> {
    return this.http.get<SolicitudAfiliado>(`${this.api}/${id}`, { headers: this.headers() });
  }

  // Actualizar estado de una solicitud (solo para admin)
  actualizarEstado(id: string, estado: string): Observable<any> {
    return this.http.patch(
      `${this.api}/${id}/estado`,
      { estado },
      { headers: this.headers() }
    );
  }
}

