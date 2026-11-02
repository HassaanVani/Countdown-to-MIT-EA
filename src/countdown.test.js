import test from 'node:test'
import assert from 'node:assert/strict'
import { countdownState, cycleEvents, CYCLE_OVERRIDES } from './countdown.js'

test('every milestone advances exactly at its boundary across ten cycles', () => {
  for (let year = 2026; year < 2036; year++) {
    const events = cycleEvents(year)
    events.forEach((event, index) => {
      const before = countdownState(event.at - 1)
      assert.equal(before.event.id, event.id)
      assert.equal(before.cycleYear, year)
      assert.equal(before.total, 1)
      const after = countdownState(event.at)
      assert.equal(after.event.id, events[index + 1]?.id || 'ea-deadline')
      assert.equal(after.cycleYear, year + Number(index === events.length - 1))
      assert.ok(after.total > 0)
    })
    assert.equal(events.at(-1).at - events.at(-2).at, 7 * 86400000)
  }
})
test('both application deadlines retain the four escalation checkpoints', () => {
  for (const event of cycleEvents(2026).filter(e => e.applicationDeadline)) {
    for (const [ms, stage] of [[3600001, 'approach'], [3600000, 'hour'], [600000, 'ten-minutes'], [60000, 'minute'], [10000, 'ten'], [1, 'ten']]) {
      assert.equal(countdownState(event.at - ms).stage, stage)
    }
  }
})
test('New York dates follow DST instead of a fixed November UTC offset', () => {
  assert.equal(new Date(cycleEvents(2026)[0].at).toISOString(), '2026-11-02T04:59:59.000Z')
  assert.equal(new Date(cycleEvents(2027)[0].at).toISOString(), '2027-11-02T03:59:59.000Z')
  assert.equal(new Date(cycleEvents(2026)[3].at).toISOString(), '2027-03-14T22:28:00.000Z')
})
test('announced dates can override estimates and move the grace period', () => {
  const at = Date.parse('2027-05-20T16:00:00Z')
  CYCLE_OVERRIDES[2026] = { waitlist: { at, estimated: false } }
  try {
    const events = cycleEvents(2026)
    assert.equal(events[5].at, at)
    assert.equal(events[6].at, at + 7 * 86400000)
  } finally { delete CYCLE_OVERRIDES[2026] }
})
