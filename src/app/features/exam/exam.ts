import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Result = { question: string; expected: string; given: string; correct: boolean };

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.html'
})
export class Exam implements OnInit {
  wordPairs: [string, string][] = [];
  questions: { prompt: string; answer: string }[] = [];
  currentIndex = 0;

  userInput = '';
  finished = false;
  results: Result[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('wordPairs');
    this.wordPairs = saved ? JSON.parse(saved) : [];

    if (this.wordPairs.length === 0) return;

    const shuffled = [...this.wordPairs].sort(() => Math.random() - 0.5);
    this.questions = shuffled.map(([w1, w2]) =>
      Math.random() < 0.5
        ? { prompt: w1, answer: w2 }
        : { prompt: w2, answer: w1 }
    );
  }

  submit(): void {
    const q = this.questions[this.currentIndex];
    const given = this.userInput.trim();
    const correct = q.answer.trim().toLowerCase() === given.toLowerCase();

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
