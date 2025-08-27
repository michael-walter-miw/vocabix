import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Train } from './train';
import { WordStorageService } from '../../services/word-storage.service';
import { WordTrainerService } from '../../services/word-trainer.service';
import { EvaluationService } from '../../shared/evaluation.service';

describe('Train Component', () => {
  let fixture: ComponentFixture<Train>;
  let component: Train;

  const storageMock: jest.Mocked<Pick<WordStorageService, 'load'>> = {
    load: jest.fn(),
  };

  const trainerMock: jest.Mocked<
    Pick<WordTrainerService, 'init' | 'getNext' | 'increaseWeight'>
  > = {
    init: jest.fn(),
    getNext: jest.fn(),
    increaseWeight: jest.fn(),
  };

  beforeEach(async () => {
    jest.useFakeTimers();

    // default storage data
    storageMock.load.mockReturnValue([
      ['hello', 'hallo'],
      ['cat', 'Katze'],
      ['sun', 'Sonne'],
    ]);

    // deterministic next item from trainer
    trainerMock.getNext.mockReturnValue({
      index: 1,
      prompt: 'cat',
      answer: 'Katze',
      direction: 'L1toL2',
    });

    // simple correctness: case-insensitive trim
    jest
      .spyOn(EvaluationService, 'isCorrect')
      .mockImplementation(
        (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()
      );

    await TestBed.configureTestingModule({
      imports: [Train], // standalone component
      providers: [
        { provide: WordStorageService, useValue: storageMock },
        { provide: WordTrainerService, useValue: trainerMock },
      ],
    })
      .overrideComponent(Train, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Train);
    component = fixture.componentInstance;

    jest.clearAllMocks();
    // reset default mocks after clear
    storageMock.load.mockReturnValue([
      ['hello', 'hallo'],
      ['cat', 'Katze'],
      ['sun', 'Sonne'],
    ]);
    trainerMock.getNext.mockReturnValue({
      index: 1,
      prompt: 'cat',
      answer: 'Katze',
      direction: 'L1toL2',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ngOnInit loads words, initializes trainer, and calls next()', () => {
    const nextSpy = jest.spyOn(component, 'next');
    const focusSpy = jest.spyOn(component, 'focusInput').mockImplementation(() => undefined);

    component.ngOnInit();

    // next() schedules a 0ms focus
    jest.advanceTimersByTime(1);

    expect(storageMock.load).toHaveBeenCalledTimes(1);
    expect(trainerMock.init).toHaveBeenCalledWith(component.wordPairs);
    expect(nextSpy).toHaveBeenCalledTimes(1);

    expect(component.current).toEqual({
      prompt: 'cat',
      answer: 'Katze',
      direction: 'L1toL2',
    });
    expect(component.currentIndex).toBe(1);

    expect(component.userInput).toBe('');
    expect(component.feedback).toBeNull();
    expect(component.correctAnswer).toBe('');

    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it('next() sets current from trainer and resets UI state', () => {
    const focusSpy = jest.spyOn(component, 'focusInput').mockImplementation(() => undefined);

    component.wordPairs = [['a', 'b']] as any; // not empty
    component.next();
    jest.advanceTimersByTime(1);

    expect(trainerMock.getNext).toHaveBeenCalledWith(component.wordPairs);
    expect(component.current).toEqual({
      prompt: 'cat',
      answer: 'Katze',
      direction: 'L1toL2',
    });
    expect(component.currentIndex).toBe(1);

    expect(component.userInput).toBe('');
    expect(component.feedback).toBeNull();
    expect(component.correctAnswer).toBe('');
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it('next() sets current to null when there are no word pairs and does not schedule focus', () => {
    const focusSpy = jest.spyOn(component, 'focusInput').mockImplementation(() => undefined);

    component.wordPairs = [];
    component.next();

    // even if we advance, nothing should have been queued
    jest.advanceTimersByTime(5);

    expect(component.current).toBeNull();
    expect(focusSpy).not.toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it('check() marks correct answers, does NOT increase weight, and schedules next after 1500ms', () => {
    // seed a current question as ngOnInit+next would do
    component.current = {
      prompt: 'sun',
      answer: 'Sonne',
      direction: 'L1toL2',
    };
    component.currentIndex = 2;
    component.userInput = 'sonne';

    const nextSpy = jest.spyOn(component, 'next').mockImplementation(() => undefined);
    (EvaluationService.isCorrect as jest.Mock).mockReturnValue(true);

    component.check();

    // immediate effects
    expect(component.feedback).toBe('correct');
    expect(component.correctAnswer).toBe('');
    expect(trainerMock.increaseWeight).not.toHaveBeenCalled();

    // not yet called at 1499ms
    jest.advanceTimersByTime(1499);
    expect(nextSpy).not.toHaveBeenCalled();

    // called at 1500ms
    jest.advanceTimersByTime(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);

    nextSpy.mockRestore();
  });

  it('check() marks wrong answers, increases weight, and schedules next after 1500ms', () => {
    component.current = {
      prompt: 'cat',
      answer: 'Katze',
      direction: 'L1toL2',
    };
    component.currentIndex = 1;
    component.userInput = 'dog';

    const nextSpy = jest.spyOn(component, 'next').mockImplementation(() => undefined);
    (EvaluationService.isCorrect as jest.Mock).mockReturnValue(false);

    component.check();

    expect(component.feedback).toBe('wrong');
    expect(component.correctAnswer).toBe('Katze');
    expect(trainerMock.increaseWeight).toHaveBeenCalledWith(1);

    jest.advanceTimersByTime(1500);
    expect(nextSpy).toHaveBeenCalledTimes(1);

    nextSpy.mockRestore();
  });

  it('focusInput focuses the training input if present', () => {
    const el = document.createElement('input');
    el.setAttribute('data-testid', 'train-answer-input');
    const focus = jest.spyOn(el, 'focus').mockImplementation(() => undefined);
    document.body.appendChild(el);

    component.focusInput();
    expect(focus).toHaveBeenCalled();

    focus.mockRestore();
    document.body.removeChild(el);
  });
});
