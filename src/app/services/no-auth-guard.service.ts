import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SecureAuthService } from './secure-auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private secureAuthService: SecureAuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.secureAuthService.isLoggedIn();
    
    if (isLoggedIn) {
      this.router.navigate(['']);
      return false;
    }
    
    return true;
  }
}