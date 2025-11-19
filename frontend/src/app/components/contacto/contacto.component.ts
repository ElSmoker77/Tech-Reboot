import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ContactService],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  contacto = { nombre: '', correo: '', mensaje: '' };
  toastVisible = false;

  constructor(private service: ContactService, private router: Router) {}

  async enviar(form: NgForm) {
    if (!form.valid) {
      return;
    }

    try {
      await this.service.send(this.contacto);

      // ✅ Mostrar toast
      this.toastVisible = true;

      // ✅ Resetear formulario
      this.contacto = { nombre: '', correo: '', mensaje: '' };
      form.resetForm();

      // ✅ Ocultar toast luego de unos segundos
      setTimeout(() => {
        this.toastVisible = false;
      }, 4000);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      this.toastVisible = false;
    }
  }

  // 👉 link hacia la solicitud de afiliado
  irASolicitudAfiliado() {
    this.router.navigate(['/solicitud-afiliado']);
  }
}
