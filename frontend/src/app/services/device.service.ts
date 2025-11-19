import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private api = `https://tech-reboot.onrender.com/api/devices`;

  constructor() {}

  // Registrar nuevo dispositivo
  async add(device: any) {
    try {
      const res = await axios.post(this.api, device);
      return res;
    } catch (err) {
      console.error('Error al registrar dispositivo:', err);
      throw err;
    }
  }

  // Obtener todos los dispositivos
  async getAll() {
    try {
      const res = await axios.get(this.api);
      return res.data;
    } catch (err) {
      console.error('Error al obtener dispositivos:', err);
      throw err;
    }
  }
}
