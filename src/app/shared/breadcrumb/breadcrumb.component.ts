import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter,map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [
  ]
})
export class BreadcrumbComponent implements OnDestroy{

  public title!: string;
  public tituloSubs$!: Subscription;

  constructor (private router: Router){

    this.tituloSubs$ = this.getArgumentosRuta()
                        .subscribe(({title}) =>{
                            this.title = title;
                            document.title = `AdminPro - ${ this.title }`;
                        });
    
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }


  getArgumentosRuta(){

    return this.router.events
      .pipe( 
        filter<any>( event => event instanceof ActivationEnd ),
        filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
        map( (event: ActivationEnd) => event.snapshot.data),

      )
    
  }

}
