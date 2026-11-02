# Countdown-to-MIT-EA

## Project description

Small countdown web application for the MIT EA milestone.

## Architecture

`src/App.vue` owns the countdown UI; `main.js` bootstraps Vue; styles and Vite configuration support the deployable static app.

## Technology

Vue • JavaScript • Vite • Tailwind

## Run locally

`npm install && npm run dev`

## Repository guide

The implementation is organized so that entry points remain thin and domain-specific logic stays in the modules named above. Configuration, assets, and deployment files are kept separate from application code. Review the source tree before changing behavior, and keep secrets in local environment files rather than committing them.
## Live demo

`https://countdowntomit.netlify.app`

## Recurring admissions calendar

The app automatically follows each cycle in chronological order:

1. Early Action deadline: November 1.
2. EA decisions: estimated December 16, 6:28 PM Eastern.
3. Regular Action deadline: January 4 of the following year.
4. RA decisions: estimated March 14, 6:28 PM Eastern.
5. Enrollment decision day: May 1.
6. Waitlist planning checkpoint: estimated May 15 at noon Eastern, not a guaranteed release.
7. Seven-day app grace period, followed by next year's EA deadline countdown.

MIT does not guarantee waitlist news on May 15 or closure by the end of the app grace period. All decision estimates are labeled, with official sources beside the timer. Verify deadlines and exact submission times in the portal. Future annual dates follow current published patterns until updated.

`src/countdown.js` owns the calendar. `CYCLE_OVERRIDES[fallYear][eventId]` can replace an event's timestamp (`at`), estimate flag, note, and source when MIT announces dates. Times are interpreted in America/New_York with daylight-saving handling. The class year and timeline advance automatically. Checklist completion is stored by cycle year, with original 2026 checklist data migrated on load.

Both EA and RA deadlines use the one-hour, ten-minute, final-minute, and ten-second escalation. Every milestone transition gets the chapter ceremony.

Run `npm run dev` locally. Add `?preview=75` to rehearse the original EA finale and the transition. Preview uses the active cycle’s EA deadline and is isolated from the real timer. Use `?preview=3610` or `?preview=610` for earlier checkpoints.

Run `npm test` for milestone boundaries, annual rollover, grace duration, DST, checkpoints, and date overrides. Run `npm run build` for the production build.

The annual reset is perpetual: dates are generated from the current Eastern calendar year, with no final configured year or manual reset. Reopening the app after missed cycles immediately selects the current one. Boundary tests cover 2026–2125.
