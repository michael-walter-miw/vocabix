import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { WordStorageService } from '../../services/word-storage.service';
import { WordPair } from '../../models/word-pair';
import { Result } from '../../models/result';

import { ArrayUtils } from '../../shared/array-utils';
import { EvaluationService } from '../../shared/evaluation.service';
import { MathUtils } from '../../shared/math-utils';
import {ExamQuestion} from '../../models/exam-questions';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.html',
  styleUrls: ['./exam.scss']
})
export class Exam implements OnInit {
  private readonly storage = inject(WordStorageService);
  private readonly router = inject(Router);

  wordPairs: WordPair[] = [];
  questions: ExamQuestion[] = [];
  results: Result[] = [];

  currentIndex: number = 0;
  userInput: string = '';
  finished: boolean = false;

  ngOnInit(): void {
    this.wordPairs = this.storage.load();

    if (this.wordPairs.length === 0) return;

    this.questions = ArrayUtils.toShuffledQuestions(this.wordPairs);
  }

  submit(): void {
    if (this.finished || this.currentIndex >= this.questions.length) return;

    const q: ExamQuestion = this.questions[this.currentIndex];
    const given: string = this.userInput.trim();
    const correct: boolean = EvaluationService.isCorrect(q.answer, given);

    this.results.push({
      question: q.prompt,
      expected: q.answer,
      given,
      correct
    });

    this.userInput = '';
    this.currentIndex++;

    this.finished = this.currentIndex >= this.questions.length;
  }

  restart(): void {
    this.results = [];
    this.questions = ArrayUtils.toShuffledQuestions(this.wordPairs);
    this.currentIndex = 0;
    this.userInput = '';
    this.finished = false;
  }

  back(): void {
    void this.router.navigateByUrl('/edit');
  }

  get total(): number {
    return this.results.length;
  }

  get correctCount(): number {
    return this.results.filter(r => r.correct).length;
  }

  get percentage(): number {
    return MathUtils.percentage(this.correctCount, this.total);
  }
}
