import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonText,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { SecureAuthService } from '../services/secure-auth.service';
import { Router } from '@angular/router';
import { Header } from '../components/header/header';

interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  [key: string]: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    Header,
    IonText,
    IonLabel,
    IonContent,
    CommonModule,
    FormsModule,
    IonInput,
    IonButton
  ]
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

  ngOnInit() {}

  goToRegister() {
    this.router.navigate(['register']);
  }

  forgotPassword() {
    this.router.navigate(['forgot-password']);
  }

  onLogin() {
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';

    // Validar email
    if (!this.email) {
      this.emailError = 'Debes ingresar un email válido';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email)) {
      this.emailError = 'El formato del email no es válido';
    }

    // Validar contraseña
    if (!this.password) {
      this.passwordError = 'Debes ingresar una contraseña';
    }

    // Detener si hay errores
    if (this.emailError || this.passwordError) {
      return;
    }

    // Proceder con login
    this.apiService.login(this.email, this.password).subscribe({
      next: async (response: AuthResponse) => {
        await this.secureAuthService.setUserData(response);
        console.log(await this.secureAuthService.getUserData())
        this.router.navigate(['']);
      },
      error: (error: any) => {
        console.error('Error en inicio de sesión', error);

        let errorMsg = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';

        if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error && error.error.error) {
          errorMsg = error.error.error;
        }

        this.loginError = errorMsg;
      }
    });
  }
}
