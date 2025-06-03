import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTabs, IonButton, } from '@ionic/angular/standalone';
import { ViewChild } from '@angular/core';  
import { Subscription } from 'rxjs';
import { SecureAuthService } from '../services/secure-auth.service';
import { Router } from '@angular/router';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    Header,
    TabBar
  ],
})


export class MainPage implements OnInit {
  private subscription: Subscription = new Subscription();
  @ViewChild('tabs') tabs !: IonTabs;

  constructor(private router: Router, private secureAuthService: SecureAuthService) {

  }

  async ngOnInit() {
    const userData = await this.secureAuthService.getUserData();


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  go_to_cursos() {
    this.router.navigate(['/cursos'])
  }

}