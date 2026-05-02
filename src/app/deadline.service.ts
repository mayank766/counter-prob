import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface DeadlineResponse {
  secondsLeft: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeadlineApiService {
  readonly #http = inject(HttpClient);

  getSecondsLeft(): Observable<number> {
    return this.#http
      .get<DeadlineResponse>('/api/deadline')
      .pipe(map((response) => response.secondsLeft));
  }
}
