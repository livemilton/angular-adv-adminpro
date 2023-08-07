import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit{

  
  //para cargar imagenes
  //public imgUrl ='';
  menuItems: any[] = [];
  public usuario!: Usuario;

  constructor( private sidebarService: SidebarService,
               private usuarioService: UsuarioService){
    
    this.menuItems = sidebarService.menu;
    //this.imgUrl = usuarioService.usuario.imagenUrl;
    this.usuario = usuarioService.usuario;

    //console.log(this.menuItems);

  }

  ngOnInit(): void {
  }

}
