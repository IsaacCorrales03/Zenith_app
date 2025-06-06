import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCardContent, IonChip, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Router } from '@angular/router';
import { CursoService } from '../services/curso.service';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';
import { addIcons } from 'ionicons';
import { LessonService } from '../services/lesson.service';


import {
  schoolOutline,
  libraryOutline,
  playCircleOutline,
  timeOutline,
  starOutline,
  peopleOutline,
  chevronDownOutline,
  chevronForwardOutline, playOutline, documentTextOutline
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
  imports: [TabBar, Header, CommonModule, IonContent, IonCardContent, IonChip, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon, IonLabel],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({
          height: '0px',
          opacity: 0,
          transform: 'scaleY(0.8)',
          overflow: 'hidden'
        }),
        animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({
            height: '*',
            opacity: 1,
            transform: 'scaleY(1)'
          }))
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate('400ms cubic-bezier(0.55, 0.085, 0.68, 0.53)',
          style({
            height: '0px',
            opacity: 0,
            transform: 'scaleY(0.95)'
          }))
      ])
    ]),

    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            transform: 'translateY(20px) scale(0.95)',
            filter: 'blur(2px)'
          }),
          stagger('80ms', [
            animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              style({
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                filter: 'blur(0px)'
              }))
          ])
        ], { optional: true })
      ])
    ]),

    // Animación adicional para hover/focus
    trigger('smoothHover', [
      transition('idle => hover', [
        animate('200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }))
      ]),
      transition('hover => idle', [
        animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }))
      ])
    ]),

    // Animación de entrada con rebote suave
    trigger('bounceIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.3) rotate(-5deg)'
        }),
        animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({
            opacity: 1,
            transform: 'scale(1) rotate(0deg)'
          }))
      ])
    ])
  ]
})

export class CursoPage implements OnInit {
  curso: Curso = this.cursoService.getCurso();
  expandedChapters: Set<number> = new Set();
  constructor(
    private leccionService: LessonService,
    private router: Router,
    private cursoService: CursoService
  ) { addIcons({ schoolOutline, timeOutline, peopleOutline, libraryOutline, documentTextOutline, playCircleOutline, starOutline, playOutline, chevronForwardOutline, chevronDownOutline }); }

  ngOnInit() {
    this.curso = this.cursoService.getCurso();
    console.log("Curso recibido:", this.curso);

    if (!this.curso) {
      this.router.navigate(['/cursos']);
    }
  }
  getCapitulos(): Capitulo[] {
    return Object.values(this.curso.capitulos);
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

    this.leccionService.setLeccion(leccion);
    console.log('Lección seleccionada:', this.leccionService.getLeccionId());
    this.router.navigate(['/leccion']);

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