import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { NoAuthGuard } from './services/no-auth-guard.service';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage),
    canActivate: [NoAuthGuard]
  },
  {
    path: '',
    loadComponent: () => import('./main/main.page').then( m => m.MainPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account.page').then( m => m.AccountPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-information',
    loadComponent: () => import('./user-information/user-information.page').then( m => m.UserInformationPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-information',
    loadComponent: () => import('./user-information/user-information.page').then( m => m.UserInformationPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'cursos',
    loadComponent: () => import('./cursos/cursos.page').then( m => m.CursosPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'explore',
    loadComponent: () => import('./explore/explore.page').then( m => m.ExplorePage)
  },

  {
    path: 'curso',
    loadComponent: () => import('./curso/curso.page').then( m => m.CursoPage)
  },
  {
    path: "**",
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage),
    canActivate: [NoAuthGuard]
  },
];
