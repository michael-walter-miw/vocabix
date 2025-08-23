import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainRoutingModule } from './train-routing-module';
import { Train } from './train';


@NgModule({
  declarations: [
    Train
  ],
  imports: [
    CommonModule,
    TrainRoutingModule
  ]
})
export class TrainModule { }
