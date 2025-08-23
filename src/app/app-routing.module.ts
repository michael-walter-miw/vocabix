import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'edit', loadComponent: () => import('./features/edit/edit').then(m => m.Edit) },
  { path: 'train', loadChildren: () => import('./features/train/train-module').then(m => m.TrainModule) },
  { path: 'exam', loadChildren: () => import('./features/exam/exam-module').then(m => m.ExamModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
