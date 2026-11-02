<template>
  <section class="launch-stage" :class="[state.stage, { ceremony }]" aria-label="MIT countdown">
    <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
    <div class="launch-grid"></div>
    <div class="launch-content">
      <div v-if="preview" class="preview-banner">SEQUENCE PREVIEW · Real deadline unchanged <button @click="exitPreview">Exit preview</button></div>
      <p class="launch-eyebrow">MIT / EARLY ACTION / CLASS OF 2031</p>
      <Transition name="chapter" mode="out-in">
        <div :key="ceremony ? 'ceremony' : state.stage">
          <p class="launch-chapter">{{ ceremony ? 'A CHAPTER CLOSES. ANOTHER BEGINS.' : chapter }}</p>
          <h2>{{ ceremony ? 'The next chapter awaits.' : headline }}</h2>
          <p class="launch-subtitle">{{ ceremony ? 'The deadline has passed. Take a breath. Let the possibility unfold.' : subtitle }}</p>
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
      <p class="launch-date">{{ state.decisions ? 'DECEMBER 16, 2026 · 6:28 PM EST' : 'NOVEMBER 1, 2026 · 11:59 PM EST' }}</p>
      <p v-if="state.decisions" class="estimate-note">Estimated decision time, based on the 2025 release. Not yet confirmed by MIT.</p>
      <a class="launch-link" href="https://apply.mitadmissions.org/apply/" target="_blank" rel="noopener noreferrer">{{ state.decisions ? 'Open application portal ↗' : 'Review & submit your application ↗' }}</a>
      <p class="launch-note">{{ state.decisions ? 'The deadline passing does not confirm that your application was submitted. Check your portal.' : 'Make this moment count. Submit before the clock runs out.' }}</p>
    </div>
  </section>
</template>
<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { countdownState, DEADLINE } from './countdown.js'
const props = defineProps({ state: { type: Object, required: true } })
const previewSeconds = Number(new URLSearchParams(window.location.search).get('preview'))
const preview = Number.isFinite(previewSeconds) && previewSeconds > 0 && previewSeconds <= 7200
const previewStarted = Date.now()
const state = computed(() => preview ? countdownState(DEADLINE - previewSeconds * 1000 + (props.state.now - previewStarted)) : props.state)
const exitPreview = () => { const url = new URL(window.location.href); url.searchParams.delete('preview'); window.location.assign(url.href) }
const ceremony = ref(false)
let ceremonyTimer
watch(() => state.value.decisions, (next, previous) => {
  if (next && previous === false) {
    ceremony.value = true
    ceremonyTimer = setTimeout(() => { ceremony.value = false }, 8500)
  }
})
onUnmounted(() => clearTimeout(ceremonyTimer))
const finalMinute = computed(() => !state.value.decisions && state.value.total <= 60)
const checkpoints = [{ label: '01 HOUR', at: 3600000 }, { label: '10 MINUTES', at: 600000 }, { label: '01 MINUTE', at: 60000 }, { label: '10 SECONDS', at: 10000 }]
const chapter = computed(() => ({ approach: 'THE FINAL APPROACH', hour: 'CHECKPOINT 01 / THE FINAL HOUR', 'ten-minutes': 'CHECKPOINT 02 / TEN MINUTES REMAIN', minute: 'CHECKPOINT 03 / THE FINAL MINUTE', ten: 'CHECKPOINT 04 / THIS IS THE MOMENT', decisions: 'THE NEXT CHAPTER / DECISION COUNTDOWN', released: 'THE ESTIMATED RELEASE TIME HAS ARRIVED' }[state.value.stage]))
const headline = computed(() => ({ approach: 'One deadline. Infinite possibility.', hour: 'One hour. All you’ve worked for.', 'ten-minutes': 'The final stretch.', minute: 'Every second matters.', ten: 'Here we go.', decisions: 'Let possibility unfold.', released: 'Check your application portal.' }[state.value.stage]))
const subtitle = computed(() => ({ approach: 'Your next chapter begins with a single step.', hour: 'One final review. Every detail. Then take the leap.', 'ten-minutes': 'Check your application and submit. This is your moment.', minute: 'Finish your submission now. The deadline is almost here.', ten: 'The final seconds of this chapter.', decisions: 'The application deadline has passed. Now, the wait for what comes next.', released: 'This is an estimated date. MIT’s announcement is the source of truth.' }[state.value.stage]))
</script>
