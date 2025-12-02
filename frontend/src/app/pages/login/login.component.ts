import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = ''; // Aquí se guarda el email

  constructor(private router: Router) {}

  login() {
    if (this.email.trim().length > 0) {
      console.log('Intentando loguear con:', this.email);
      
      // AQUÍ SE HARIA LA LLAMADA AL BACKEND EN NODE MÁS ADELANTE
      // this.authService.login(this.email).subscribe(...)
      
      // Por ahora, simulamos que todo va bien y redirigimos al Kiosco
      this.router.navigate(['/alumno']);
    } else {
      alert('Por favor, introduce un correo');
    }
  }
}