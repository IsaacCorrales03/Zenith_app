import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
;
interface LearningCategory {
  [key: string]: number;
}
interface Answer {
  questionId: number;
  rating: number;
}
interface LearningPreferences {
  Auditivo: LearningCategory;
  Kinestesico: LearningCategory;
  Visual: LearningCategory;
}

interface QuestionMapping {
  category: keyof LearningPreferences;
  key: string;
}
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
  async establecer_preferencias(answers: Answer[]) {
    // Mapeo de índices a nombres de propiedades del JSON final
    const questionMap: { [key: number]: QuestionMapping } = {
      // Visual
      0: { category: 'Visual', key: 'Lectura' },
      1: { category: 'Visual', key: 'Graficos' },
      2: { category: 'Visual', key: 'Diagramas' },
      3: { category: 'Visual', key: 'Video' },
      4: { category: 'Visual', key: 'Imagenes' },
      // Auditivo
      5: { category: 'Auditivo', key: 'Escuchar_clase' },
      6: { category: 'Auditivo', key: 'Grabaciones' },
      7: { category: 'Auditivo', key: 'Musica' },
      8: { category: 'Auditivo', key: 'Podcast' },
      9: { category: 'Auditivo', key: 'Debates' },
      // Kinestésico
      10: { category: 'Kinestesico', key: 'Experimentos' },
      11: { category: 'Kinestesico', key: 'Simulaciones' },
      12: { category: 'Kinestesico', key: 'Proyectos' },
      13: { category: 'Kinestesico', key: 'Practica' },
      14: { category: 'Kinestesico', key: 'Juegos' }
    };

    // Calcular el total de todos los valores
    const totalSum = answers.reduce((sum, answer) => sum + answer.rating, 0);

    // Crear el objeto de preferencias con porcentajes
    const preferencias: LearningPreferences = {
      "Auditivo": {
        "Debates": 0,
        "Escuchar_clase": 0,
        "Grabaciones": 0,
        "Musica": 0,
        "Podcast": 0
      },
      "Kinestesico": {
        "Experimentos": 0,
        "Juegos": 0,
        "Practica": 0,
        "Proyectos": 0,
        "Simulaciones": 0
      },
      "Visual": {
        "Diagramas": 0,
        "Graficos": 0,
        "Imagenes": 0,
        "Lectura": 0,
        "Video": 0
      }
    };

    // Calcular porcentajes para cada respuesta
    answers.forEach(answer => {
      const questionInfo = questionMap[answer.questionId];
      if (questionInfo && totalSum > 0) {
        const percentage = Math.round((answer.rating / totalSum) * 100);
        preferencias[questionInfo.category][questionInfo.key] = percentage;
      }
    });

    // Verificar que la suma sea exactamente 100 y ajustar si es necesario
    const currentTotal = Object.values(preferencias).reduce((sum, category) =>
      sum + Object.values(category as LearningCategory).reduce((catSum: number, value) => catSum + (value as number), 0), 0
    );

    // Ajustar para que sume exactamente 100
    if (currentTotal !== 100 && currentTotal > 0) {
      // Encontrar el valor más alto para hacer el ajuste
      let maxValue: number = 0;
      let maxCategory: keyof LearningPreferences = 'Visual';
      let maxKey = '';

      Object.entries(preferencias).forEach(([catName, category]) => {
        Object.entries(category).forEach(([key, value]) => {
          const numValue = value as number; // Type assertion here
          if (numValue > maxValue) {
            maxValue = numValue;
            maxCategory = catName as keyof LearningPreferences;
            maxKey = key;
          }
        });
      });

      // Ajustar el valor más alto
      const difference = 100 - currentTotal;
      preferencias[maxCategory][maxKey] = Math.max(0, maxValue + difference);
    }

    console.log('Preferencias calculadas:', preferencias);

    // NUEVO: Guardar las preferencias en userData
    try {
      const userData = await this.getUserData();
      if (userData) {
        // Actualizar los datos del usuario con las nuevas preferencias
        userData.Learning_Percentages = preferencias;

        // Guardar los datos actualizados
        await this.setUserData(userData);
        console.log('Preferencias guardadas correctamente en Learning_Percentages');
      } else {
        console.error('No se encontraron datos del usuario para actualizar');
      }
    } catch (error) {
      console.error('Error guardando las preferencias en userData:', error);
    }

    return preferencias;
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
