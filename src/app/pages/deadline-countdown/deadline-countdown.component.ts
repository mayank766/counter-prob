import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlineApiService } from './deadline.service';
import { interval, Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-deadline-countdown',
  imports: [CommonModule],
  templateUrl: './deadline-countdown.component.html',
  styleUrls: ['./deadline-countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeadlineCountdownComponent {
  readonly #deadlineApi = inject(DeadlineApiService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #countdownStop$ = new Subject<void>();

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

    this.#deadlineApi
      .getSecondsLeft()
      .pipe(
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe({
        next: (deadline) => {
          this.loading.set(false);
          this.secondsLeft.set(deadline);
          this.isRunning.set(true);
          this.startCountdown(deadline);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Unable to load deadline. Please try again.');
        }
      });
  }

  startCountdown(initialSeconds: number): void {
    let remaining = initialSeconds;

    interval(1000)
      .pipe(
        takeUntil(this.#countdownStop$),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(() => {
        remaining--;

        // Stop and clean up when countdown reaches 0
        if (remaining <= 0) {
          this.isRunning.set(false);
          this.secondsLeft.set(null);
          this.#countdownStop$.next(); // Stop the interval completely
          return;
        }

        this.secondsLeft.set(remaining);
      });
  }
}
