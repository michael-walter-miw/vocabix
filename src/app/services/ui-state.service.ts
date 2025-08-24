import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  readonly isExamActive = signal(false);

  startExam(): void {
    this.isExamActive.set(true);
  }

  endExam(): void {
    this.isExamActive.set(false);
  }
}
