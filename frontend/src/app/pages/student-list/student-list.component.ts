import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {

  alumnos: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/alumnos').subscribe({
      next: (data) => {
        console.log('Alumnos recibidos:', data);
        this.alumnos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar alumnos:', err);
        this.error = 'Error cargando alumnos desde el servidor';
        this.loading = false;
      }
    });
  }
}
