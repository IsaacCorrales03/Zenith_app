import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { ModalController, IonContent, IonTabs, IonButton, } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { Chart } from 'chart.js/auto';
import { NavController, ToastController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { BottomSheet } from '../components/bottom-sheet/bottom-sheet';
import { DeepLinkService } from '../services/deeplinks.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SecureAuthService } from '../services/secure-auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Header } from '../components/header/header';
import { TabBar } from '../components/tab-bar/tab-bar';

interface Curso {
  id: number;
  nombre: string;
  duracion: number;
  progreso: number;
  imagen: string;
}


interface GrupoResponse {
  nombre?: string;
  banner?: string;
  miembros?: any[];
  admin?: string;
  public?: boolean;
  description?: string;
  error?: string;
}


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    Header,
    TabBar
  ],
})


export class MainPage implements OnInit {
  id_del_usuario: string = '';
  datos_del_usuario: any = null;
  grupoForm: FormGroup | null = null;
  bannerSeleccionado: File | null = null;
  imagenPreview: string | null = null;
  formEnviado = false;
  userId: string = '';
  apiKey: string = '';
  userData: any = null;
  cursos: any = null;
  grupos: any = null;
  group_code: string = '';
  loading: boolean = false;
  error: string | null = null;
  chart: Chart | null = null;
  private subscription: Subscription = new Subscription();
  @ViewChild('tabs') tabs !: IonTabs;

  constructor(private alertController: AlertController, private router: Router, private secureAuthService: SecureAuthService, private route: ActivatedRoute, private deepLinkService: DeepLinkService, private apiService: ApiService, private modalCtrl: ModalController, private ref: ChangeDetectorRef, private navCtrl: NavController, private toastCtrl: ToastController) {

  }

  async ngOnInit() {
    const userData = await this.secureAuthService.getUserData();


    // Cargar los datos guardados para mostrarlos inmediatamente
    this.datos_del_usuario = userData;
    this.id_del_usuario = userData.User_ID;
    this.datos_del_usuario.llave_parcial = this.obtenerLlaveParcial(userData.Api_Key);

    // Obtener datos actualizados de la API
    this.obtenerDatosDelUsuario();


    this.subscription = this.deepLinkService.groupCode$.subscribe(code => {
      if (code) {
        this.searchGroup(code);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async obtenerDatosDelUsuario() {
    // Iniciar la validación de errores
    this.error = null
    this.loading = true;
    // Llamar la API 
    this.apiService.obtenerDatosDeUsuario().subscribe({
      next: async (datos) => {
        // Guardamos los datos de el usuario
        this.datos_del_usuario = datos;
        this.id_del_usuario = this.datos_del_usuario.User_ID
        this.datos_del_usuario.llave_parcial = this.obtenerLlaveParcial(this.datos_del_usuario.Api_Key)

        // Guardar datos completos en el almacenamiento
        await this.secureAuthService.setUserData(this.datos_del_usuario);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error obteniendo los datos:', err);
        this.error = 'No se pudieron cargar los datos del usuario';
        this.loading = false;
      }
    })
  }


  getImagePath(curso: Curso) {
    return curso.imagen;
  }

  isUserEnrolled(cursoId: number): boolean {
    return this.userData?.cursos?.some((curso: Curso) => curso.id === cursoId);
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            try {
              await this.secureAuthService.logout();
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error al cerrar sesión', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async searchGroup(code: string) {
    try {
      const grupo = await this.getGroup(code) as GrupoResponse;

      // Verificar si la respuesta contiene un error
      if (grupo && !('error' in grupo)) {
        // Si no hay error, mostrar el modal con los datos del grupo
        await this.presentModal(grupo);
      } else {
        console.log('Error al buscar el grupo:', grupo?.error || 'Error desconocido');
      }
    } catch (error: any) {
      // Manejar errores HTTP (como 404)
      if (error.status === 404) {
        const errorData = { error: "Grupo no encontrado" } as GrupoResponse;
        console.log(errorData);
      } else {
        console.error('Error en la búsqueda:');
      }
    }
  }

  async joinUser(group_code: string) {
    this.apiService.joinUser(group_code).subscribe({
      next: async (data) => {
        console.log('Se unió al usuario');
        console.log(data);

        // Mostrar toast de éxito
        const toast = await this.toastCtrl.create({
          message: 'Te uniste al grupo',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        toast.present();
      },
      error: async (err) => {
        console.error('Error al unirse el usuario:', err);

        // Mostrar toast de error
        const toast = await this.toastCtrl.create({
          message: 'Ya estás en este grupo',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  async unsubscribeUser(cursoId: number) {
    this.error = null;
    console.log('Unsubscribe from course:', cursoId);
    this.apiService.unsubscribeUser(cursoId).subscribe({
      next: async (data) => {
        const toast = await this.toastCtrl.create({
          message: 'Te has dado de baja correctamente',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      }
    })
  }

  async presentModal(groupData: any) {
    const modal = await this.modalCtrl.create({
      component: BottomSheet,
      componentProps: {
        group_exists: groupData.code,
        group_name: groupData.nombre,
        group_banner: groupData.banner,
        group_members: groupData.miembros,
        group_admin: groupData.admin,
        group_public: groupData.public,
        group_description: groupData.description,
        group_code: groupData.codigo,
        joinFunction: this.joinUser.bind(this)
      },
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5
    });

    await modal.present();
  }



  async getGroup(group_code: string) {
    this.error = null;
    console.log('getting group');

    return new Promise((resolve, reject) => {
      this.apiService.getGrupos(group_code).subscribe({
        next: (data) => {
          const cleanData = data.__zone_symbol__value || data;
          resolve(cleanData);
        },
        error: (err) => {
          this.error = 'Error al obtener grupo';
          reject(err);
        }
      });
    });
  }

  async createGroup() { }

  getCouses() {
    this.error = null
    console.log('fetch courses')
    this.apiService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data
        this.loading = false
      },
      error: (err) => {
        console.error('Error fetching courses data:', err)
        this.error = 'No se pudieron cargar los cursos'
        this.loading = false
      }
    })
  }

  obtenerLlaveParcial(api_key: string) {
    if (!api_key) {
      return '#'
    }
    const primeros_3_caracteres = api_key.substring(0, 3)
    const ultimos_3_caracteres = api_key.substring(api_key.length - 3);
    return `${primeros_3_caracteres}...${ultimos_3_caracteres}`
  }
  go_to_cursos() {
    this.router.navigate(['/cursos'])
  }

  create_chart() {
    // Limpiar el gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    try {
      const ctx = document.getElementById('learning-chart') as HTMLCanvasElement;
      const estilos_data = this.userData.porcentaje_de_aprendizajes
      const data = {
        labels: ['Visual', '', 'Auditivo', '', 'Kinestésico'],
        datasets: [{
          label: 'Mis estilos de aprendizaje',
          data: [estilos_data.Visual, 100, estilos_data.Auditivo, 100, estilos_data.Kinestesico],
          backgroundColor: [
            'rgb(180, 99, 255)',
            'rgba(0, 0, 0, 0)',
            'rgb(75, 192, 192)',
            'rgba(0, 0, 0, 0)',
            'rgb(54, 162, 235)',
          ]
        }]
      };
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      console.log('Gráfico creado exitosamente');

    } catch (error) {
      console.error('Error al crear el gráfico:', error);
    }
  }
}