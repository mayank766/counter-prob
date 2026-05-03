import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlineApiService } from './deadline.service';
import { interval, map, Subject, takeUntil, takeWhile, timer } from 'rxjs';
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
          if (deadline == null || typeof deadline !== 'number' || deadline < 0 ) {
            this.error.set('Invalid deadline received from server.');
            console.log(this.error());
            return;
          }
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

    timer(0, 1000)
      .pipe(
        map((elapsed) => remaining - elapsed),
        takeWhile((timeLeft) => timeLeft >= 0),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((timeLeft) => {
        this.secondsLeft.set(timeLeft);

        if (timeLeft === 0) {
          this.isRunning.set(false);
        }
      });
  }
}
