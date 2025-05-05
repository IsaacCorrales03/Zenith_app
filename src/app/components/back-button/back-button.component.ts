import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  imports: [IonButton, IonIcon]
})
export class BackButton  implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    addIcons({ arrowBackOutline, personCircleOutline, })
  }

  back(){ 
    this.navCtrl.back();
  }

}
