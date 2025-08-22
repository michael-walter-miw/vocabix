import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WordsRoutingModule } from './words-routing-module';
import { Words } from './words';


@NgModule({
  declarations: [
    Words
  ],
  imports: [
    CommonModule,
    WordsRoutingModule
  ]
})
export class WordsModule { }
