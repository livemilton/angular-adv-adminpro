import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import{ tap, map, catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';

import { registerForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

declare const google: any;

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  //para cargar imagenes
  public usuario!: Usuario;

  constructor( private http: HttpClient,
                private router:Router,
                private ngZone: NgZone) { 

    this.googleInit();
  }
  //get token para evitar duplicar codigo ---
  get token(): string{
    return localStorage.getItem('token')|| '';
  }

  //get uid usuario
  get uid(): string {
    return this.usuario.uid || '';
  }


  //googleInit ----

  googleInit(){

    return new Promise<void> (resolve =>{
      gapi.load('auht2', () =>{
        this.auth2 = gapi.auth2.init({
          client_id:'201581320899-jq20om5k6451nggu16l4iurqd4vmusmu.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });

        resolve();
      });


    })
    
  }

  //metodo logout ----
  logout() {
    localStorage.removeItem('token');

    google.accounts.id.revoke('livemilton@gmail.com', ()=>{
      this.router.navigateByUrl('/login');
    })

  }

  //validar token
  validarToken(): Observable<boolean>{
    //como se tiene el token en el get la linea de codigo se evita
    //const token = localStorage.getItem('token') || '';
    
    return this.http.get(`${base_url}/login/renew`,{
      headers:{
      'x-token': this.token
      }
  }).pipe(
    map( (resp: any)=>{
      //obtener la instancia del usuario para cargar imagenes en el validar token
     //desestructurar las propiedades del objeto usuario
      const {
        email,
        google,
        nombre,
        role,
        img ='',
        uid
        } = resp.usuario;
      this.usuario = new Usuario( nombre, email, '', img, google, role, uid);
      localStorage.setItem('token', resp.token);
      //fin objeto usuario para cargar imagenes
      return true;
    }),
    
    catchError( error=> of(false))
    );

  }


  //tipado del formData es del registerForm o la interfaz
  crearUsuario( formData: registerForm){
    
    return this.http.post(`${base_url}/usuarios`, formData)
                  .pipe(
                    tap( (resp: any)=>{
                      localStorage.setItem('token', resp.token)
                    })
                  );

  }

  //actualizar perfil con la foto usuario

  actualizarPerfil (data: {email:string, nombre: string, role?:string}){

    data= {
      ...data,
      role: this.usuario.role
    };
    
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data,{
      headers: {
      'x-token': this.token
      }
    });

  }



  //Autenticacion del usuario

  login( formData: LoginForm){
    return this.http.post(`${ base_url}/login`, formData)
                .pipe(
                  tap( (resp: any)=>{
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  //posteo token
  loginGoogle( token: string){
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe(
        tap((resp:any) => {
          //console.log(resp)
          localStorage.setItem('token', resp.token)
        })
      )
  }


}
