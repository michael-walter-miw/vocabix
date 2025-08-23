import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Edit } from './edit';

const routes: Routes = [{ path: '', component: Edit }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
