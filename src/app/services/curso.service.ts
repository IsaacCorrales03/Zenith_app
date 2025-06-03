import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private cursoSeleccionado = new BehaviorSubject<any>(null);
  public curso$ = this.cursoSeleccionado.asObservable();

  constructor() { }

  setCurso(curso: any): void {
    this.cursoSeleccionado.next(curso);
  }

  getCurso(): any {
    return this.cursoSeleccionado.value;
  }

  clearCurso(): void {
    this.cursoSeleccionado.next(null);
  }
}