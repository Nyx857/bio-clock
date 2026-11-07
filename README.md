# BioClock

A minimalist paper-toned PWA that turns your actual work start time into a personal **biological clock**. Set your shift start once; the clock shows the equivalent time where 08:00 is your biological morning.

No backend, no tracking, no account. The shift is stored only in your browser.

**Version:** v1.2

## Why

Shift workers often think in two timelines: the real clock and the body's own morning. BioClock makes the second one glanceable, with one large number and nothing else competing for attention.

## Features

- A one-time intro, then a one-time shift setup, then a single quiet clock
- 16:20 shift start maps to 08:00 biological morning by default
- Installable PWA; works offline after the first load
- Responsive paper-and-serif design that matches the macOS companion app
- Local-only data: no network requests, analytics, or cookies
- Full-bleed paper icon for iPhone home screen

## Run locally

```bash
python3 -m http.server 8787
```

Open `http://localhost:8787/`.

## iPhone

### Add to Home Screen

Open the site in Safari, tap **Share**, then **Add to Home Screen**. The app opens standalone with the paper icon.

### Home Screen widget

iOS does not allow a web app to publish a WidgetKit widget. The included `widget/BioClock.js` is a native-clock-style Scriptable widget: a clean paper face and a large minute-precision time, with no label, seconds or perimeter ticks.

1. Install **Scriptable** from the App Store.
2. Create a new script and paste `widget/BioClock.js`.
3. Add a Scriptable widget to the Home Screen.
4. Long-press it → Edit Widget → Parameter → `16:20` (your shift start).

The face is drawn with native text instead of a rasterised image, so it stays
centred at any widget size and redraws cheaply. iOS still owns the refresh
schedule (a third-party widget can never tick every minute); the script asks
for a reload just after each minute boundary, so a granted update is always the
current minute. To force a redraw now, run the script once in Scriptable, or
re-pick the widget after long-pressing it. Tapping the widget opens the PWA.

## Deploy

Static site, no build step. On Cloudflare Pages:

- Framework preset: None
- Build command: (empty)
- Build output directory: `/`
- Production branch: `main`

## Structure

```
index.html        UI, setup flow, clock logic, service-worker registration
manifest.json     PWA manifest
sw.js             Offline cache
icon-*.png        App icons
_headers          Cloudflare Pages cache policy
widget/BioClock.js  Optional iOS Scriptable home-screen widget
```
