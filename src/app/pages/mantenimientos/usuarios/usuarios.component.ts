import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy{

  //inicializar totalUsuarios y usuarios del modelo, desde(paginado), cargando (icono de carga)

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[]=[];

  public imgSubs!: Subscription;
  public desde: number=0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService){}
  
   
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    //peticion con la paginacion de la carga de los usuarios
    this.cargarUsuarios();

    //subscribirme a la nueva imagen cargada para refrescar con la imagen actualizada
    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(
          delay(100)
        )
        .subscribe (img=> {
          this.cargarUsuarios()
        });

  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe( ({total, usuarios})=>{
        this.totalUsuarios = total;
        this.usuarios = usuarios; 
        this.usuariosTemp = usuarios;
        this.cargando = false;
      })

  }

  //metodo para cambiar pagina y/o paginador
  cambiarPagina (valor:number){
    this.desde +=valor;

    if(this.desde <0){
      this.desde =0;
    } else if (this.desde >= this.totalUsuarios){
      this.desde -=valor;
    }
    //despues de realizar la validación, cargarUsuarios
    this.cargarUsuarios();
  }


  //metodo buscar
  buscar( termino: string){

    if( termino.length === 0 ){
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedasService.buscar('usuarios', termino)
      .subscribe ( resp => {
        this.usuarios= resp;
      });
    
  }

  //metodo eliminar usuario
  eliminarUsuario( usuario:Usuario){

    //Validacion para prevenir borrarse a si mismo!
    if(usuario.uid === this.usuarioService.uid){
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
      return;
    }
    
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result)=>{
      if(result.value){
        //llamar al servicio

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe( resp =>{
            //llamar al metodo para que se actualice el navegador inmediatamente


            this.cargarUsuarios();
            Swal.fire(
              'Usuario borrado',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
            );

            });
            
      }
    })


  }

  cambiarRole(usuario:Usuario){

    this.usuarioService.guardarUsuario( usuario)
      .subscribe( resp=>{
        console.log(resp);
      })
  }

  abrirModal( usuario: Usuario){
  
    this.modalImagenService.abrirModal('usuarios', usuario.uid! , usuario.img);
  }


}
