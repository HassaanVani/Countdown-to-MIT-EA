// Recurring planning dates. Update yearly overrides when MIT announces exact dates.
const source = 'https://mitadmissions.org/apply/firstyear/deadlines-requirements/'
export const CYCLE_OVERRIDES = {}
// Interpret each wall-clock time in New York, including years when November 1 is still EDT.
const stamp = (year, suffix) => {
  const wall = Date.parse(`${year}-${suffix.slice(0, 14)}Z`)
  let result = wall
  for (let i = 0; i < 2; i++) {
    const zone = new Intl.DateTimeFormat('en', { timeZone: 'America/New_York', timeZoneName: 'shortOffset' }).formatToParts(result).find(p => p.type === 'timeZoneName').value
    const [, sign, hours, minutes = '0'] = zone.match(/GMT([+-])(\d+)(?::(\d+))?/)
    const offset = (Number(hours) * 60 + Number(minutes)) * (sign === '+' ? 1 : -1)
    result = wall - offset * 60000
  }
  return result
}
export function cycleEvents(year) {
  const spring = year + 1
  const events = [
    { id: 'ea-deadline', label: 'Early Action deadline', at: stamp(year, '11-01T23:59:59-05:00'), applicationDeadline: true, note: 'November 1 planning deadline. Verify the applicable submission time in your portal.', source },
    { id: 'ea-results', label: 'Early Action decisions', at: stamp(year, '12-16T18:28:00-05:00'), estimated: true, note: 'Estimated from the December 16, 2025 release at 6:28 PM Eastern. Await MIT’s announcement.', source: 'https://mitadmissions.org/blogs/entry/mit-ea-decisions-2025/' },
    { id: 'rd-deadline', label: 'Regular Action deadline', at: stamp(spring, '01-04T23:59:59-05:00'), applicationDeadline: true, note: 'January 4 is the current published Regular Action deadline. Future cycles and exact submission times should be verified.', source },
    { id: 'rd-results', label: 'Regular Action decisions', at: stamp(spring, '03-14T18:28:00-04:00'), estimated: true, note: 'Estimated Pi Day release at 6:28 PM Eastern. The exact date and time require MIT’s announcement.', source: 'https://facts.mit.edu/fun-culture/' },
    { id: 'enrollment', label: 'Enrollment decision day', at: stamp(spring, '05-01T23:59:59-04:00'), note: 'May 1 is the published enrollment reply date. Check your offer for the exact time; waitlist confirmation is also due May 1.', source },
    { id: 'waitlist', label: 'Waitlist review checkpoint', at: stamp(spring, '05-15T12:00:00-04:00'), estimated: true, note: 'May 15 is a planning checkpoint, not a release date. MIT says no waitlist news until mid-May at the earliest; updates may continue later.', source: 'https://mitadmissions.org/pages/wait-list-faq/' },
  ].map(event => ({ ...event, ...(CYCLE_OVERRIDES[year]?.[event.id] || {}) }))
  events.push({ id: 'grace', label: 'A week to breathe', at: events.at(-1).at + 7 * 86400000, note: 'A seven-day app grace period after the waitlist planning checkpoint. This does not mean MIT’s waitlist has closed.', source: 'https://mitadmissions.org/pages/wait-list-faq/' })
  return events
}
export function countdownState(now) {
  const easternYear = Number(new Intl.DateTimeFormat('en', { timeZone: 'America/New_York', year: 'numeric' }).format(now))
  let cycleYear = easternYear - 1
  let events = cycleEvents(cycleYear)
  if (now >= events.at(-1).at) { cycleYear++; events = cycleEvents(cycleYear) }
  const event = events.find(item => now < item.at)
  const remaining = event.at - now
  const total = Math.max(0, Math.ceil(remaining / 1000))
  const applicationDeadline = !!event.applicationDeadline
  const stage = applicationDeadline ? remaining <= 10000 ? 'ten' : remaining <= 60000 ? 'minute' : remaining <= 600000 ? 'ten-minutes' : remaining <= 3600000 ? 'hour' : 'approach' : 'decisions'
  return { now, cycleYear, classYear: cycleYear + 5, events, event, remaining, decisions: !applicationDeadline, applicationDeadline, total, stage, units: [Math.floor(total / 86400), Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60] }
}
export function formatEventDate(at) {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(at)
}
