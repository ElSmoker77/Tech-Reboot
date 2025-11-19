// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface DashboardStatsResponse {
  kgRecuperados: number;
  equiposReacondicionados: number;
  co2EvitadoKg: number;
  totalUsuarios: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // 👇 IMPORTANTE: URL ABSOLUTA AL BACKEND
  private baseUrl = `https://tech-reboot.onrender.com/api/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStatsResponse> {
    // Esto termina siendo: http://localhost:4000/api/dashboard/stats
    return this.http.get<DashboardStatsResponse>(`${this.baseUrl}/stats`);
  }
}
