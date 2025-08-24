import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WordStorageService } from '../../services/word-storage.service';
import {WordPair} from '../../models/word-pair';
import { ArrayUtils } from '../../shared/array-utils';
import {EvaluationService} from '../../shared/evaluation.service';

type Result = { question: string; expected: string; given: string; correct: boolean };

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
  questions: { prompt: string; answer: string }[] = [];
  currentIndex = 0;

  userInput = '';
  finished = false;
  results: Result[] = [];

  ngOnInit(): void {
    this.wordPairs = this.storage.load();

    if (this.wordPairs.length === 0) return;

    const shuffled = ArrayUtils.shuffle(this.wordPairs);
    this.questions = shuffled.map(([w1, w2]) =>
      Math.random() < 0.5
        ? { prompt: w1, answer: w2 }
        : { prompt: w2, answer: w1 }
    );
  }

  submit(): void {
    const q = this.questions[this.currentIndex];
    const given = this.userInput.trim();
    const correct = EvaluationService.isCorrect(q.answer, given);
    this.results.push({
      question: q.prompt,
      expected: q.answer,
      given,
      correct
    });

    this.userInput = '';
    this.currentIndex++;

    if (this.currentIndex >= this.questions.length) {
      this.finished = true;
    }
  }

  restart(): void {
    this.router.navigateByUrl('/exam'); // reload component
  }

  back(): void {
    this.router.navigateByUrl('/edit');
  }

  get total() {
    return this.results.length;
  }

  get correctCount() {
    return this.results.filter(r => r.correct).length;
  }

  get percentage() {
    return this.total > 0 ? Math.round((this.correctCount / this.total) * 100) : 0;
  }
}
