import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonButton, IonIcon, IonModal, IonHeader, 
         IonToolbar, IonTitle, IonButtons, IonItem, IonLabel, IonInput, 
         IonFooter, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { addCircle, closeCircle } from 'ionicons/icons';


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
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonItem,
    IonLabel,
    IonInput,
    IonFooter,
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

  constructor(private apiService: ApiService) { 
    addIcons({ addCircle, closeCircle });
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

  openModal() {
    this.isModalOpen = true;
    this.resetForm();
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.nuevoCurso = {
      nombre: '',
      duracion: null
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Crear vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  crear_curso() {
    if (!this.nuevoCurso.nombre || !this.nuevoCurso.duracion || !this.selectedFile) {
      return;
    }

    // Aquí puedes implementar tu función para crear el curso
    // Por ejemplo, podrías usar FormData para enviar los datos incluyendo la imagen
    const formData = new FormData();
    formData.append('nombre', this.nuevoCurso.nombre);
    formData.append('duracion', this.nuevoCurso.duracion);
    formData.append('imagen', this.selectedFile);

    // Llamada al API (implementa esta función en tu ApiService)
    this.apiService.crear_curso(formData).subscribe({
      next: (response: any) => {
        console.log('Curso creado:', response);
        this.get_cursos(); // Actualiza la lista de cursos
        this.closeModal();
      },
      error: (error: Error) => {
        console.error('Error al crear curso:', error);
      }
    });

    // Por ahora, solo cerramos el modal
    console.log('Datos del curso a crear:', {
      nombre: this.nuevoCurso.nombre,
      duracion: this.nuevoCurso.duracion,
      imagen: this.selectedFile.name
    });
    
    this.closeModal();
  }
}