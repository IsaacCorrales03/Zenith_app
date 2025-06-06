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
  async getLearningPercentages(): Promise<number[]> {
    try {
      const userData = await this.getUserData();

      if (!userData || !userData.Learning_Percentages) {
        console.warn('No se encontraron datos de Learning_Percentages');
        return Array(15).fill(0); // Retorna array de 15 ceros si no hay datos
      }

      const learningPercentages = userData.Learning_Percentages;

      // Extraer los 15 valores en el orden: Auditivo, Kinestésico, Visual
      const percentagesArray: number[] = [
        // Auditivo (5 valores)
        learningPercentages.Auditivo?.Debates || 0,
        learningPercentages.Auditivo?.Escuchar_clase || 0,
        learningPercentages.Auditivo?.Grabaciones || 0,
        learningPercentages.Auditivo?.Musica || 0,
        learningPercentages.Auditivo?.Podcast || 0,

        // Kinestésico (5 valores)
        learningPercentages.Kinestesico?.Experimentos || 0,
        learningPercentages.Kinestesico?.Juegos || 0,
        learningPercentages.Kinestesico?.Practica || 0,
        learningPercentages.Kinestesico?.Proyectos || 0,
        learningPercentages.Kinestesico?.Simulaciones || 0,

        // Visual (5 valores)
        learningPercentages.Visual?.Diagramas || 0,
        learningPercentages.Visual?.Graficos || 0,
        learningPercentages.Visual?.Imagenes || 0,
        learningPercentages.Visual?.Lectura || 0,
        learningPercentages.Visual?.Video || 0
      ];

      return percentagesArray;

    } catch (error) {
      console.error('Error obteniendo porcentajes de aprendizaje', error);
      return Array(15).fill(0); // Retorna array de 15 ceros en caso de error
    }
  }

  async getLearningPercentagesWithLabels(): Promise<{ label: string, value: number, category: string }[]> {
    try {
      const userData = await this.getUserData();

      if (!userData || !userData.Learning_Percentages) {
        console.warn('No se encontraron datos de Learning_Percentages');
        return [];
      }

      const learningPercentages = userData.Learning_Percentages;

      const percentagesWithLabels = [
        // Auditivo
        { label: 'Debates', value: learningPercentages.Auditivo?.Debates || 0, category: 'Auditivo' },
        { label: 'Escuchar clase', value: learningPercentages.Auditivo?.Escuchar_clase || 0, category: 'Auditivo' },
        { label: 'Grabaciones', value: learningPercentages.Auditivo?.Grabaciones || 0, category: 'Auditivo' },
        { label: 'Música', value: learningPercentages.Auditivo?.Musica || 0, category: 'Auditivo' },
        { label: 'Podcast', value: learningPercentages.Auditivo?.Podcast || 0, category: 'Auditivo' },

        // Kinestésico
        { label: 'Experimentos', value: learningPercentages.Kinestesico?.Experimentos || 0, category: 'Kinestésico' },
        { label: 'Juegos', value: learningPercentages.Kinestesico?.Juegos || 0, category: 'Kinestésico' },
        { label: 'Práctica', value: learningPercentages.Kinestesico?.Practica || 0, category: 'Kinestésico' },
        { label: 'Proyectos', value: learningPercentages.Kinestesico?.Proyectos || 0, category: 'Kinestésico' },
        { label: 'Simulaciones', value: learningPercentages.Kinestesico?.Simulaciones || 0, category: 'Kinestésico' },

        // Visual
        { label: 'Diagramas', value: learningPercentages.Visual?.Diagramas || 0, category: 'Visual' },
        { label: 'Gráficos', value: learningPercentages.Visual?.Graficos || 0, category: 'Visual' },
        { label: 'Imágenes', value: learningPercentages.Visual?.Imagenes || 0, category: 'Visual' },
        { label: 'Lectura', value: learningPercentages.Visual?.Lectura || 0, category: 'Visual' },
        { label: 'Video', value: learningPercentages.Visual?.Video || 0, category: 'Visual' }
      ];

      return percentagesWithLabels;

    } catch (error) {
      console.error('Error obteniendo porcentajes de aprendizaje con etiquetas', error);
      return [];
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
