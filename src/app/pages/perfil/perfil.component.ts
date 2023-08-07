import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';

@Component({

  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit{

  public perfilForm!: FormGroup;
  //importar el modelo
  public usuario!:any;
  //variable para subir imagen
  public imagenSubir!: File;
  //constante para cambiar imagen
  public imgTemp: any = null;

  constructor (private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private fileUploadService: FileUploadService){

    //informacion del usuario en el modelo
    this.usuario = usuarioService.usuario;
                }

  ngOnInit(): void {
    
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre , Validators.required],
      email :[this.usuario.email , [Validators.required, Validators.email]],
    });

  }

  actualizarPerfil(){
    
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
    .subscribe(resp =>{
      //extraer nombre y email del perfilForm
      const{nombre, email} = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;

      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
      
    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error');
    });
  }

  cambiarImagen( event: any){
    
    this.imagenSubir= event.target.files[0];
    
    //const filterValue = (event?.target as HTMLInputElement).value;
    //para seleccionar y cargar imagen con reader y url64

    if (!this.imagenSubir) {
      return this.imgTemp;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenSubir);
    reader.onloadend = () =>{
      this.imgTemp = reader.result;
    }

  }

  subirImagen(){
    
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid )
      .then (img  => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      }). catch( err =>{
        Swal.fire ('Error', 'No se pudo subir la imagen', 'error');
      })

  }

//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     // ... etc...
// }
}
