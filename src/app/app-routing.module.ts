import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'edit', loadChildren: () => import('./features/edit/edit-module').then(m => m.EditModule) },
  { path: 'train', loadChildren: () => import('./features/train/train-module').then(m => m.TrainModule) },
  { path: 'exam', loadChildren: () => import('./features/exam/exam-module').then(m => m.ExamModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
