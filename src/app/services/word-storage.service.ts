import { Injectable } from '@angular/core';
import {WordPair} from '../models/word-pair';

@Injectable({
  providedIn: 'root'
})
export class WordStorageService {
  private readonly key = 'wordPairs';

  load(): WordPair[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save(pairs: WordPair[]): void {
    localStorage.setItem(this.key, JSON.stringify(pairs));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

  getExampleData(): WordPair[] {
    return [
      ['house', 'Haus'],
      ['cat', 'Katze'],
      ['book', 'Buch'],
      ['sun', 'Sonne'],
    ];
  }
}
