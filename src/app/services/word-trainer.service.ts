import { Injectable } from '@angular/core';
import { WordPair } from '../models/word-pair';
import { ArrayUtils } from '../shared/array-utils';

@Injectable({ providedIn: 'root' })
export class WordTrainerService {
  private weights: number[] = [];

  init(pairs: WordPair[]): void {
    this.weights = Array(pairs.length).fill(1);
  }

  getNext(pairs: WordPair[]): {
    prompt: string;
    answer: string;
    direction: 'L1toL2' | 'L2toL1';
    index: number;
  } {
    const index = ArrayUtils.weightedRandomIndex(this.weights);
    const [w1, w2] = pairs[index];
    const dir = Math.random() < 0.5 ? 'L1toL2' : 'L2toL1';

    return {
      prompt: dir === 'L1toL2' ? w1 : w2,
      answer: dir === 'L1toL2' ? w2 : w1,
      direction: dir,
      index
    };
  }

  increaseWeight(index: number): void {
    this.weights[index] = Math.min(this.weights[index] + 2, 10);
  }
}
