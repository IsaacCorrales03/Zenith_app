import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-create-group-form',
  templateUrl: './create-group-form.html',
  styleUrls: ['./create-group-form.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]  // Importar los módulos necesarios
})
export class CrearGrupoForm implements OnInit {
  formulario!: FormGroup;  // Eliminar la inicialización a null
  submitted = false;
  imagenPreview: string | null = null;

  constructor(private formBuilder: FormBuilder, private ApiService: ApiService) {

   }

   async ngOnInit(): Promise<void> {
    
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      public: [false, Validators.required],
      imagen: ['']
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() { 
    return this.formulario.controls; 
  }

  onImagenSeleccionada(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Verificar que sea una imagen
      if (!file.type.startsWith('image/')) {
        console.error('El archivo seleccionado no es una imagen');
        this.imagenPreview = null;
        return;
      }
      
      // Guardar el archivo en el formulario
      this.formulario.patchValue({
        imagen: file
      });
      
      // Crear URL para vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.formulario.invalid) {
      console.log('Formulario inválido');
      Object.keys(this.formulario.controls).forEach(controlName => {
        const control = this.formulario.get(controlName);
        if (control && control.invalid) {
          console.log(`Campo "${controlName}" inválido. Errores:`, control.errors);
        }
      });
      return;
    }

    
    // Aquí iría la lógica para enviar los datos a un servicio
    this.ApiService.crearGrupo(this.formulario.value).subscribe({
      next: (data) => {
        // Aquí puedes agregar un mensaje de éxito
        console.log('Grupo creado correctamente', data);
        alert('Grupo creado correctamente'); // O usar un mensaje en la interfaz
      },
      error: (err) => {
        // Aquí manejas el error
        console.error('Hubo un error:', err);
        alert('Hubo un error al crear el grupo');
      }
    });
    // Reiniciar el formulario
    this.submitted = false;
    this.formulario.reset();
    this.imagenPreview = null;
  }
}