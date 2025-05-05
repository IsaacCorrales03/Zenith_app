import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar,  IonGrid, IonRow, IonCol, IonTitle }from '@ionic/angular/standalone'

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss'],
    standalone: true,
    imports: [CommonModule, IonHeader, IonToolbar, IonGrid, IonRow, IonCol, IonTitle]  
  })
export class Header  {
    constructor() {}
}