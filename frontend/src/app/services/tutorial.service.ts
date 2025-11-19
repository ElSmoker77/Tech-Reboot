import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private api = 'http://localhost:4000/api/tutorials';

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
