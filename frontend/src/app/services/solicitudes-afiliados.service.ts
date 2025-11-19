import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export type EstadoSolicitud = 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada';

export interface RequisitoAceptado {
  titulo: string;
  descripcion?: string;
  aceptado: boolean;
}

export interface SolicitudAfiliado {
  _id: string;
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
  requisitosAceptados: RequisitoAceptado[];
  estado: EstadoSolicitud;
  fechaSolicitud?: string; // viene de Mongo como Date → string
}
@Injectable({
  providedIn: 'root'
})
export class SolicitudesAfiliadoService {

  // Ajusta esta base según cómo montaste el router en el backend
  // por ejemplo app.use('/api/solicitudes-afiliado', router);
  private baseUrl = '/api/solicitudes-afiliado';

  constructor(private http: HttpClient) {}

  getSolicitudes(estado?: EstadoSolicitud): Observable<SolicitudAfiliado[]> {
    let params = new HttpParams();
    if (estado && estado !== 'pendiente' && estado !== 'en_revision' && estado !== 'aprobada' && estado !== 'rechazada') {
      // si viene algo raro, no lo mandamos
    } else if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<SolicitudAfiliado[]>(this.baseUrl, { params });
  }

  getSolicitud(id: string): Observable<SolicitudAfiliado> {
    return this.http.get<SolicitudAfiliado>(`${this.baseUrl}/${id}`);
  }

  actualizarEstado(id: string, estado: EstadoSolicitud): Observable<{ msg: string; solicitud: SolicitudAfiliado }> {
    return this.http.patch<{ msg: string; solicitud: SolicitudAfiliado }>(
      `${this.baseUrl}/${id}/estado`,
      { estado }
    );
  }
}
