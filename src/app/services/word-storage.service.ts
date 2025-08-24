import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordStorageService {
  private readonly key = 'wordPairs';

  load(): [string, string][] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save(pairs: [string, string][]): void {
    localStorage.setItem(this.key, JSON.stringify(pairs));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
