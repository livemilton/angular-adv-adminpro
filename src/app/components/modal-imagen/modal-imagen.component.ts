import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';


@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit{

    //variable para subir imagen
    public imagenSubir!: File;
    //constante para cambiar imagen
    public imgTemp: any = null;
  
  constructor( public modalImagenService: ModalImagenService,
               public fileUploadService: FileUploadService){}

  ngOnInit(): void{

  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then (img  => {
        
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
        //emision de la imagen para que el componente se actualice con emit
        this.modalImagenService.nuevaImagen.emit(img);

        this.cerrarModal();
      }). catch( err =>{
        Swal.fire ('Error', 'No se pudo subir la imagen', 'error');
      })

  }


}
