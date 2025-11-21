import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

type Tutorial = {
  titulo: string;
  canal: string;
  miniatura: string;
  video: SafeResourceUrl; // embed (para iframe)
  watchUrl: string;       // enlace para abrir en YouTube
};

@Component({
  selector: 'app-tutoriales',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './tutoriales.component.html',
  styleUrls: ['./tutoriales.component.css'],
})
export class TutorialesComponent implements OnInit {
  apiKey = 'AIzaSyBI1FAmSJsQrTuoDEwIdIdM33bZo3uVUBk';

  // 🎥 IDs actualizados y públicos (temas de tecnología, reciclaje, sustentabilidad)
  videoIds = [
    'PFl44fBRi2w', // tu video test (ok)
    'ztKdciFqMEg', // What is e-waste? (ok)
    '8FKjY6u1eGo', // How Recycling Works (SciShow)
    'Dmm8r3eaJsQ', // Reciclaje electrónico explicación
    'vICswvJa-Ko', // How to prepare old electronics for recycling
    'Ir7fa1E3xDg', // E-waste explained simply (Tech Insider)
    'dETYUOtWlhI', // Circular economy explained
    'FtS2fuveBIw', // How computers are recycled
  ];

  tutorials: Tutorial[] = [];
  selectedTutorial: Tutorial | null = null;

  // 🖼️ Imagen de respaldo personalizada
  fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270"><rect width="480" height="270" fill="%230b7d3e"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="28" font-family="Arial">Tech Reboot</text></svg>';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarVideos();
  }

  cargarVideos() {
    this.videoIds.forEach((id) => {
      const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${this.apiKey}&part=snippet`;

      this.http.get(url).subscribe({
        next: (res: any) => {
          const data = res.items?.[0]?.snippet;

          const miniatura =
            data?.thumbnails?.maxres?.url ||
            data?.thumbnails?.high?.url ||
            data?.thumbnails?.medium?.url ||
            `https://img.youtube.com/vi/${id}/hqdefault.jpg` ||
            this.fallbackImage;

          const tutorial: Tutorial = {
            titulo: data?.title || 'Video no disponible',
            canal: data?.channelTitle || 'Tech Reboot',
            miniatura,
            video: this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${id}`
            ),
            watchUrl: `https://www.youtube.com/watch?v=${id}`,
          };

          this.tutorials.push(tutorial);

          // Si aún no hay video seleccionado, usar el primero que llegue
          if (!this.selectedTutorial) {
            this.selectedTutorial = tutorial;
          }
        },
        error: () => {
          // 🚑 Si la API falla, aún mostramos el video
          const tutorial: Tutorial = {
            titulo: 'Video no disponible',
            canal: 'Tech Reboot',
            miniatura: this.fallbackImage,
            video: this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${id}`
            ),
            watchUrl: `https://www.youtube.com/watch?v=${id}`,
          };

          this.tutorials.push(tutorial);

          if (!this.selectedTutorial) {
            this.selectedTutorial = tutorial;
          }
        },
      });
    });
  }

  seleccionarVideo(tutorial: Tutorial) {
    this.selectedTutorial = tutorial;

    // En pantallas pequeñas, hacer scroll hasta el reproductor
    if (window.innerWidth < 992) {
      const el = document.querySelector('.main-video-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  volver() {
    this.router.navigate(['/menu']);
  }

  onImgError(event: any) {
    event.target.src = this.fallbackImage;
  }
}
