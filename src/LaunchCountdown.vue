<template>
  <section class="launch-stage" :class="[state.stage, { ceremony }]" aria-label="MIT countdown">
    <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
    <div class="launch-grid"></div>
    <div class="launch-content">
      <div v-if="preview" class="preview-banner">SEQUENCE PREVIEW · Real deadline unchanged <button @click="exitPreview">Exit preview</button></div>
      <p class="launch-eyebrow">MIT / ADMISSIONS CYCLE / CLASS OF {{ state.classYear }}</p>
      <Transition name="chapter" mode="out-in">
        <div :key="ceremony ? 'ceremony' : state.event.id + state.stage">
          <p class="launch-chapter">{{ ceremony ? 'A CHAPTER CLOSES. ANOTHER BEGINS.' : chapter }}</p>
          <h2>{{ ceremony ? 'The next chapter awaits.' : headline }}</h2>
          <p class="launch-subtitle">{{ ceremony ? 'Take a breath. The next milestone is ahead.' : subtitle }}</p>
        </div>
      </Transition>
      <div v-if="!ceremony" class="launch-clock" :class="{ 'solo-clock': finalMinute }" role="timer" aria-label="Time remaining">
        <template v-if="finalMinute">
          <div class="second-orbit" :style="{ '--sweep': Math.min(360, state.total / 60 * 360) + 'deg' }"></div>
          <span :key="state.total" class="hero-second">{{ state.total }}</span>
          <span class="solo-label">SECONDS TO DEADLINE</span>
        </template>
        <div v-else v-for="(value, i) in state.units" :key="i" class="launch-unit">
          <span>{{ String(value).padStart(2, '0') }}</span><small>{{ ['DAYS', 'HOURS', 'MINUTES', 'SECONDS'][i] }}</small>
        </div>
      </div>
      <div v-else class="chapter-star">✦</div>
      <div class="launch-checkpoints" v-if="!state.decisions">
        <span v-for="point in checkpoints" :key="point.label" :class="{ reached: state.remaining <= point.at }">{{ point.label }}</span>
      </div>
      <p class="launch-date">{{ formatEventDate(state.event.at) }}</p>
      <p class="estimate-note">{{ state.event.estimated ? "ESTIMATED · " : "" }}{{ state.event.note }} <a :href="state.event.source" target="_blank" rel="noopener noreferrer">MIT source ↗</a></p>
      <a class="launch-link" href="https://apply.mitadmissions.org/apply/" target="_blank" rel="noopener noreferrer">{{ state.decisions ? 'Open application portal ↗' : 'Review & submit your application ↗' }}</a>
      <p class="launch-note">{{ state.applicationDeadline ? 'Make this moment count. Submit before the clock runs out.' : 'Check your portal for your own status. The timer does not confirm submission, admission, or waitlist closure.' }}</p>
      <ol class="cycle-timeline" aria-label="Admissions cycle milestones">
        <li v-for="event in state.events" :key="event.id" :class="{ current: event.id === state.event.id, past: event.at <= state.now }" :aria-current="event.id === state.event.id ? 'step' : undefined">
          <span>{{ event.label }}</span><small>{{ formatEventDate(event.at) }}{{ event.estimated ? ' · Estimated' : '' }}</small>
        </li>
      </ol>
      <p class="launch-note">{{ state.cycleYear }}–{{ state.cycleYear + 1 }} cycle · Repeats every year · After the seven-day grace period, the next EA cycle begins automatically.</p>
    </div>
  </section>
</template>
<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { countdownState, cycleEvents, formatEventDate } from './countdown.js'
const props = defineProps({ state: { type: Object, required: true } })
const previewSeconds = Number(new URLSearchParams(window.location.search).get('preview'))
const preview = Number.isFinite(previewSeconds) && previewSeconds > 0 && previewSeconds <= 7200
const previewStarted = Date.now()
const previewDeadline = cycleEvents(countdownState(previewStarted).cycleYear)[0].at
const state = computed(() => preview ? countdownState(previewDeadline - previewSeconds * 1000 + (props.state.now - previewStarted)) : props.state)
const exitPreview = () => { const url = new URL(window.location.href); url.searchParams.delete('preview'); window.location.assign(url.href) }
const ceremony = ref(false)
let ceremonyTimer
watch(() => `${state.value.cycleYear}/${state.value.event.id}`, (next, previous) => {
  if (previous && next !== previous) {
    clearTimeout(ceremonyTimer)
    ceremony.value = true
    ceremonyTimer = setTimeout(() => { ceremony.value = false }, 8500)
  }
})
onUnmounted(() => clearTimeout(ceremonyTimer))
const finalMinute = computed(() => !state.value.decisions && state.value.total <= 60)
const checkpoints = [{ label: '01 HOUR', at: 3600000 }, { label: '10 MINUTES', at: 600000 }, { label: '01 MINUTE', at: 60000 }, { label: '10 SECONDS', at: 10000 }]
const chapter = computed(() => state.value.decisions ? state.value.event.label.toUpperCase() : ({ approach: 'THE FINAL APPROACH', hour: 'CHECKPOINT 01 / THE FINAL HOUR', 'ten-minutes': 'CHECKPOINT 02 / TEN MINUTES REMAIN', minute: 'CHECKPOINT 03 / THE FINAL MINUTE', ten: 'CHECKPOINT 04 / THIS IS THE MOMENT', decisions: 'THE NEXT CHAPTER / DECISION COUNTDOWN', released: 'THE ESTIMATED RELEASE TIME HAS ARRIVED' }[state.value.stage]))
const headline = computed(() => state.value.decisions ? ({ 'ea-results': 'Let possibility unfold.', 'rd-results': 'Your next chapter awaits.', enrollment: 'Choose your next chapter.', waitlist: 'Possibility is still ahead.', grace: 'A week to breathe.' }[state.value.event.id]) : ({ approach: 'One deadline. Infinite possibility.', hour: 'One hour. All you’ve worked for.', 'ten-minutes': 'The final stretch.', minute: 'Every second matters.', ten: 'Here we go.', decisions: 'Let possibility unfold.', released: 'Check your application portal.' }[state.value.stage]))
const subtitle = computed(() => state.value.decisions ? ({ 'ea-results': 'The wait for Early Action decisions.', 'rd-results': 'Counting down to the estimated Regular Action release.', enrollment: 'Review your offers and reply by the enrollment deadline.', waitlist: 'An estimated mid-May checkpoint. Waitlist updates do not have a guaranteed release date.', grace: 'Take a breath before the next admissions cycle begins. Waitlist updates may still continue.' }[state.value.event.id]) : ({ approach: 'Your next chapter begins with a single step.', hour: 'One final review. Every detail. Then take the leap.', 'ten-minutes': 'Check your application and submit. This is your moment.', minute: 'Finish your submission now. The deadline is almost here.', ten: 'The final seconds of this chapter.', decisions: 'The application deadline has passed. Now, the wait for what comes next.', released: 'This is an estimated date. MIT’s announcement is the source of truth.' }[state.value.stage]))
</script>
