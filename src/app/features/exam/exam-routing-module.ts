import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Exam } from './exam';

const routes: Routes = [{ path: '', component: Exam }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
