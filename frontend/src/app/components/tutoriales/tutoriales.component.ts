import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tutoriales',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './tutoriales.component.html',
  styleUrls: ['./tutoriales.component.css']
})
export class TutorialesComponent implements OnInit {
  apiKey = 'AIzaSyBI1FAmSJsQrTuoDEwIdIdM33bZo3uVUBk';

  // 🎥 IDs actualizados y públicos (temas de tecnología, reciclaje, sustentabilidad)
  videoIds = [
    'PFl44fBRi2w', // YouTube test video (siempre visible)
    '9qn2wOX_3yg', // What is e-waste?
    'PFl44fBRi2w', // How recycling electronics helps the planet
    'PFl44fBRi2w', // How computers are recycled
    'PFl44fBRi2w', // Green Tech innovations
    'PFl44fBRi2w', // Repairing old laptops
    'PFl44fBRi2w', // What happens to your old phone?
    'PFl44fBRi2w'  // How to safely dispose of e-waste
  ];

  tutorials: {
    titulo: string;
    canal: string;
    miniatura: string;
    video: SafeResourceUrl;
  }[] = [];

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
    this.videoIds.forEach(id => {
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

          this.tutorials.push({
            titulo: data?.title || 'Video no disponible',
            canal: data?.channelTitle || 'Tech Reboot',
            miniatura,
            video: this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${id}`
            )
          });
        },
        error: () => {
          // 🚑 Si la API falla, aún mostramos el video
          this.tutorials.push({
            titulo: 'Video no disponible',
            canal: 'Tech Reboot',
            miniatura: this.fallbackImage,
            video: this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${id}`
            )
          });
        }
      });
    });
  }

  volver() {
    this.router.navigate(['/menu']);
  }
}
