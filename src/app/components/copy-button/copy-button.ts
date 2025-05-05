import { Component, Input } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { Clipboard } from '@capacitor/clipboard';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copy-button',
  template: `
    <ion-button fill="clear" (click)="copyToClipboard()">
      <ion-icon name="copy-outline" slot="start"></ion-icon>
      <span><ng-content></ng-content></span>
    </ion-button>
  `,
  standalone: true,
  imports: [IonButton, IonIcon, CommonModule],
  styles: [`
    ion-button {
      --padding-start: 4px;
      --padding-end: 4px;
    }
  `]
})
export class CopyButtonComponent {
  @Input() showSuccessMessage = true;
  @Input() textToCopy: string = '';
  
  constructor(private toastController: ToastController) {}
  
  async copyToClipboard() {
    try {
      // Si se proporcionó texto personalizado para copiar, úsalo
      // De lo contrario, obtén el texto del contenido visible
      const textToCopy = this.textToCopy || this.getTextContent();
      
      // Usar Capacitor Clipboard API para copiar
      await Clipboard.write({
        string: textToCopy
      });
      
      // Mostrar mensaje de éxito
      if (this.showSuccessMessage) {
        this.presentToast('¡Texto copiado al portapapeles!');
      }
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
    }
  }
  
  private getTextContent(): string {
    const element = document.querySelector('app-copy-button span');
    return element ? element.textContent || '' : '';
  }
  
  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}