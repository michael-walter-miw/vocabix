import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { WordStorageService } from '../../services/word-storage.service';
import { UiStateService } from '../../services/ui-state.service';

import { WordPair } from '../../models/word-pair';
import { Result } from '../../models/result';
import { ExamQuestion } from '../../models/exam-questions';

import { ArrayUtils } from '../../shared/array-utils';
import { EvaluationService } from '../../shared/evaluation.service';
import { MathUtils } from '../../shared/math-utils';
import { selectedExamSize } from '../../services/exam-settings.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.html',
  styleUrls: ['./exam.scss']
})
export class Exam implements OnInit, OnDestroy {
  private readonly storage = inject(WordStorageService);
  private readonly ui = inject(UiStateService);
  private readonly router = inject(Router);

  wordPairs: WordPair[] = [];
  questions: ExamQuestion[] = [];
  results: Result[] = [];

  currentIndex = 0;
  userInput = '';
  finished = false;

  examSize = selectedExamSize;

  setExamSize(size: '5' | '10' | 'all'): void {
    selectedExamSize.set(size);
  }

  ngOnInit(): void {
    this.ui.startExam(); // 🚨 lock navigation
    this.wordPairs = this.storage.load();
   }

  startExam(): void {
    const size = selectedExamSize();
    const shuffled = ArrayUtils.toShuffledQuestions(this.wordPairs);

    this.questions = (size === 'all')
      ? shuffled
      : shuffled.slice(0, parseInt(size));

    setTimeout(() => this.focusInput(), 0);
  }


  ngOnDestroy(): void {
    this.ui.endExam(); // ✅ unlock navigation
  }

  submit(): void {
    if (this.finished || this.currentIndex >= this.questions.length) return;

    const q = this.questions[this.currentIndex];
    const given = this.userInput.trim();
    const correct = EvaluationService.isCorrect(q.answer, given);

    this.results.push({ question: q.prompt, expected: q.answer, given, correct });

    this.userInput = '';
    this.currentIndex++;
    this.finished = this.currentIndex >= this.questions.length;

    if (this.finished) {
      this.ui.endExam(); // ✅ UNLOCK TABS AFTER EXAM ENDS
    } else {
      setTimeout(() => this.focusInput(), 0);
    }
  }

  restart(): void {
    this.results = [];
    this.currentIndex = 0;
    this.userInput = '';
    this.finished = false;

    const size = selectedExamSize();
    const shuffled = ArrayUtils.toShuffledQuestions(this.wordPairs);
    this.questions = (size === 'all')
      ? shuffled
      : shuffled.slice(0, parseInt(size));

    this.ui.startExam(); // 🔄 re-lock tabs
    setTimeout(() => this.focusInput(), 0);
  }


  back(): void {
    this.ui.endExam();
    this.userInput = '';
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

  getIcon(correct: boolean): string {
    return correct ? '✔️' : '❌';
  }

  getRowClass(correct: boolean): string {
    return correct ? 'table-success' : 'table-danger';
  }

  focusInput(): void {
    const input = document.querySelector<HTMLInputElement>('[data-testid="answer-input"]');
    input?.focus();
  }
}
