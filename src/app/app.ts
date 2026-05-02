import { Component, signal } from '@angular/core';
import { DeadlineCountdownComponent } from './pages/deadline-countdown/deadline-countdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DeadlineCountdownComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('counter-prob');
}
