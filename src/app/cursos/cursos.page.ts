import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';
import { SecureAuthService } from '../services/secure-auth.service';


@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    Header, 
    TabBar,
    IonContent, 
    IonText, 
    IonButton, 
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
  ]
})
export class CursosPage implements OnInit {
  cursos: any[] = [];
  isModalOpen = false;
  nuevoCurso = {
    nombre: '',
    duracion: null
  };
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private apiService: ApiService, private secureAuthService: SecureAuthService) { 
    addIcons({ refreshOutline });
  }

  ngOnInit() {
    this.get_cursos();
  }

  get_cursos() {
    this.apiService.getCursos().subscribe({
      next: (response) => {
        this.cursos = response;
        console.log(this.cursos);
      },
      error: (error) => {
        console.error('Error al obtener cursos:', error);
      }
    });
  }

}