import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonInput, IonIcon  } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { TabBar } from '../components/tab-bar/tab-bar';
import { Header } from '../components/header/header';
import { addIcons } from 'ionicons';
import { searchOutline, closeOutline} from 'ionicons/icons';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, TabBar, Header, IonText, IonInput, IonIcon]
})
export class ExplorePage implements OnInit {

  constructor(private apiService: ApiService) { 
    addIcons({searchOutline, closeOutline})
  }

  ngOnInit() {
  }

}
