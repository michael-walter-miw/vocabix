import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home) },
  { path: 'edit', loadComponent: () => import('./features/edit/edit').then(m => m.Edit) },
  { path: 'train', loadComponent: () => import('./features/train/train').then(m => m.Train) },
  { path: 'exam', loadComponent: () => import('./features/exam/exam').then(m => m.Exam) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
