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
