import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';

const routes: Routes = [
  // Ruta por defecto: LOGIN
  { path: '', component: LoginComponent },
  
  // Ruta del Kiosco: /alumno
  { path: 'alumno', component: StudentDashboardComponent },
  
  // (Opcional) Redirigir cualquier ruta desconocida al login
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
