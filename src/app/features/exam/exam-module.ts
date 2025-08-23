import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing-module';
import { Exam } from './exam';


@NgModule({
  declarations: [
    Exam
  ],
  imports: [
    CommonModule,
    ExamRoutingModule
  ]
})
export class ExamModule { }
