import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordStorageService } from '../../services/word-storage.service';
import {WordPair} from '../../models/word-pair';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.scss']
})
export class Edit implements OnInit {
  private readonly storage = inject(WordStorageService);

  word1 = '';
  word2 = '';
  editIndex: number | null = null;
  wordPairs: WordPair[] = [];

  ngOnInit(): void {
    this.wordPairs = this.storage.load();
  }

  save(): void {
    const trimmed = [this.word1.trim(), this.word2.trim()] as WordPair;
    if (!trimmed[0] || !trimmed[1]) return;

    if (this.editIndex !== null) {
      this.wordPairs[this.editIndex] = trimmed;
    } else {
      this.wordPairs.push(trimmed);
    }

    this.resetForm();
    this.persist();
  }

  edit(index: number): void {
    [this.word1, this.word2] = this.wordPairs[index];
    this.editIndex = index;
  }

  remove(index: number): void {
    this.wordPairs.splice(index, 1);
    this.persist();
  }

  sortBy(lang: 0 | 1): void {
    this.wordPairs.sort((a, b) => a[lang].localeCompare(b[lang]));
    this.persist();
  }

  insertExampleData(): void {
    this.wordPairs = [
      ['house', 'Haus'],
      ['cat', 'Katze'],
      ['book', 'Buch'],
      ['sun', 'Sonne'],
    ];
    this.persist();
  }

  resetAll(): void {
    if (confirm('Alle Daten wirklich löschen?')) {
      this.wordPairs = [];
      this.persist();
    }
  }

  persist(): void {
    this.storage.save(this.wordPairs);
  }

  resetForm(): void {
    this.word1 = '';
    this.word2 = '';
    this.editIndex = null;
  }
}
