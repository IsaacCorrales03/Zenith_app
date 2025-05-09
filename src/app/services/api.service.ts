import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'https://zenith-api-38ka.onrender.com';
  private id: string = '';
  private api_key: string = '';


  constructor(private http: HttpClient) { }

  initialize(userData: any) {
    if (userData) {
      this.id = userData.User_ID;
      this.api_key = userData.Api_Key;
    }
  }
  

  login(email: string, password: string): Observable<any> {
    const loginData = {
      correo: email,
      password: password
    };
    const response = this.http.post(`${this.apiUrl}/login`, loginData);
    console.log(response)
    return response
  }

  crear_curso(form: object): Observable<any> {
    console.log(form)
    return this.http.post(`${this.apiUrl}/cursos`, form)
  }

  obtenerDatosDeUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario?id=${this.id}&api_key=${this.api_key}`)
  }

  crearGrupo(form: any): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', form.nombre); // Corrige la sintaxis aquí
    formData.append('admin_id', this.id);
    formData.append('public', form.public.toString()); // Asegúrate de convertir los valores booleanos a string
    if (form.imagen) {
      formData.append('imagen', form.imagen);
    }
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    return this.http.post(`${this.apiUrl}/grupos`, formData)
  }

  registrarse(data:any) {
    return this.http.post(`${this.apiUrl}/usuario`, data)
  }

  // Método GET para obtener data
  getUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${this.id}/${this.api_key}`);
  }
  enrollUser(data: any, curso_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/enroll/${this.id}/${curso_id}`, data)
  }
  unsubscribeUser(curso_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/unsubscribe/${this.id}/${curso_id}`)
  }
  // Método POST para enviar datos
  createData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/datos`, data);
  }
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_user`, data)
  }
  // Método GET para obtener los cursos
  getCursos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cursos`)
  }

  getGrupos(group_code: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/group/${group_code}`)
  }

  joinUser(group_code: string): Observable<any> {
    const data = {}
    return this.http.post(`${this.apiUrl}/join/${group_code}/${this.id}`, data)
  }
}