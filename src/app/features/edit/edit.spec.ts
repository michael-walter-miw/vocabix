import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Edit } from './edit';
import { WordStorageService } from '../../services/word-storage.service';

describe('Edit Component', () => {
  let fixture: ComponentFixture<Edit>;
  let component: Edit;

  const mockStorage: jest.Mocked<Pick<
    WordStorageService,
    'load' | 'save' | 'getExampleData'
  >> = {
    load: jest.fn(),
    save: jest.fn(),
    getExampleData: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Edit],
      providers: [{ provide: WordStorageService, useValue: mockStorage }],
    })
      .overrideComponent(Edit, { set: { template: '' } }) // avoid loading external HTML
      .compileComponents();

    fixture = TestBed.createComponent(Edit);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('loads existing word pairs from storage', () => {
      const stored = [
        ['hello', 'hallo'],
        ['cat', 'Katze'],
      ] as [string, string][];
      mockStorage.load.mockReturnValue(stored);

      component.ngOnInit();

      expect(component.wordPairs).toEqual(stored);
      expect(mockStorage.load).toHaveBeenCalledTimes(1);
    });
  });

  describe('save()', () => {
    it('does nothing when either word is empty after trimming', () => {
      component.word1 = '   ';
      component.word2 = 'value';
      const persistSpy = jest.spyOn(component, 'persist');

      component.save();

      expect(persistSpy).not.toHaveBeenCalled();
      expect(component.wordPairs).toEqual([]);
    });

    it('adds a new pair when not editing', () => {
      component.word1 = '  A ';
      component.word2 = ' B  ';
      const persistSpy = jest.spyOn(component, 'persist');

      component.save();

      expect(component.wordPairs).toEqual([['A', 'B']]);
      expect(component.word1).toBe('');
      expect(component.word2).toBe('');
      expect(component.editIndex).toBeNull();
      expect(persistSpy).toHaveBeenCalledTimes(1);
      expect(mockStorage.save).toHaveBeenCalledWith([['A', 'B']]);
    });

    it('updates an existing pair when editIndex is set', () => {
      component.wordPairs = [
        ['X', 'Y'],
        ['C', 'D'],
      ];
      component.edit(1); // sets word1, word2, editIndex
      component.word1 = '  E ';
      component.word2 = ' F  ';

      component.save();

      expect(component.wordPairs).toEqual([
        ['X', 'Y'],
        ['E', 'F'],
      ]);
      expect(mockStorage.save).toHaveBeenCalledWith([
        ['X', 'Y'],
        ['E', 'F'],
      ]);
      expect(component.editIndex).toBeNull();
    });
  });

  describe('edit()', () => {
    it('loads the selected pair into the form and sets editIndex', () => {
      component.wordPairs = [
        ['one', 'eins'],
        ['two', 'zwei'],
      ];

      component.edit(0);

      expect(component.word1).toBe('one');
      expect(component.word2).toBe('eins');
      expect(component.editIndex).toBe(0);
    });
  });

  describe('remove()', () => {
    it('removes the pair and persists', () => {
      component.wordPairs = [
        ['a', '1'],
        ['b', '2'],
        ['c', '3'],
      ];

      component.remove(1);

      expect(component.wordPairs).toEqual([
        ['a', '1'],
        ['c', '3'],
      ]);
      expect(mockStorage.save).toHaveBeenCalledWith([
        ['a', '1'],
        ['c', '3'],
      ]);
    });
  });

  describe('sortBy()', () => {
    it('sorts by first language (index 0) and persists', () => {
      component.wordPairs = [
        ['b', 'z'],
        ['a', 'y'],
        ['c', 'x'],
      ];

      component.sortBy(0);

      expect(component.wordPairs).toEqual([
        ['a', 'y'],
        ['b', 'z'],
        ['c', 'x'],
      ]);
      expect(mockStorage.save).toHaveBeenCalledWith([
        ['a', 'y'],
        ['b', 'z'],
        ['c', 'x'],
      ]);
    });

    it('sorts by second language (index 1) and persists', () => {
      component.wordPairs = [
        ['b', 'z'],
        ['a', 'y'],
        ['c', 'x'],
      ];

      component.sortBy(1);

      expect(component.wordPairs).toEqual([
        ['c', 'x'],
        ['a', 'y'],
        ['b', 'z'],
      ]);
      expect(mockStorage.save).toHaveBeenCalledWith([
        ['c', 'x'],
        ['a', 'y'],
        ['b', 'z'],
      ]);
    });
  });

  describe('insertExampleData()', () => {
    it('loads example data from storage and persists', () => {
      const example = [
        ['sun', 'Sonne'],
        ['moon', 'Mond'],
      ] as [string, string][];
      mockStorage.getExampleData.mockReturnValue(example);

      component.insertExampleData();

      expect(component.wordPairs).toEqual(example);
      expect(mockStorage.save).toHaveBeenCalledWith(example);
    });
  });

  describe('resetAll()', () => {
    it('clears all data and persists when confirmed', () => {
      component.wordPairs = [
        ['keep', 'behalten'],
      ];
      // jsdom provides window.confirm; if your setup doesn’t, you can define it:
      // (window as any).confirm ??= () => true;
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      component.resetAll();

      expect(confirmSpy).toHaveBeenCalledWith('Alle Daten wirklich löschen?');
      expect(component.wordPairs).toEqual([]);
      expect(mockStorage.save).toHaveBeenCalledWith([]);
    });

    it('does nothing when not confirmed', () => {
      component.wordPairs = [
        ['stay', 'bleiben'],
      ];
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      component.resetAll();

      expect(confirmSpy).toHaveBeenCalled();
      expect(component.wordPairs).toEqual([['stay', 'bleiben']]);
      expect(mockStorage.save).not.toHaveBeenCalled();
    });
  });

  describe('persist()', () => {
    it('delegates to storage.save with current pairs', () => {
      component.wordPairs = [
        ['x', 'y'],
      ];

      component.persist();

      expect(mockStorage.save).toHaveBeenCalledWith([['x', 'y']]);
    });
  });

  describe('resetForm()', () => {
    it('resets form fields and editIndex', () => {
      component.word1 = 'foo';
      component.word2 = 'bar';
      component.editIndex = 3;

      component.resetForm();

      expect(component.word1).toBe('');
      expect(component.word2).toBe('');
      expect(component.editIndex).toBeNull();
    });
  });
});
