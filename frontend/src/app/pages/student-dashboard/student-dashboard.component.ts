import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  users: any[] = [];
  userChunks: any[][] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/categorias')
      .subscribe({
        next: (data) => {
           console.log('Datos recibidos de categorias:', data); //para ver qué llega del backend

          this.users = data;
          this.chunkUsers();
        },
        error: (err) => console.error(err)
      });
  }

  // Dividir el array en grupos de 3
  chunkUsers(): void {
    const chunkSize = 3;
    for (let i = 0; i < this.users.length; i += chunkSize) {
      this.userChunks.push(this.users.slice(i, i + chunkSize));
    }
  }
}
