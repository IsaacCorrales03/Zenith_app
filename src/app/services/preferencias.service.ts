import { Injectable } from '@angular/core';

export interface PreferenciasValores {
  lectura: number;
  graficos: number;
  diagramas: number;
  videos: number;
  imagenes: number;
  escuchar_clase: number;
  grabaciones: number;
  musica: number;
  podcast: number;
  debates: number;
  experimentos: number;
  simulaciones: number;
  proyectos: number;
  practica: number;
  juegos: number;
}

export interface PreferenciasPorcentajes {
  lectura: number;
  graficos: number;
  diagramas: number;
  videos: number;
  imagenes: number;
  escuchar_clase: number;
  grabaciones: number;
  musica: number;
  podcast: number;
  debates: number;
  experimentos: number;
  simulaciones: number;
  proyectos: number;
  practica: number;
  juegos: number;
}

export interface ResultadoPreferencias {
  valores: PreferenciasValores;
  porcentajes: PreferenciasPorcentajes;
  sumaTotal: number;
  topPreferencias: Array<{
    nombre: string;
    valor: number;
    porcentaje: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})

export class PreferenciasService {

  constructor() { }

  private readonly preferenciasKeys: (keyof PreferenciasValores)[] = [
    'lectura', 'graficos', 'diagramas', 'videos', 'imagenes',
    'escuchar_clase', 'grabaciones', 'musica', 'podcast', 'debates',
    'experimentos', 'simulaciones', 'proyectos', 'practica', 'juegos'
  ];

  /**
   * Calcula los porcentajes de preferencias basado en valores de 1 a 10
   * @param valores - Objeto con los valores de preferencias (1-10)
   * @returns Resultado con valores, porcentajes y estadísticas
   */
  calcularPreferencias(valores: PreferenciasValores): ResultadoPreferencias {
    // Validar que los valores estén en el rango correcto
    this.validarValores(valores);

    // Calcular suma total
    const sumaTotal = this.preferenciasKeys.reduce(
      (suma, key) => suma + valores[key],
      0
    );

    // Calcular porcentajes
    const porcentajes: PreferenciasPorcentajes = {} as PreferenciasPorcentajes;

    this.preferenciasKeys.forEach(key => {
      porcentajes[key] = (valores[key] / sumaTotal) * 100;
    });

    // Obtener top preferencias ordenadas
    const topPreferencias = this.preferenciasKeys
      .map(key => ({
        nombre: this.formatearNombre(key),
        valor: valores[key],
        porcentaje: porcentajes[key]
      }))
      .sort((a, b) => b.porcentaje - a.porcentaje);

    return {
      valores,
      porcentajes,
      sumaTotal,
      topPreferencias
    };
  }

  /**
   * Valida que todos los valores estén en el rango de 1 a 10
   */
  private validarValores(valores: PreferenciasValores): void {
    this.preferenciasKeys.forEach(key => {
      const valor = valores[key];
      if (!Number.isInteger(valor) || valor < 1 || valor > 10) {
        throw new Error(`El valor para ${key} debe ser un entero entre 1 y 10. Valor recibido: ${valor}`);
      }
    });
  }

  /**
   * Formatea el nombre de la preferencia para mostrar
   */
  private formatearNombre(key: keyof PreferenciasValores): string {
    const nombres: Record<keyof PreferenciasValores, string> = {
      lectura: 'Lectura',
      graficos: 'Gráficos',
      diagramas: 'Diagramas',
      videos: 'Videos',
      imagenes: 'Imágenes',
      escuchar_clase: 'Escuchar Clase',
      grabaciones: 'Grabaciones',
      musica: 'Música',
      podcast: 'Podcast',
      debates: 'Debates',
      experimentos: 'Experimentos',
      simulaciones: 'Simulaciones',
      proyectos: 'Proyectos',
      practica: 'Práctica',
      juegos: 'Juegos'
    };

    return nombres[key];
  }

  /**
   * Obtiene las preferencias más altas (top N)
   */
  getTopPreferencias(resultado: ResultadoPreferencias, cantidad: number = 5): Array<{
    nombre: string;
    valor: number;
    porcentaje: number;
  }> {
    return resultado.topPreferencias.slice(0, cantidad);
  }

  /**
   * Obtiene las preferencias más bajas (bottom N)
   */
  getBottomPreferencias(resultado: ResultadoPreferencias, cantidad: number = 5): Array<{
    nombre: string;
    valor: number;
    porcentaje: number;
  }> {
    return resultado.topPreferencias.slice(-cantidad).reverse();
  }

  /**
   * Genera un resumen textual de las preferencias
   */
  generarResumen(resultado: ResultadoPreferencias): string {
    const top3 = this.getTopPreferencias(resultado, 3);
    const porcentajeTop3 = top3.reduce((sum, pref) => sum + pref.porcentaje, 0);

    let resumen = `Preferencias de aprendizaje (Total: ${resultado.sumaTotal} puntos):\n\n`;
    resumen += `Las 3 preferencias principales representan el ${porcentajeTop3.toFixed(1)}% del total:\n`;

    top3.forEach((pref, index) => {
      resumen += `${index + 1}. ${pref.nombre}: ${pref.valor}/10 (${pref.porcentaje.toFixed(1)}%)\n`;
    });

    return resumen;
  }
}

