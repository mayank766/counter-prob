import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlineApiService } from './deadline.service';
import { interval, Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-deadline-countdown',
  imports: [CommonModule],
  templateUrl: './deadline-countdown.component.html',
  styleUrls: ['./deadline-countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeadlineCountdownComponent implements OnDestroy {
  #counterSubscription = new Subscription();
  #apiSubscription = new Subscription();
  #deadlineApi = inject(DeadlineApiService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly secondsLeft = signal<number | null>(null);
  readonly isRunning = signal(false);

  start(): void {
    if (this.loading() || this.isRunning()) {
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    // Fetch deadline from API
    this.#apiSubscription = this.#deadlineApi.getSecondsLeft().subscribe({
      next: (deadline) => {
        this.loading.set(false);
        this.secondsLeft.set(deadline);
        this.isRunning.set(true);
        this.#startCountdown(deadline);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load deadline. Please try again.');
      }
    });
  }

  #startCountdown(initialSeconds: number): void {
    let remaining = initialSeconds;

    this.#counterSubscription.unsubscribe();
    this.#counterSubscription = interval(1000).subscribe(() => {
      remaining--;

      if (remaining < 0) {
        this.#counterSubscription.unsubscribe();
        this.isRunning.set(false);
        this.secondsLeft.set(null);
      } else {
        this.secondsLeft.set(remaining);
      }
    });
  }

  ngOnDestroy(): void {
    this.#counterSubscription.unsubscribe();
    this.#apiSubscription.unsubscribe();
  }
}
