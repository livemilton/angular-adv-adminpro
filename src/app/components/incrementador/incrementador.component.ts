import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  ngOnInit(){
   this.btnClass =`btn ${ this.btnClass }`;
  }

  
  //numero estandar para barra de progreso y decorador input de padre a hijo
  @Input('valor') progreso:number = 50;
  
  //Color del boton
  @Input() btnClass: string ='btn-primary';

  // //metodo para controlar barra de progreso
  // get getPorcentaje(){
  //   return`${ this.progreso }%`;
  // }

  //emitir algun evento decorador @Output del componente padre
  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();


  cambiarValor (valor: number){

    //validacion para la barra de progreso
    if (this.progreso >= 100 && valor >=0){
      this.valorSalida.emit(100);
      this.progreso = 100;
      return;
    }

    if (this.progreso <=0 && valor <0){
      this.valorSalida.emit(0);
      this.progreso =0;
      return;
    }

    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
  }
  
  onChange(nuevoValor: number){

    if (nuevoValor >= 100){
      this.progreso = 100;
    } else if (nuevoValor <=0){
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }

    this.valorSalida.emit(this.progreso);
  }

}
