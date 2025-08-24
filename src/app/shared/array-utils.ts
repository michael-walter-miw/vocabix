import { WordPair } from '../models/word-pair';
import { Question } from '../models/question';
import {ExamQuestion} from '../models/exam-questions';

export class ArrayUtils {
  static shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  static weightedRandomIndex(weights: number[]): number {
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      rand -= weights[i];
      if (rand <= 0) return i;
    }
    return weights.length - 1;
  }

  static toShuffledQuestions(pairs: WordPair[]): ExamQuestion[] {
    const shuffled = this.shuffle(pairs);
    return shuffled.map(([w1, w2], index) => {
      const direction = Math.random() < 0.5 ? 'L1toL2' : 'L2toL1';
      return {
        prompt: direction === 'L1toL2' ? w1 : w2,
        answer: direction === 'L1toL2' ? w2 : w1,
        index,
        direction
      };
    });
  }}
