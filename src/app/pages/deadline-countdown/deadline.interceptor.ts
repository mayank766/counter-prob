import { HttpResponse } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const deadlineMockInterceptor: HttpInterceptorFn = (req, next) => {
  // Mock the /api/deadline endpoint
  if (req.url === '/api/deadline' && req.method === 'GET') {
    const deadline = {
      secondsLeft: 120 // 2 minutes countdown for demo
    };

    return of(new HttpResponse({ status: 200, body: deadline })).pipe(
      delay(500) // Simulate network latency
    );
  }

  return next(req);
};
