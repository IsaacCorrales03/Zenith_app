import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonText, IonItem } from '@ionic/angular/standalone';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';
import { addIcons } from 'ionicons';
import { SecureAuthService } from '../services/secure-auth.service';
import { addCircleOutline, personCircleOutline, caretForwardOutline, moonOutline, lockClosedOutline, peopleOutline, volumeHighOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, Header, TabBar, IonButton, IonIcon, IonText,IonItem,]
})

export class AccountPage implements OnInit {
  UserData: any

  constructor(private secureAuthService: SecureAuthService, private router: Router) {
    addIcons({ addCircleOutline, personCircleOutline, caretForwardOutline, moonOutline,lockClosedOutline, peopleOutline, volumeHighOutline, });
  }

  redirect(route: string) {
    console.log('redireccionando a: ', route)
    this.router.navigateByUrl(`/${route}`);
  }
  async ngOnInit() {
    this.UserData = await this.secureAuthService.getUserData()
    console.log(this.UserData);
  }

}
