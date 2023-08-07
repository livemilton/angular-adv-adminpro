import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'
  ]
})
export class RegisterComponent {

  public formSubmitted= false;

  public registerForm = this.fb.group({
    nombre: ['milton',Validators.required],
    email: ['test100@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terminos:[ true, Validators.required],

    //validacion del form para postear
  }, {
    validators: this.passwordsIguales ('password', 'password2')
  });

  constructor( private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private router: Router){}

  //metodo crear usuario
  crearUsuario(){
    this.formSubmitted = true;
    //console.log( this.registerForm.value);

    //Mensaje para usuario en el posteo del form
    if( this.registerForm.invalid){
      return;
    }

    //Realizar el posteo
    this.usuarioService.crearUsuario( this.registerForm.value)
      .subscribe( resp => {
        
        //navegar al dashboard
        this.router.navigateByUrl('/');

      }, (err) => {

        //si sucede un error con sweet alert
        Swal.fire('Error', err.error.msg, 'error');
      });


  }

  //Validacion campo de nombre del form si el campo es invalido
  campoNoValido(campo:string){
    if( this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else {
      return false;
    }

  }

  //validacion contraseñas
    contrasenasNoValidas(){
      const pass1 = this.registerForm.get('password')?.value;
      const pass2 = this.registerForm.get('password2')?.value;

      //si las contraseñas son diferentes
      if( (pass1 !== pass2) && this.formSubmitted ){
        return true;

      }else {
        return false;
      }

    }


  //validacion terminos si esta en false para el usuario

  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }


  //funcion password iguales para posteo del form retorna una funcion del formGroup

  passwordsIguales(pass1Name: string, pass2Name: string){

    return(formGroup: FormGroup) => {

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if( pass1Control?.value === pass2Control?.value){
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({ noEsIgual: true})
      }


    }

  }

}
