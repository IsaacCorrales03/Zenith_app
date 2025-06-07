// encuesta.page.ts
import { Component, OnInit } from '@angular/core';
import { PreferenciasService, PreferenciasValores, ResultadoPreferencias } from '../services/preferencias.service';
import { IonGrid,IonContent, IonTitle,IonApp,IonRow,IonRange,IonCardTitle, IonCardSubtitle,IonItem, IonCol, IonCardContent, IonCardHeader, IonCard, IonIcon, IonButton, IonLabel } from '@ionic/angular/standalone';


@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [IonRange, IonContent, IonApp,IonTitle,IonGrid,IonCardTitle, IonRow,IonButton,IonCardSubtitle, IonLabel , IonItem, IonCol, IonCardContent, IonCardHeader, IonCard, IonIcon]
})
export class EncuestaPage implements OnInit {
  
  preferenciasForm: PreferenciasValores = {
    lectura: 5,
    graficos: 5,
    diagramas: 5,
    videos: 5,
    imagenes: 5,
    escuchar_clase: 5,
    grabaciones: 5,
    musica: 5,
    podcast: 5,
    debates: 5,
    experimentos: 5,
    simulaciones: 5,
    proyectos: 5,
    practica: 5,
    juegos: 5
  };

  resultado: ResultadoPreferencias | null = null;
  mostrarResultados = false;

  // Lista de preferencias para iterar en el template
  preferencias = [
    { key: 'lectura', label: 'Lectura', icon: 'book-outline' },
    { key: 'graficos', label: 'Gráficos', icon: 'bar-chart-outline' },
    { key: 'diagramas', label: 'Diagramas', icon: 'git-network-outline' },
    { key: 'videos', label: 'Videos', icon: 'videocam-outline' },
    { key: 'imagenes', label: 'Imágenes', icon: 'image-outline' },
    { key: 'escuchar_clase', label: 'Escuchar Clase', icon: 'ear-outline' },
    { key: 'grabaciones', label: 'Grabaciones', icon: 'mic-outline' },
    { key: 'musica', label: 'Música', icon: 'musical-notes-outline' },
    { key: 'podcast', label: 'Podcast', icon: 'radio-outline' },
    { key: 'debates', label: 'Debates', icon: 'chatbubbles-outline' },
    { key: 'experimentos', label: 'Experimentos', icon: 'flask-outline' },
    { key: 'simulaciones', label: 'Simulaciones', icon: 'desktop-outline' },
    { key: 'proyectos', label: 'Proyectos', icon: 'construct-outline' },
    { key: 'practica', label: 'Práctica', icon: 'hand-left-outline' },
    { key: 'juegos', label: 'Juegos', icon: 'game-controller-outline' }
  ];

  constructor(private preferenciasService: PreferenciasService) { }

  ngOnInit() {
    this.calcularPreferencias();
  }

  /**
   * Calcula las preferencias y actualiza los porcentajes
   */
  calcularPreferencias(): void {
    try {
      this.resultado = this.preferenciasService.calcularPreferencias(this.preferenciasForm);
    } catch (error) {
      console.error('Error al calcular preferencias:', error);
    }
  }

  /**
   * Maneja el cambio en los sliders
   */
  onRangeChange(event: any, preferencia: keyof PreferenciasValores): void {
    this.preferenciasForm[preferencia] = event.detail.value;
    this.calcularPreferencias();
  }

  /**
   * Resetea todas las preferencias a 5
   */
  resetearPreferencias(): void {
    this.preferencias.forEach(pref => {
      (this.preferenciasForm as any)[pref.key] = 5;
    });
    this.calcularPreferencias();
  }

  /**
   * Muestra los resultados detallados
   */
  mostrarResultadosDetallados(): void {
    this.mostrarResultados = true;
  }

  /**
   * Obtiene el porcentaje formateado
   */
  getPorcentaje(preferencia: keyof PreferenciasValores): string {
    if (!this.resultado) return '6.67%';
    return `${this.resultado.porcentajes[preferencia].toFixed(2)}%`;
  }

  /**
   * Obtiene el color del badge según el porcentaje
   */
  getBadgeColor(porcentaje: number): string {
    if (porcentaje >= 10) return 'success';
    if (porcentaje >= 8) return 'warning';
    if (porcentaje >= 6) return 'primary';
    return 'medium';
  }

  /**
   * Obtiene las estadísticas resumidas
   */
  getEstadisticas() {
    if (!this.resultado) return null;
    
    const top3 = this.resultado.topPreferencias.slice(0, 3);
    const bottom3 = this.resultado.topPreferencias.slice(-3).reverse();
    const promedio = this.resultado.sumaTotal / this.preferencias.length;
    
    return {
      top3,
      bottom3,
      promedio: promedio.toFixed(1),
      distribucion: this.getDistribucion()
    };
  }

  /**
   * Calcula la distribución de preferencias
   */
  private getDistribucion() {
    if (!this.resultado) return null;
    
    const altas = this.resultado.topPreferencias.filter(p => p.porcentaje >= 8).length;
    const medias = this.resultado.topPreferencias.filter(p => p.porcentaje >= 5 && p.porcentaje < 8).length;
    const bajas = this.resultado.topPreferencias.filter(p => p.porcentaje < 5).length;
    
    return { altas, medias, bajas };
  }

  /**
   * Exporta los resultados como JSON
   */
  exportarResultados(): void {
    if (!this.resultado) return;
    
    const datos = {
      fecha: new Date().toISOString(),
      preferencias: this.resultado,
      resumen: this.preferenciasService.generarResumen(this.resultado)
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preferencias-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}