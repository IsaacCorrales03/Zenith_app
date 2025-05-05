import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonButton,IonIcon, IonFab, IonFabList, IonFabButton, IonText, IonPopover, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVerticalCircleOutline} from 'ionicons/icons';

@Component({
    selector: 'app-overflow-menu',
    template: `
        <ion-button (click)="presentPopover($event)" slot="secondary" shape="round"><ion-icon slot="icon-only" name="ellipsis-vertical-circle-outline"></ion-icon></ion-button>
        <ion-popover #popover [isOpen]="isOpen" (didDismiss)="isOpen = false" side="left">
        <ng-template>
            <ion-button (click)="functionToCall()"><ion-text>Darse de Baja</ion-text></ion-button>
        </ng-template>
        </ion-popover>
    `,
    imports: [IonButton, IonIcon, IonText, IonPopover],
    styleUrls: ['./overflow-menu.scss'],
})

export class OverflowMenu {
    @Input() curso_id: null | number = null;
    @Input() verticalPosition: 'top' | 'center' | 'bottom' = 'top';
    @Input() horizontalPosition: 'start' | 'center' | 'end' = 'end';
    @Output() unsubscribe = new EventEmitter<number>();
    @ViewChild('popover') popover!: HTMLIonPopoverElement;

    isOpen = false;
  
    presentPopover(e: Event) {
      this.popover.event = e;
      this.isOpen = true;
    }
    constructor() {
        addIcons({ ellipsisVerticalCircleOutline });
    }
    
    functionToCall() {
        if (this.curso_id !== null) {
            this.unsubscribe.emit(this.curso_id);
        }
        this.isOpen = false
    }
}