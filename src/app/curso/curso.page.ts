import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle,IonCardContent,IonCard,IonCardHeader,IonCardTitle,IonCardSubtitle, IonToolbar, IonChip, IonBackButton,IonIcon,  IonButtons, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CursoService } from '../services/curso.service';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';
import { addIcons } from 'ionicons';
import { 
  schoolOutline, 
  libraryOutline, 
  playCircleOutline, 
  timeOutline, 
  starOutline, 
  peopleOutline,
  chevronDownOutline,
  chevronForwardOutline
} from 'ionicons/icons';

interface Recurso {
  id: number;
  tipo: string;
  afinacion: string;
  contenido: string;
  descripcion: string;
  externo: boolean;
}

interface Leccion {
  id: number;
  nombre: string;
  concepto: string;
  tema: string;
  duracion: number;
  creditos: number;
  recursos: { [key: string]: Recurso };
}

interface Capitulo {
  id: number;
  nombre: string;
  lecciones: { [key: string]: Leccion };
}

interface Inscripcion {
  id: number;
  usuario_id: number;
  usuario_nombre: string;
  fecha_inscripcion: string;
}

interface Autor {
  id: number;
  nombre: string;
}

interface Curso {
  id: number;
  nombre: string;
  duracion: number;
  url_imagen: string;
  autor: Autor;
  capitulos: { [key: string]: Capitulo };
  inscripciones: Inscripcion[];
}


@Component({
  selector: 'app-curso',
  templateUrl: './curso.page.html',
  styleUrls: ['./curso.page.scss'],
  standalone: true,
  imports: [IonCardContent,IonCard,IonCardHeader,IonCardTitle,IonCardSubtitle,IonChip,IonBadge, IonIcon,IonLabel, TabBar, Header, IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, CommonModule, FormsModule]
})
export class CursoPage implements OnInit {
  curso: Curso = this.cursoService.getCurso();
  expandedChapters: Set<number> = new Set();
  constructor(
    private router: Router,
    private cursoService: CursoService
  ) {  addIcons({timeOutline,peopleOutline,schoolOutline,libraryOutline,playCircleOutline,starOutline,chevronDownOutline,chevronForwardOutline});}

  ngOnInit() {
    this.curso = this.cursoService.getCurso();
    console.log("Curso recibido:", this.curso);

    if (!this.curso) {
      this.router.navigate(['/cursos']);
    }
  }
  getCapitulos(): Capitulo[] {
    return Object.values(this.curso.capitulos );
  }

  getLecciones(capitulo: Capitulo): Leccion[] {
    return Object.values(capitulo.lecciones);
  }

  getLeccionesCount(capitulo: Capitulo): number {
    return Object.keys(capitulo.lecciones).length;
  }

  toggleChapter(chapterId: number): void {
    if (this.expandedChapters.has(chapterId)) {
      this.expandedChapters.delete(chapterId);
    } else {
      this.expandedChapters.add(chapterId);
    }
  }

  isChapterExpanded(chapterId: number): boolean {
    return this.expandedChapters.has(chapterId);
  }

  selectLesson(leccion: Leccion): void {
    console.log('Lección seleccionada:', leccion);
    // Aquí puedes navegar a la página de la lección o mostrar un modal
    // Ejemplo: this.router.navigate(['/lesson', leccion.id]);
  }

  // Método para obtener el total de recursos de una lección
  getRecursosCount(leccion: Leccion): number {
    return Object.keys(leccion.recursos).length;
  }

  // Método para formatear la duración en horas y minutos
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  goBack() {
    this.cursoService.clearCurso();
    this.router.navigate(['/cursos']);
  }
}