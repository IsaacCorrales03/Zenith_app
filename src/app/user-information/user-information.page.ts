import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,ScrollDetail , IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';
import { addIcons } from 'ionicons';
import { SecureAuthService } from '../services/secure-auth.service';
import { personCircleOutline } from 'ionicons/icons';
import { BackButton } from '../components/back-button/back-button.component';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.page.html',
  styleUrls: ['./user-information.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, Header, TabBar, IonButton, IonIcon, IonText, BackButton]
})
export class UserInformationPage implements OnInit {
  userData: any;

  constructor(private secureAuthService: SecureAuthService, ) { 
    addIcons({ personCircleOutline, })
  }
  
  async ngOnInit() {
    this.userData = await this.secureAuthService.getUserData()
    console.log(this.userData)
  }
  obtenerLlaveParcial(api_key: string) {
    if (!api_key) {
      return '#'
    }
    const primeros_3_caracteres = api_key.substring(0, 3)
    const ultimos_3_caracteres = api_key.substring(api_key.length - 3);
    return `${primeros_3_caracteres}...${ultimos_3_caracteres}`
  }
  handleScrollStart() {
    console.log('scroll start');
  }

  handleScroll(event: CustomEvent<ScrollDetail>) {
    console.log('scroll', JSON.stringify(event.detail));
  }

  handleScrollEnd() {
    console.log('scroll end');
  }
  logout() {
    this.secureAuthService.logout()
  }
}
