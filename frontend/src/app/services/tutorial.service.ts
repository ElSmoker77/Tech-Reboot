import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private api = `https://tech-reboot.onrender.com/api/tutorials`;

  constructor() {}

  // Obtener lista de tutoriales desde el backend
  async getAll() {
    try {
      const res = await axios.get(this.api);
      return res.data;
    } catch (err) {
      console.error('Error al obtener los tutoriales:', err);
      throw err;
    }
  }
}
