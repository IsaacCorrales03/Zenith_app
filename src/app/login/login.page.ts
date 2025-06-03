import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonHeader, IonLabel, IonTitle, IonToolbar, IonInputPasswordToggle, IonInput, IonItem, IonButton } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { SecureAuthService } from '../services/secure-auth.service';
import { Router } from '@angular/router';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';

// Define la interfaz para la respuesta de autenticación
interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  [key: string]: any; // Para cualquier otro campo que pueda venir en la respuesta
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [Header, IonText, IonLabel, IonContent, CommonModule, FormsModule, IonInput, IonButton]
})

export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  constructor(
    private apiService: ApiService,
    private secureAuthService: SecureAuthService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

  forgotPassword() {
    // Implementar la lógica para recuperar contraseña
    this.router.navigate(['forgot-password']);
  }

  onLogin() {
    console.log("a")
    // Obtener los elementos de input y errores
    const correoInput = document.querySelector('ion-input[id="email"]') as HTMLIonInputElement;
    const passwordInput = document.querySelector('ion-input[id="password"]') as HTMLIonInputElement;
    
    const correoError = document.querySelector('ion-text[id="email-error"]') as HTMLIonTextElement;
    const passwordError = document.querySelector('ion-text[id="password-error"]') as HTMLIonTextElement;
    const loginError = document.querySelector('ion-text[id="register-error"]') as HTMLIonTextElement;
    
    // Resetear mensajes de error
    correoError.textContent = "";
    passwordError.textContent = "";
    loginError.textContent = "";
    
    // Obtener los valores
    const email = correoInput.value as string;
    const password = passwordInput.value as string;
    
    // Validar email
    if (!email) {
      correoError.textContent = "Debes ingresar un email válido";
      correoError.style.display = "block";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      correoError.textContent = "El formato del email no es válido";
      correoError.style.display = "block";
    }
    
    // Validar contraseña
    if (!password) {
      passwordError.textContent = "Debes ingresar una contraseña";
      passwordError.style.display = "block";
    }
    
    // Detener si hay errores
    if (!email || !password || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return;
    }
    
    // Proceder con el login
    this.apiService.login(email, password).subscribe({
      next: async (response: AuthResponse) => {
        // Guardar credenciales de forma segura
        await this.secureAuthService.setUserData(response);
        // Navegar a la página principal
        this.router.navigate(['']);
      },
      error: (error: any) => {
        // Maneja errores de inicio de sesión
        console.error('Error en inicio de sesión', error);
        
        let errorMsg = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
        
        // Para casos específicos donde el error está en error.error
        if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error && error.error.error) {
          // Si está anidado más profundo como se ve en tu salida de consola
          errorMsg = error.error.error;
        }
        
        loginError.textContent = errorMsg;
        loginError.style.display = 'block';
      }
    });
  }
}