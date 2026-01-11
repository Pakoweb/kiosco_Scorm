import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { ProfesorDashboardComponent } from './pages/profesor-dashboard/profesor-dashboard.component';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { VisorScormComponent } from './pages/visor-scorm/visor-scorm.component';


const routes: Routes = [
  // Inicio en el dashboard de alumno (cámbialo por login si quieres)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'profesor-dashboard', component: ProfesorDashboardComponent },
  { path: 'visor-scorm/:id', component: VisorScormComponent },
  //  Página nueva con el listado de alumnos
  { path: 'alumnos', component: StudentListComponent },

  // Cualquier ruta rara, te manda al dashboard
  { path: '**', redirectTo: 'student-dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
