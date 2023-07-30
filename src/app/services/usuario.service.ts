import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import{ tap, map, catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';

import { registerForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form.interface';

declare const google: any;

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor( private http: HttpClient,
                private router:Router,
                private ngZone: NgZone) { 

    this.googleInit();
  }

  //googleInit

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

  //metodo logout
  logout() {
    localStorage.removeItem('token');

    google.accounts.id.revoke('livemilton@gmail.com', ()=>{
      this.router.navigateByUrl('/login');
    })

  }

  //validar token
  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    
    return this.http.get(`${base_url}/login/renew`,{
      headers:{
      'x-token': token
      }
  }).pipe(
    tap( (resp: any)=>{
      localStorage.setItem('token', resp.token);
    }),
    map( resp=> true),
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
