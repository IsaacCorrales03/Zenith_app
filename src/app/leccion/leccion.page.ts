  import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonButton
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { LessonService } from '../services/lesson.service';
import { SecureAuthService } from '../services/secure-auth.service';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';
import { addIcons } from 'ionicons';
import {
  // Iconos de estado y navegación
  warningOutline,
  refreshOutline,
  arrowBackOutline,
  chevronBackOutline,
  chevronForwardOutline,
  locationOutline,
  
  // Iconos de lección y educación
  schoolOutline,
  documentTextOutline,
  libraryOutline,
  bulbOutline,
  trendingUpOutline,
  checkmarkCircleOutline,
  
  // Iconos de tiempo y progreso
  timeOutline,
  diamondOutline,
  
  // Iconos de multimedia y recursos
  playCircleOutline,
  expandOutline,
  readerOutline,
  headsetOutline,
  micOutline,
  chatbubblesOutline,
  handLeftOutline,
  
  // Iconos de información y utilidad
  informationCircleOutline,
  folderOpenOutline,
  
  // Iconos adicionales que podrían necesitarse según afinación
  imageOutline,
  videocamOutline,
  bookOutline,
  volumeHighOutline,
  clipboardOutline,
  constructOutline,
  musicalNotesOutline,
  codeSlashOutline,
  calculatorOutline,
  globeOutline,
  gameControllerOutline,
  flashOutline,
  peopleOutline,
  colorPaletteOutline,
  heartOutline,
  leafOutline,
  starOutline,
  medalOutline,
  rocketOutline,
  telescopeOutline
} from 'ionicons/icons';
@Component({
  selector: 'app-leccion',
  templateUrl: './leccion.page.html',
  styleUrls: ['./leccion.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonBadge,
    IonButton,
    CommonModule,
    FormsModule,
    TabBar,
    Header
  ]
})
export class LeccionPage implements OnInit {
  recursos: any = null;
  leccionData: any = null;
  id_leccion: any;
  user_preferences: any;
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private secureAuthService: SecureAuthService,
    private lessonService: LessonService
  ) {addIcons({warningOutline,
  'refresh-outline': refreshOutline,  
  'arrow-back-outline': arrowBackOutline,
  'chevron-back-outline': chevronBackOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'location-outline': locationOutline,
  
  // Educación y lección
  'school-outline': schoolOutline,
  'document-text-outline': documentTextOutline,
  'library-outline': libraryOutline,
  'bulb-outline': bulbOutline,
  'trending-up-outline': trendingUpOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  
  // Tiempo y métricas
  'time-outline': timeOutline,
  'diamond-outline': diamondOutline,
  
  // Multimedia
  'play-circle-outline': playCircleOutline,
  'expand-outline': expandOutline,
  'reader-outline': readerOutline,
  'headset-outline': headsetOutline,
  'mic-outline': micOutline,
  'chatbubbles-outline': chatbubblesOutline,
  'hand-left-outline': handLeftOutline,
  
  // Información
  'information-circle-outline': informationCircleOutline,
  'folder-open-outline': folderOpenOutline,
  
  // Iconos por tipo de afinación
  'image-outline': imageOutline,
  'videocam-outline': videocamOutline,
  'book-outline': bookOutline,
  'volume-high-outline': volumeHighOutline,
  'clipboard-outline': clipboardOutline,
  'construct-outline': constructOutline,
  'musical-notes-outline': musicalNotesOutline,
  'code-slash-outline': codeSlashOutline,
  'calculator-outline': calculatorOutline,
  'globe-outline': globeOutline,
  'game-controller-outline': gameControllerOutline,
  'flash-outline': flashOutline,
  'people-outline': peopleOutline,
  
  'color-palette-outline': colorPaletteOutline,
  'heart-outline': heartOutline,
  'leaf-outline': leafOutline,
  'star-outline': starOutline,
  'medal-outline': medalOutline,
  'rocket-outline': rocketOutline,
  'telescope-outline': telescopeOutline
}); }

  ngOnInit() {
  // Resetear estados al iniciar
  this.isLoading = true;
  this.hasError = false;
  this.errorMessage = '';

  try {
    // Obtener datos de la lección desde el servicio
    this.leccionData = this.lessonService.getcontent();
    
    // Verificar si los datos de lección están disponibles
    if (!this.leccionData) {
      console.warn('No se pudieron obtener los datos de la lección');
      this.hasError = true;
      this.errorMessage = 'No se pudieron cargar los datos de la lección';
      this.isLoading = false;
      return;
    }

    this.id_leccion = this.lessonService.getLeccionId();
    

    if (!this.id_leccion) {
      console.warn('No se pudo obtener el ID de la lección');
      this.hasError = true;
      this.errorMessage = 'ID de lección no disponible';
      this.isLoading = false;
      return;
    }

    // Obtener porcentajes sin await, usando .then()
    this.secureAuthService.getLearningPercentages().then((percentages) => {

      if (!percentages) {
        console.warn('No se pudieron obtener los porcentajes de aprendizaje');
        this.hasError = true;
        this.errorMessage = 'No se pudieron cargar las preferencias de aprendizaje';
        this.isLoading = false;
        return;
      }

      // Llamar al API para obtener recursos
      this.apiService.obtener_recursos(this.id_leccion, percentages).subscribe({
        next: (data: any) => {
          console.log("Recursos:", data[0].recursos_adaptados);
          this.recursos = data[0].recursos_adaptados;
          this.isLoading = false;
          this.hasError = false;
        },
        error: (err: any) => {
          console.error('Error al obtener recursos:', err);
          this.hasError = true;
          this.errorMessage = 'Error al cargar los recursos de la lección';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });

    }).catch((error) => {
      console.error('Error al obtener porcentajes:', error);
      this.hasError = true;
      this.errorMessage = 'Error al cargar preferencias de aprendizaje';
      this.isLoading = false;
    });

  } catch (error) {
    console.error('Error en ngOnInit:', error);
    this.hasError = true;
    this.errorMessage = 'Error al inicializar la página';
    this.isLoading = false;
  }
}


  getTipoColor(tipo: string): string {
    switch (tipo) {
      case 'Visual': return 'primary';
      case 'Auditivo': return 'success';
      case 'Kinestésico': return 'warning';
      default: return 'medium';
    }
  }

  getYouTubeEmbedUrl(url: string): string {
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('watch?v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }

  formatearContenido(contenido: string): string {
    if (!contenido) return '';

    return contenido
      .replace(/{titulo}/g, '<h3>')
      .replace(/{\/titulo}/g, '</h3>')
      .replace(/{lista_ordenada}/g, '<ol>')
      .replace(/{\/lista_ordenada}/g, '</ol>')
      .replace(/{lista_desordenada}/g, '<ul>')
      .replace(/{\/lista_desordenada}/g, '</ul>')
      .replace(/{objeto_lista}/g, '<li>')
      .replace(/{espacio_input}/g, '<div class="input-space">___________</div>')
      .replace(/\n/g, '<br>');
  }

  abrirEnlaceExterno(url: string) {
    window.open(url, '_blank');
  }
}