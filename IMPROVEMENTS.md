# Countdown App Improvements

- **Modern RxJS patterns** - I initially used interval() with manual decrement logic (remaining--) and a separate Subject to stop the timer. I simplified this by switching to timer(0, 1000) with map() + takeWhile(), which made the countdown flow more declarative and removed manual cleanup logic.