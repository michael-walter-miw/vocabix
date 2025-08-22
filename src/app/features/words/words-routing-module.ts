import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Words } from './words';

const routes: Routes = [{ path: '', component: Words }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WordsRoutingModule { }
