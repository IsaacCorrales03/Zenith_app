import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';
import { ApiService } from '../services/api.service';
import { addIcons } from 'ionicons';
import { refreshOutline, timeOutline, personOutline, peopleOutline, bookOutline, addOutline, playOutline } from 'ionicons/icons';
import { SecureAuthService } from '../services/secure-auth.service';
import { Router } from '@angular/router';
import { CursoService } from '../services/curso.service';

export interface Usuario {
  id: number;
  nombre: string;
}

export interface Inscripcion {
  usuario_id: number | Usuario;
}

export interface Curso {
  id: number;
  nombre: string;
  duracion: number;
  autor: Usuario;
  inscripciones: Inscripcion[];
  url_imagen?: string;
  puedeInscribirse?: boolean;
}

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
  currentUserId: any = 0;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private apiService: ApiService,
    private cursoService: CursoService,
    private secureAuthService: SecureAuthService,
    private router: Router
  ) {
    addIcons({ refreshOutline, timeOutline, personOutline, peopleOutline, addOutline, playOutline, bookOutline });
  }

  async ngOnInit() {
    this.currentUserId = await this.secureAuthService.getUserId();
    if (!this.currentUserId) {
      console.warn('No se pudo obtener el ID del usuario');
      return;
    }
    this.get_cursos();
  }

  get_cursos() {
    this.apiService.getCursos().subscribe({
      next: (response: Curso[]) => {
        this.cursos = response.map(curso => {
          const isNotAuthor = this.currentUserId !== curso.autor?.id;
          const isNotEnrolled = !curso.inscripciones?.some((inscripcion: any) => {
            const idInscrito = typeof inscripcion.usuario_id === 'object'
              ? inscripcion.usuario_id.id
              : inscripcion.usuario_id;
            return idInscrito === this.currentUserId;
          });

          return {
            ...curso,
            puedeInscribirse: isNotAuthor && isNotEnrolled
          };
        });
      },
      error: (error) => {
        console.error('Error al obtener cursos:', error);
      }
    });
  }

  getCursoClass(nombreCurso: string): string {
    const nombre = nombreCurso.toLowerCase();
    if (nombre.includes('matemática') || nombre.includes('matematica')) {
      return 'matematica';
    } else if (nombre.includes('ciencia') || nombre.includes('biología') || nombre.includes('física') || nombre.includes('química')) {
      return 'ciencias';
    } else if (nombre.includes('historia') || nombre.includes('geografía') || nombre.includes('sociales')) {
      return 'historia';
    }
    return '';
  }

  formatDuration(minutos: number): string {
    if (minutos < 60) {
      return `${minutos} minutos`;
    } else {
      const horas = Math.floor(minutos / 60);
      const minutosRestantes = minutos % 60;
      if (minutosRestantes === 0) {
        return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
      } else {
        return `${horas}h ${minutosRestantes}min`;
      }
    }
  }

  inscribirse(curso: any): void {
    this.apiService.enrollUser(curso.id).subscribe({
      next: (response) => {
        console.log('Usuario inscrito:', response);
        this.ver_curso(curso);
      },
      error: (error) => {
        console.error('Error al inscribir:', error);
      }
    });
  }

  ver_curso(curso: any) {
    this.cursoService.setCurso(curso);
    this.router.navigate(['/curso']);
  }
}
