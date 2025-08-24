import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {WordStorageService} from '../../services/word-storage.service';
import {WordPair} from '../../models/word-pair';
import {ArrayUtils} from '../../shared/array-utils';
import {EvaluationService} from '../../shared/evaluation.service';
import {WordTrainerService} from '../../services/word-trainer.service';

@Component({
  selector: 'app-train',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './train.html',
  styleUrls: ['./train.scss']
})
export class Train implements OnInit {
  private readonly storage = inject(WordStorageService);
  private readonly trainer = inject(WordTrainerService);

  wordPairs: WordPair[] = [];
  currentIndex = 0;

  current: { prompt: string; answer: string; direction: 'L1toL2' | 'L2toL1' } | null = null;
  userInput = '';
  feedback: 'correct' | 'wrong' | null = null;
  correctAnswer = '';

  ngOnInit(): void {
    this.wordPairs = this.storage.load();
    this.trainer.init(this.wordPairs);
    this.next();
  }

  next(): void {
    if (this.wordPairs.length === 0) {
      this.current = null;
      return;
    }

    const next = this.trainer.getNext(this.wordPairs);
    this.current = {
      prompt: next.prompt,
      answer: next.answer,
      direction: next.direction
    };
    this.currentIndex = next.index;

    this.userInput = '';
    this.feedback = null;
    this.correctAnswer = '';
  }

  check(): void {
    if (!this.current) return;

    if (EvaluationService.isCorrect(this.current.answer, this.userInput)) {
      this.feedback = 'correct';
      this.correctAnswer = '';
    } else {
      this.feedback = 'wrong';
      this.correctAnswer = this.current.answer;

      // Optional: increase weight for this word
      this.trainer.increaseWeight(this.currentIndex);
    }

    setTimeout(() => this.next(), 1500);
  }
}
