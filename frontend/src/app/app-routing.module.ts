import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';

const routes: Routes = [
  // Ruta por defecto: dashboard del estudiante
  { path: '', component: StudentDashboardComponent },
  
  // Ruta del formulario
  { path: 'login', component: LoginComponent },
  
  // (Opcional) Redirigir cualquier ruta desconocida al login
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
