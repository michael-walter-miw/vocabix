import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordStorageService } from '../../services/word-storage.service';
import {WordPair} from '../../models/word-pair';
import {ArrayUtils} from '../../shared/array-utils';

@Component({
  selector: 'app-train',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './train.html',
  styleUrls: ['./train.scss']
})
export class Train implements OnInit {
  private readonly storage = inject(WordStorageService);

  wordPairs: WordPair[] = [];
  weights: number[] = [];

  current: { prompt: string; answer: string; direction: 'L1toL2' | 'L2toL1' } | null = null;
  userInput = '';
  feedback: 'correct' | 'wrong' | null = null;
  correctAnswer = '';

  ngOnInit(): void {
    this.wordPairs = this.storage.load();
    this.weights = Array(this.wordPairs.length).fill(1);
    this.next();
  }

  next(): void {
    if (this.wordPairs.length === 0) {
      this.current = null;
      return;
    }

    const index = ArrayUtils.weightedRandomIndex(this.weights);
    const [w1, w2] = this.wordPairs[index];
    const dir = Math.random() < 0.5 ? 'L1toL2' : 'L2toL1';

    this.current = {
      prompt: dir === 'L1toL2' ? w1 : w2,
      answer: dir === 'L1toL2' ? w2 : w1,
      direction: dir
    };

    this.userInput = '';
    this.feedback = null;
    this.correctAnswer = '';
  }

  check(): void {
    if (!this.current) return;

    const correct = this.current.answer.trim().toLowerCase();
    const given = this.userInput.trim().toLowerCase();

    if (given === correct) {
      this.feedback = 'correct';
      this.correctAnswer = '';
    } else {
      this.feedback = 'wrong';
      this.correctAnswer = this.current.answer;

      // Optional: increase weight for this word
      const index = this.wordPairs.findIndex(p =>
        p.includes(this.current!.prompt) && p.includes(this.current!.answer)
      );
      if (index !== -1) {
        this.weights[index] = Math.min(this.weights[index] + 2, 10); // max cap
      }
    }

    setTimeout(() => this.next(), 1500);
  }
}
