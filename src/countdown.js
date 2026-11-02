export const DEADLINE = Date.parse('2026-11-01T23:59:59-05:00')
export const DECISIONS = Date.parse('2026-12-16T18:28:00-05:00')
export function countdownState(now) {
  const remaining = DEADLINE - now
  const decisions = remaining <= 0
  const total = Math.max(0, Math.ceil(((decisions ? DECISIONS : DEADLINE) - now) / 1000))
  const stage = decisions ? (total === 0 ? 'released' : 'decisions') : remaining <= 10000 ? 'ten' : remaining <= 60000 ? 'minute' : remaining <= 600000 ? 'ten-minutes' : remaining <= 3600000 ? 'hour' : 'approach'
  return { now, remaining, decisions, total, stage, units: [Math.floor(total / 86400), Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60] }
}
