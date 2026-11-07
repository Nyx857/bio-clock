# BioClock

A minimalist paper-toned PWA that turns your actual work start time into a personal **biological clock**. Set your shift start once; the clock shows the equivalent time where 08:00 is your biological morning.

No backend, no tracking, no account. The shift is stored only in your browser.

**Version:** v1.1

## Why

Shift workers often think in two timelines: the real clock and the body's own morning. BioClock makes the second one glanceable, with one large number and nothing else competing for attention.

## Features

- A one-time intro, then a one-time shift setup, then a single quiet clock
- 16:20 shift start maps to 08:00 biological morning by default
- Installable PWA; works offline after the first load
- Responsive paper-and-serif design that matches the macOS companion app
- Local-only data: no network requests, analytics, or cookies

## Run locally

```bash
python3 -m http.server 8787
```

Open `http://localhost:8787/`.

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
```
