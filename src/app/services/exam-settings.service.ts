import { signal } from '@angular/core';

export const selectedExamSize = signal<'5' | '10' | 'all'>('all');
