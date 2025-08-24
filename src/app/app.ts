import { UiStateService } from './services/ui-state.service';
import {Component, inject, OnInit, signal} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('vocabix');
  protected readonly ui = inject(UiStateService);

  ngOnInit(): void {
    this.ui.endExam(); // 🧹 always reset exam lock on app load
  }
}
