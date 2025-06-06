import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private leccionSeleccionada = new BehaviorSubject<any>(null);
  public leccion$ = this.leccionSeleccionada.asObservable();

  constructor() { }

  setLeccion(leccion: any): void {
    this.leccionSeleccionada.next(leccion);
  }

  getLeccionId(): any {
    return this.leccionSeleccionada.value?.id || null;
  }
  getcontent():any {
    return this.leccionSeleccionada.value
  }

  clearCurso(): void {
    this.leccionSeleccionada.next(null);
  }
}
