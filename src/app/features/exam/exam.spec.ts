import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Exam } from './exam';
import { WordStorageService } from '../../services/word-storage.service';
import { UiStateService } from '../../services/ui-state.service';
import { Router } from '@angular/router';

import { ArrayUtils } from '../../shared/array-utils';
import { EvaluationService } from '../../shared/evaluation.service';
import { MathUtils } from '../../shared/math-utils';

import type { ExamQuestion } from '../../models/exam-questions';
import * as ExamSettings from '../../services/exam-settings.service';

describe('Exam Component', () => {
  let fixture: ComponentFixture<Exam>;
  let component: Exam;

  const storageMock: jest.Mocked<Pick<WordStorageService, 'load'>> = {
    load: jest.fn(),
  };

  const uiMock: jest.Mocked<Pick<UiStateService, 'startExam' | 'endExam'>> = {
    startExam: jest.fn(),
    endExam: jest.fn(),
  };

  const routerMock = {
    navigateByUrl: jest.fn().mockResolvedValue(true),
  };

  const makeQ = (index: number, prompt: string, answer: string): ExamQuestion => ({
    index,
    direction: 'L1toL2',
    prompt,
    answer,
  });

  beforeEach(async () => {
    jest.useFakeTimers();

    // Default storage data
    storageMock.load.mockReturnValue([
      ['hello', 'hallo'],
      ['cat', 'Katze'],
      ['sun', 'Sonne'],
    ]);

    // Deterministic "shuffle"
    jest.spyOn(ArrayUtils, 'toShuffledQuestions').mockReturnValue([
      makeQ(0, 'hello', 'hallo'),
      makeQ(1, 'cat', 'Katze'),
      makeQ(2, 'sun', 'Sonne'),
    ]);

    // Simple correctness check
    jest
      .spyOn(EvaluationService, 'isCorrect')
      .mockImplementation((a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase());

    await TestBed.configureTestingModule({
      imports: [Exam], // standalone component
      providers: [
        { provide: WordStorageService, useValue: storageMock },
        { provide: UiStateService, useValue: uiMock },
        { provide: Router, useValue: routerMock },
      ],
    })
      .overrideComponent(Exam, { set: { template: '' } }) // logic-only tests
      .compileComponents();

    fixture = TestBed.createComponent(Exam);
    component = fixture.componentInstance;

    // Default exam size for tests unless overridden in a case
    ExamSettings.selectedExamSize.set('5');

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ngOnInit loads word pairs and locks the UI', () => {
    component.ngOnInit();
    expect(storageMock.load).toHaveBeenCalledTimes(1);
    expect(component.wordPairs.length).toBe(3);
    expect(uiMock.startExam).toHaveBeenCalledTimes(1);
  });

  it('startExam builds questions based on selected size and focuses input (via timeout)', () => {
    ExamSettings.selectedExamSize.set('5');
    const focusSpy = jest.spyOn(component, 'focusInput').mockImplementation(() => undefined);
    component.duration = 5;

    component.ngOnInit();
    component.startExam();

    // Run the zero-delay setTimeout for focus
    jest.advanceTimersByTime(1);

    expect(ArrayUtils.toShuffledQuestions).toHaveBeenCalledWith(component.wordPairs);
    // only 3 available even if size is "5"
    expect(component.questions.length).toBe(3);
    // Called in ngOnInit and again in startExam
    expect(uiMock.startExam).toHaveBeenCalledTimes(2);
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it('respects "all" exam size', () => {
    ExamSettings.selectedExamSize.set('all');
    component.ngOnInit();
    component.startExam();
    jest.advanceTimersByTime(1);
    expect(component.questions.length).toBe(3);
  });

  it('respects "10" exam size (uses all available if fewer)', () => {
    ExamSettings.selectedExamSize.set('10');
    component.ngOnInit();
    component.startExam();
    jest.advanceTimersByTime(1);
    expect(component.questions.length).toBe(3);
  });

  it('submit records results, advances index, and ends exam at the last question (unlock UI)', () => {
    ExamSettings.selectedExamSize.set('5');
    component.ngOnInit();
    component.startExam();
    jest.advanceTimersByTime(1);

    // Q1 correct
    component.userInput = 'hallo';
    component.submit();
    expect(component.results).toHaveLength(1);
    expect(component.results[0]).toMatchObject({ expected: 'hallo', correct: true });
    expect(component.finished).toBe(false);

    // Q2 wrong
    component.userInput = 'dog';
    component.submit();
    expect(component.results).toHaveLength(2);
    expect(component.results[1]).toMatchObject({ expected: 'Katze', correct: false });
    expect(component.finished).toBe(false);

    // Q3 correct -> finishes
    component.userInput = 'Sonne';
    component.submit();
    expect(component.results).toHaveLength(3);
    expect(component.finished).toBe(true);
    expect(uiMock.endExam).toHaveBeenCalledTimes(1);
  });

  it('after submit (not finished) it focuses input again via timeout', () => {
    ExamSettings.selectedExamSize.set('5');
    component.ngOnInit();
    component.startExam();
    jest.advanceTimersByTime(1);

    const focusSpy = jest.spyOn(component, 'focusInput').mockImplementation(() => undefined);

    // First submit (not yet finished)
    component.userInput = 'hallo';
    component.submit();
    jest.advanceTimersByTime(1);

    expect(component.finished).toBe(false);
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it('timer finishes the exam when time runs out', () => {
    ExamSettings.selectedExamSize.set('5');
    component.ngOnInit();
    component.duration = 0; // 0 minutes -> finish on first tick
    component.startExam();

    // First 1s tick triggers finishExam
    jest.advanceTimersByTime(1000);

    expect(component.finished).toBe(true);
    expect(uiMock.endExam).toHaveBeenCalled();
  });

  it('restart resets state, rebuilds questions twice, and re-locks the UI', () => {
    ExamSettings.selectedExamSize.set('5');
    component.ngOnInit();

    jest.clearAllMocks(); // isolate restart behavior
    component.restart();  // calls startExam() internally and then rebuilds again
    jest.advanceTimersByTime(1);

    expect(ArrayUtils.toShuffledQuestions).toHaveBeenCalledTimes(2);
    expect(component.results).toEqual([]);
    expect(component.currentIndex).toBe(0);
    expect(component.finished).toBe(false);
    expect(uiMock.startExam).toHaveBeenCalledTimes(2); // startExam + explicit re-lock
  });

  it('back() unlocks UI, clears input, and navigates to /edit', async () => {
    component.userInput = 'temp';
    await component.back();
    expect(uiMock.endExam).toHaveBeenCalled();
    expect(component.userInput).toBe('');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/edit');
  });

  it('setExamSize delegates to selectedExamSize.set', () => {
    const setSpy = jest.spyOn(ExamSettings.selectedExamSize, 'set');
    component.setExamSize('10');
    expect(setSpy).toHaveBeenCalledWith('10');
    setSpy.mockRestore();
  });

  it('setDuration and setPassThreshold update values', () => {
    component.setDuration(7);
    component.setPassThreshold(75);
    expect(component.duration).toBe(7);
    expect(component.passThreshold).toBe(75);
  });

  it('percentage delegates to MathUtils.percentage', () => {
    const spy = jest.spyOn(MathUtils, 'percentage').mockReturnValue(42);

    // Seed results: 2 correct of 3
    (component as any).results = [
      { question: 'q1', expected: 'a', given: 'a', correct: true },
      { question: 'q2', expected: 'b', given: 'x', correct: false },
      { question: 'q3', expected: 'c', given: 'c', correct: true },
    ];

    expect(component.correctCount).toBe(2);
    expect(component.total).toBe(3);
    expect(component.percentage).toBe(42);
    expect(spy).toHaveBeenCalledWith(2, 3);

    spy.mockRestore();
  });

  it('formatTime produces m:ss', () => {
    expect(component.formatTime(0)).toBe('0:00');
    expect(component.formatTime(5)).toBe('0:05');
    expect(component.formatTime(65)).toBe('1:05');
    expect(component.formatTime(600)).toBe('10:00');
  });

  it('getIcon and getRowClass reflect correctness', () => {
    expect(component.getIcon(true)).toBe('✔️');
    expect(component.getIcon(false)).toBe('❌');
    expect(component.getRowClass(true)).toBe('table-success');
    expect(component.getRowClass(false)).toBe('table-danger');
  });

  it('focusInput focuses the answer input if present', () => {
    const el = document.createElement('input');
    el.setAttribute('data-testid', 'answer-input');
    const focus = jest.spyOn(el, 'focus').mockImplementation(() => undefined);
    document.body.appendChild(el);

    component.focusInput();
    expect(focus).toHaveBeenCalled();

    focus.mockRestore();
    document.body.removeChild(el);
  });

  it('ngOnDestroy clears timers and unlocks UI', () => {
    component.startTimer();
    expect((component as any).timerId).not.toBeNull();

    component.ngOnDestroy();
    expect((component as any).timerId).toBeNull();
    expect(uiMock.endExam).toHaveBeenCalled();
  });
});
