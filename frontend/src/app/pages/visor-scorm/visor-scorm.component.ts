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
    private http: HttpClient,
    private sanitizer: DomSanitizer // ✅ FALTABA
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`http://localhost:3000/paqscorms/${id}`).subscribe({
      next: (data) => {
        this.scorm = data;

        const url = this.scorm?.launch_url;
        this.safeUrl = url
          ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
          : null;
      },
      error: (err) => console.error('Error cargando SCORM:', err)
    });
  }
}
