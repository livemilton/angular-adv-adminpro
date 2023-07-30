import { Component, AfterViewInit, NgZone, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit{

  @ViewChild ('googleBtn') googleBtn: ElementRef | undefined;

  public formSubmitted = false;
  public auth2:any;

  public loginForm:FormGroup = this.fb.group({
    //para remember en el login
    email: [ localStorage.getItem( 'email' )|| '',[Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });


  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone){}

              
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }
  //metodo para boton google en el afterViewInit
  googleInit(){
    google.accounts.id.initialize({
      client_id: "201581320899-jq20om5k6451nggu16l4iurqd4vmusmu.apps.googleusercontent.com",
      //forma anterior se debe llamar de esta manera para la referencia del this.
      //callback: this.handleCredentialResponse
      callback: (response: any) => this.handleCredentialResponse(response)

    });

    google.accounts.id.renderButton(
      //document.getElementById("buttonDiv"),
      this.googleBtn?.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any){
    //console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential)
      .subscribe( resp =>{
        //console.log({ login: resp})
        this.router.navigateByUrl('/');
      })
  }


  login(){

    this.usuarioService.login( this.loginForm.value )
      .subscribe(resp =>{
        //validacion remember en el login
        if( this.loginForm.get('remember')?.value){
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        }else {
          localStorage.removeItem('email');
        }
        //navegar al dashboard
        this.router.navigateByUrl('/');
        
      }, (err) => {
        //si sucede un error
        Swal.fire('Error', err.error.msg, 'error');
      });

    
    //this.router.navigateByUrl('/');
    //console.log(this.loginForm.value);
  }

}
//