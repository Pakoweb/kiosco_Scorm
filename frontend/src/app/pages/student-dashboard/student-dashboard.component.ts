import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  //categorias
  categorias: any[] = [];
  categoriaSeleccionada: any = '';   // guarda el id seleccionado
  searchText: string = '';

  //paquetes scorm
  scorms: any[] = [];          // todos los paquetes
  scormsFiltrados: any[] = []; // paquetes visibles

  searchNombre: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarScorms();
  }

  //cargar categorias desde el backend
  cargarCategorias(): void {
    this.http.get<any[]>('http://localhost:3000/categorias')
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos de categorias:', data);
          this.categorias = data ?? [];
        },
        error: (err) => console.error('Error cargando categorías:', err)
      });
  }

  

  onCategoriaChange(): void {
    console.log('Categoría seleccionada:', this.categoriaSeleccionada);
    // filtrar cursos/scorms por this.categoriaSeleccionada
  }


  //cargar paqscorm desde el backend

    cargarScorms(): void {
    this.http.get<any[]>('http://localhost:3000/paqscorms')
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos de paquetes SCORM:', data);
          this.scorms = data ?? [];
          this.scormsFiltrados = [...this.scorms];
          this.onSearchNombreChange(); // aplica filtro si ya hay texto escrito
        },
        error: (err) => console.error('Error cargando paquetes SCORM:', err)
      });
  }

  onSearchNombreChange(): void {
    const q = (this.searchNombre || '').trim().toLowerCase();

    if (!q) {
      this.scormsFiltrados = [...this.scorms];
      return;
    }

    this.scormsFiltrados = this.scorms.filter(p =>
      String(p.nombre ?? '').toLowerCase().includes(q)
    );
  }

  //buscador de paq scorm por categorias
  aplicarFiltros(): void {
    const texto = (this.searchNombre || '').trim().toLowerCase();
    const catId = this.categoriaSeleccionada;

    this.scormsFiltrados = this.scorms.filter(p => {
      const coincideNombre = !texto || String(p.nombre ?? '').toLowerCase().includes(texto);
      const coincideCategoria = !catId || String(p.id_categoria) === String(catId);
      return coincideNombre && coincideCategoria;
    });
  }






}

