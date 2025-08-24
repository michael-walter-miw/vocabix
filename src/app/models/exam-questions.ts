import { Question } from './question';

export type ExamQuestion = Question & {
  index: number;
  direction: 'L1toL2' | 'L2toL1';
};
