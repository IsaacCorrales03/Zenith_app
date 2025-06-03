import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonInput, IonButton, IonText, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { SecureAuthService } from '../services/secure-auth.service';
import { Router } from '@angular/router';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule,
    IonInput,
    IonButton,
    IonText, IonLabel, Header
  ]
})
export class RegisterPage implements OnInit {
  @ViewChildren(IonInput) inputs!: QueryList<IonInput>;

  constructor(private apiService: ApiService, private router: Router, private secureAuthService: SecureAuthService) {

  }

  ngOnInit() {
  }


  onRegister() {
    const nombreInput = document.querySelector('ion-input[id="username"]') as HTMLIonInputElement;
    const correoInput = document.querySelector('ion-input[id="email"]') as HTMLIonInputElement;
    const passwordInput = document.querySelector('ion-input[id="password"]') as HTMLIonInputElement;

    const nombreError = document.querySelector('ion-text[id="username-error"]') as HTMLIonTextElement;
    const correoError = document.querySelector('ion-text[id="email-error"]') as HTMLIonTextElement;
    const passwordError = document.querySelector('ion-text[id="password-error"]') as HTMLIonTextElement;
    const registerError = document.querySelector('ion-text[id="register-error"]') as HTMLIonTextElement;
    const payload = {
      username: nombreInput.value as string,
      email: correoInput.value as string,
      password: passwordInput.value as string
    };
    if (!payload.email) {
      correoError.textContent = "Debes ingresar un email válido"
      correoError.style.display = "block"

    }
    if (!payload.password) {
      passwordError.textContent = "Debes ingresar una contraseña válida"
      passwordError.style.display = "block"
    }
    if (!payload.username) {
      nombreError.textContent = "Debes ingresar un nombre"
      nombreError.style.display = "block";

    }
    // Validación básica
    if (!payload.username || !payload.email || !payload.password) {
      return;
    }

    this.apiService.registrarse(payload).subscribe({
      next: async (response: any) => {
        console.log(response)
        // Guardar credenciales de forma segura
        await this.secureAuthService.setUserData(response);
        // Navegar a la página principal
        this.router.navigate(['']);
      },
      error: (error) => {
        let errorMsg = 'Error en el registro';

        // For your specific case where the error is in error.error
        if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error && error.error.error) {
          // If nested deeper as seen in your console output
          errorMsg = error.error.error;
        }

        registerError.textContent = errorMsg;
        registerError.style.display = 'block';
        console.error('Error en registro', error.error);

      }
    })

  }
  goToLogin() {
    this.router.navigate(['login']);
  }

}
