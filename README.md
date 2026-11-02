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

## Deadline sequence

The countdown targets November 1, 2026 at 11:59:59 PM EST. Checkpoints activate at one hour, ten minutes, one minute, and ten seconds. The final minute takes over every view mode. At the deadline, an eight-second transition leads into the estimated decisions countdown (December 16, 2026 at 6:28 PM EST, based on MIT's 2025 announcement). Passing the deadline does not imply successful submission.

Run `npm run dev` to view locally. Add `?preview=75` to the local URL to rehearse the final 75 seconds, transition, and decisions screen. Use `?preview=3610` or `?preview=610` for the hour and ten-minute checkpoints. Preview time is isolated from the real timer and clearly labeled; exit preview to restore the real clock.

The decision date is an estimate, not a confirmed MIT announcement. Dates and phase boundaries live in `src/countdown.js`.
