import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {WordStorageService} from '../../services/word-storage.service';
import {WordPair} from '../../models/word-pair';
import {ArrayUtils} from '../../shared/array-utils';
import {EvaluationService} from '../../shared/evaluation.service';
import {Question} from '../../models/question';
import {MathUtils} from '../../shared/math-utils';

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
  questions: Question[] = [];
  currentIndex = 0;
  userInput = '';
  finished = false;
  results: Result[] = [];

  ngOnInit(): void {
    this.wordPairs = this.storage.load();

    if (this.wordPairs.length === 0) return;

    this.questions = ArrayUtils.toShuffledQuestions(this.wordPairs);
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
    return MathUtils.percentage(this.correctCount, this.total);
  }
}
