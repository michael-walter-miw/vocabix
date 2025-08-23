import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Train } from './train';

const routes: Routes = [{ path: '', component: Train }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainRoutingModule { }
