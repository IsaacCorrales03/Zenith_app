import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { DeepLinkService } from './services/deeplinks.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private deepLinkService: DeepLinkService,

  ) { }

  async ngOnInit() {
    this.setupAppUrlListener();
    if (Capacitor.isNativePlatform()) {
      StatusBar.setBackgroundColor({ color: '#ffffff' })
      StatusBar.setOverlaysWebView({ overlay: false });
    }
  }

  setupAppUrlListener() {
    App.addListener('appUrlOpen', (data: { url: string }) => {
      console.log('App abierta con URL:', data.url);

      if (data.url.includes('zenith-api-38ka.onrender.com/join_group/')) {
        // Extraer el código
        const urlParts = data.url.split('join_group/');
        if (urlParts.length > 1) {
          const code = urlParts[1].split('/')[0];
          console.log('Código de grupo encontrado:', code);
          setTimeout(() => {
            this.deepLinkService.sendGroupCode(code);
          }, 1000)

        }
      } else if (data.url.includes('zenith-api-38ka.onrender.com')) {
        const slug = data.url.split('zenith-api-38ka.onrender.com').pop();
        if (slug) {
          const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
          this.router.navigateByUrl(normalizedSlug);
        }
      }
    });
  }
}