import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'edit', loadComponent: () => import('./features/edit/edit').then(m => m.Edit) },
  { path: 'train', loadComponent: () => import('./features/train/train').then(m => m.Train) },
  { path: 'exam', loadComponent: () => import('./features/exam/exam').then(m => m.Exam) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
