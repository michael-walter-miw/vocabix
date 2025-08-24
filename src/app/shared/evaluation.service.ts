// shared/evaluation.service.ts
export class EvaluationService {
  static isCorrect(expected: string, given: string): boolean {
    return expected.trim().toLowerCase() === given.trim().toLowerCase();
  }
}
