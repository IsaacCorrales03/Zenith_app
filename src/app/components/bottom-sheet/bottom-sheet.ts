import { Component, Input } from "@angular/core";
import { IonButton, IonText, IonIcon, IonHeader, IonToolbar, IonContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { peopleOutline, lockClosedOutline, lockOpenOutline, personOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';

@Component({
    selector: 'app-bottom-sheet',
    template: `
    <ion-header>
      <ion-toolbar>
        <ion-text class="ion-text-center">{{ group_name }}</ion-text>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-text>
        <h4>Información del grupo</h4>
      </ion-text>
      <ion-text id="description">{{ group_description }}</ion-text>
      <ion-text><ion-icon name="person-outline"></ion-icon> Administrador: {{ group_admin }}</ion-text>
      <ion-text><ion-icon name="people-outline"></ion-icon> Miembros: {{ group_members }}</ion-text>
      <ion-text [id]="group_public ? 'public_label' : 'private_label'">{{ group_public ? 'Público' : 'Privado' }}<ion-icon [name]="group_public ? 'lock-open-outline' : 'lock-closed-outline'"></ion-icon></ion-text>
      <ion-button shape="round" (click)="fuctionToCall($event)">Unirme</ion-button>
      <ion-button class="cancel-button" fill="clear" shape="round" (click)="close()">Cancelar</ion-button>
    </ion-content>
    `,
    imports: [IonHeader, IonToolbar, IonText, IonIcon, IonContent, IonButton],
    styleUrls: ['./bottom-sheet.scss'],
})

export class BottomSheet {
  @Input() group_exists: boolean = false;
  @Input() group_name: string = '';
  @Input() group_banner: string = '';
  @Input() group_members: number = 0;
  @Input() group_admin: string = '';
  @Input() group_public: boolean = true;
  @Input() group_description: string = '';
  @Input() group_code: string = '';
  @Input() joinFunction: (groupCode: string) => void = () => {};

  constructor(private modalCtrl: ModalController) { // Inyectar ModalController
    // Register the Ionicons we're using
    addIcons({
      'people-outline': peopleOutline,
      'lock-closed-outline': lockClosedOutline,
      'lock-open-outline': lockOpenOutline,
      'person-outline': personOutline
    });
  }

  fuctionToCall(event: any) {
    // Llama a la función que recibiste del componente padre
    this.joinFunction(this.group_code);
    this.modalCtrl.dismiss(); // Cerrar el modal después de unirse
  }

  close() {
    this.modalCtrl.dismiss(); // Cerrar el modal al cancelar
  }
}