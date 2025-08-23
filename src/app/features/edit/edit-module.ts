import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoutingModule } from './edit-routing-module';
import { Edit } from './edit';


@NgModule({
  declarations: [
    Edit
  ],
  imports: [
    CommonModule,
    EditRoutingModule
  ]
})
export class EditModule { }
