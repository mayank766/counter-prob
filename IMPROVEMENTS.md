# Countdown App Improvements

- **Modern RxJS patterns** - I initially used interval() with manual decrement logic (remaining--) and a separate Subject to stop the timer. I simplified this by switching to timer(0, 1000) with map() + takeWhile(), which made the countdown flow more declarative and removed manual cleanup logic.

-**Handle API Edge case** - I added validation for unexpected API responses (like null, negative, or invalid values) before starting the countdown, so the component fails gracefully instead of running with bad data.