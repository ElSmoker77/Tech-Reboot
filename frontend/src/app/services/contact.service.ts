import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment.prod';

export interface MensajeContacto {
  _id: string;
  nombre: string;
  correo: string;
  mensaje: string;
  createdAt: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private api = `https://tech-reboot.onrender.com/api/contact`;

  async send(data: any) {
    return await axios.post(this.api, data);
  }

  // 🟢 Obtener todos los mensajes (para admin)
  async getMensajes(): Promise<MensajeContacto[]> {
    const res = await axios.get<MensajeContacto[]>(this.api);
    return res.data;
  }
}
