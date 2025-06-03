import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
;

@Injectable({
  providedIn: 'root'
})
export class SecureAuthService {

  constructor(
    private router: Router,
    // private googlePlus: GooglePlus
  ) { }



  async setUserData(userData: any) {
    try {
      const userDataString = JSON.stringify(userData);
      await Preferences.set({
        key: 'user_data',
        value: userDataString
      });
      console.log('Datos del usuario guardados correctamente');
    } catch (error) {
      console.error('Error guardando datos del usuario', error);
    }
  }

  async getUserData() {
    
    try {
      const userData = await Preferences.get({ key: 'user_data' });
      
      if (userData.value) {
        return JSON.parse(userData.value);
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario', error);
      return null;
    }
  }
  async getUserId(): Promise<number | null> {
  const userData = await this.getUserData();  
  return userData?.User_ID || null;
}

  async isLoggedIn(): Promise<boolean> {
    const userData = await this.getUserData();
    return !!userData;
  }

  async logout() {
    try {
      await Preferences.remove({ key: 'user_data' });
      this.router.navigate(['/register']);
    } catch (error) {
      console.error('Error cerrando sesión', error);
    }
  }
}
