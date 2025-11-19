// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🧩 Componentes "públicos"
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { MenuComponent } from './components/menu/menu.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { TutorialesComponent } from './components/tutoriales/tutoriales.component';
import { LocalizacionComponent } from './components/localizacion/localizacion.component';
import { ComponentesComponent } from './components/componentes/componentes';
import { TechRebootComponent } from './components/inicio/inicio';
import { SolicitudAfiliadoComponent } from './components/solicitud-afiliado/solicitud-afiliado.component';

// 🧩 Componentes ADMIN
import { AdminComponentesTablaComponent } from './components/admin/admin-componentes-tabla.component/admin-componentes-tabla.component';
import { AdminComponentesFormComponent } from './components/admin/admin-componentes-form.component/admin-componentes-form.component';
import { AdminLayoutComponent } from './components/admin/admin';
import { AdminSolicitudesAfiliadoComponent } from './components/admin/admin-solicitudes-afiliado.component/admin-solicitudes-afiliado.component';
import { AdminContactosComponent } from './components/admin/admin-contactos.component/admin-contactos.component';

// 🛡️ Guard
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // 🔓 Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'tutoriales', component: TutorialesComponent },
  { path: 'localizacion', component: LocalizacionComponent },
  { path: 'inicio', component: TechRebootComponent },

  // 🔒 Rutas protegidas (usuario normal)
  {
    path: 'componentes',
    component: ComponentesComponent,
    canActivate: [AuthGuard],
  },
  {
    // formulario que ya tenías para que un usuario envíe su solicitud
    path: 'solicitud-afiliado',
    component: SolicitudAfiliadoComponent,
    canActivate: [AuthGuard],
  },

  // 👑 BLOQUE ADMIN – con layout + rutas hijas dinámicas
  {
    path: 'admin',
    component: AdminLayoutComponent, // <-- layout con sidebar
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { requiresAdmin: true },
    children: [
      // /admin → redirige a /admin/componentes
      { path: '', redirectTo: 'componentes', pathMatch: 'full' },

      // /admin/componentes → tabla de componentes
      {
        path: 'componentes',
        component: AdminComponentesTablaComponent,
      },

      // /admin/registrar-componente → formulario admin
      {
        path: 'registrar-componente',
        component: AdminComponentesFormComponent,
      },

      // /admin/solicitudes → historial de solicitudes de afiliado (vista ADMIN)
      {
        path: 'solicitudes',
        component: AdminSolicitudesAfiliadoComponent,
      },

      // /admin/contactos → mensajes enviados desde "Contáctanos"
      {
        path: 'contactos',
        component: AdminContactosComponent,
      },
    ],
  },

  // 🚫 Ruta desconocida
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
