import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-visor-scorm',
  templateUrl: './visor-scorm.component.html',
  styleUrls: ['./visor-scorm.component.scss']
})
export class VisorScormComponent implements OnInit {

scorm: any = null;
safeUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<any>(`http://localhost:3000/paqscorms/${id}`).subscribe({
      next: (data) => {
        this.scorm = data;

        // ✅ AQUÍ defines la URL real del index.html del SCORM
        // Como aún no existe launch_url en BD, ponemos un ejemplo:
        // EJ: http://localhost:3000/scorms/<carpeta>/index.html
        const url = this.scorm?.launch_url; // si luego lo añades en BD

        if (url) {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        } else {
          this.safeUrl = null;
        }
      },
      error: (err) => console.error('Error cargando SCORM:', err)
    });
  }
}