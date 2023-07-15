import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';



@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  
  labels1: string [] = [ 'Pan', 'Refresco', 'Tacos' ];
  data1: ChartData<'doughnut'> = {
    datasets: [
      { data: [ 10, 15, 40 ], 
        backgroundColor: ['#6857E6','#009FEE', '#F02059'] 
      },
    ]


  }
  
  
}
