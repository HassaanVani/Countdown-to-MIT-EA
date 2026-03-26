<template>
  <div class="min-h-screen relative" :class="{ 'overflow-hidden h-screen': mode !== 'full' }">
    <!-- Particle Canvas -->
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
    <!-- Aurora Background -->
    <div class="aurora-bg"></div>

    <!-- Mode Switcher -->
    <div class="mode-switcher">
      <button
        v-for="m in modes"
        :key="m.id"
        class="mode-btn"
        :class="{ active: mode === m.id }"
        @click="mode = m.id"
        :title="m.tooltip"
      >
        {{ m.label }}
      </button>
    </div>

    <!-- Fullscreen Toggle -->
    <button class="fullscreen-btn" @click="toggleFullscreen" :title="isFullscreen ? 'Exit fullscreen' : 'Go fullscreen'">
      <svg v-if="!isFullscreen" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
      </svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
      </svg>
    </button>

    <!-- ============ BACKGROUND MODE ============ -->
    <div v-if="mode === 'background'" class="bg-mode-overlay bg-mode">
      <div class="bg-title gradient-text">MIT</div>
      <div class="bg-date-label">Early Action · November 1, 2026</div>

      <div class="flex items-end gap-4 md:gap-6 mt-4">
        <div v-for="(unit, i) in timeUnits" :key="unit.label" class="countdown-digit-group">
          <div class="countdown-number" :class="{ tick: unit.ticked }">
            {{ unit.value.toString().padStart(2, '0') }}
          </div>
          <div class="countdown-label">{{ unit.label }}</div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-xs text-gray-600 italic">{{ currentQuote }}</p>
      </div>
    </div>

    <!-- ============ WIDGET MODE ============ -->
    <div
      v-if="mode === 'widget'"
      class="widget-container widget-mode"
      :style="widgetPosition"
      @mousedown="startDrag"
      @touchstart.prevent="startDrag"
    >
      <div class="widget-card" :class="{ dragging: isDragging }">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-lg font-light gradient-text tracking-wide">MIT</div>
            <div class="text-[0.6rem] text-gray-500 uppercase tracking-widest">Early Action 2026</div>
          </div>
          <div class="pulse-dot"></div>
        </div>

        <div class="flex items-end justify-between gap-3">
          <div v-for="unit in timeUnits" :key="unit.label" class="countdown-digit-group flex-1">
            <div class="countdown-number" :class="{ tick: unit.ticked }">
              {{ unit.value.toString().padStart(2, '0') }}
            </div>
            <div class="countdown-label">{{ unit.label }}</div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span class="text-[0.6rem] text-gray-600 uppercase tracking-wider">Nov 1 · 11:59 PM EST</span>
          <span class="text-[0.6rem] text-mit-red/60 uppercase tracking-wider">Class of 2031</span>
        </div>
      </div>
    </div>

    <!-- ============ FULL MODE ============ -->
    <div v-if="mode === 'full'" class="max-w-6xl mx-auto px-4 py-16 relative z-10">

      <!-- Header -->
      <header class="text-center mb-24 animate-fade-in">
        <div class="section-label mb-6">Application Deadline Countdown</div>
        <div class="inline-block mb-6">
          <div class="text-[8rem] md:text-[10rem] font-extralight leading-none gradient-text tracking-tighter">
            MIT
          </div>
          <div class="h-px bg-gradient-to-r from-transparent via-mit-red to-transparent glow-line mt-2"></div>
        </div>
        <h1 class="text-2xl md:text-3xl font-extralight text-gray-400 tracking-wide">
          Early Action · Class of 2031
        </h1>
      </header>

      <!-- Countdown -->
      <div class="glass-card rounded-3xl p-10 md:p-14 mb-10 animate-fade-up">
        <div class="flex items-end justify-center gap-4 md:gap-8 mb-10">
          <template v-for="(unit, i) in timeUnits" :key="unit.label">
            <div v-if="i > 0" class="countdown-separator">:</div>
            <div class="countdown-digit-group">
              <div class="countdown-number" :class="{ tick: unit.ticked }">
                {{ unit.value.toString().padStart(2, '0') }}
              </div>
              <div class="countdown-label">{{ unit.label }}</div>
            </div>
          </template>
        </div>

        <div class="pt-6 border-t border-white/5">
          <div class="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-sm">
            <div class="flex items-center gap-3">
              <div class="pulse-dot"></div>
              <span class="text-gray-500">Deadline</span>
              <span class="text-white font-light">November 1, 2026 · 11:59 PM EST</span>
            </div>
            <div class="hidden md:block w-px h-4 bg-white/10"></div>
            <div class="flex items-center gap-3">
              <span class="text-gray-600">Decisions</span>
              <span class="text-gray-400 font-light">Mid-December 2026</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid md:grid-cols-3 gap-4 mb-10">
        <div class="glass-card-subtle stat-card rounded-2xl p-6 animate-fade-up animate-fade-up-delay-1">
          <div class="section-label mb-3">Acceptance Rate</div>
          <div class="text-4xl font-extralight gradient-text-red mb-1">4.6%</div>
          <div class="text-xs text-gray-600">Class of 2030 · Overall</div>
        </div>
        <div class="glass-card-subtle stat-card rounded-2xl p-6 animate-fade-up animate-fade-up-delay-2">
          <div class="section-label mb-3">Students Admitted</div>
          <div class="text-4xl font-extralight text-white mb-1">1,299</div>
          <div class="text-xs text-gray-600">Out of 28,349 applicants</div>
        </div>
        <div class="glass-card-subtle stat-card rounded-2xl p-6 animate-fade-up animate-fade-up-delay-3">
          <div class="section-label mb-3">Early Action</div>
          <div class="text-4xl font-extralight text-white mb-1">Non-Binding</div>
          <div class="text-xs text-gray-600">Apply to other schools freely</div>
        </div>
      </div>

      <!-- Motivational Quote -->
      <div class="text-center mb-10 animate-fade-up animate-fade-up-delay-4">
        <p class="text-sm text-gray-500 italic font-light max-w-lg mx-auto leading-relaxed">
          "{{ currentQuote }}"
        </p>
      </div>

      <!-- Application Checklist -->
      <div class="glass-card rounded-3xl p-8 md:p-12 mb-10">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="section-label mb-2">Track Your Progress</div>
            <h2 class="text-2xl md:text-3xl font-extralight text-white tracking-wide">
              Application Checklist
            </h2>
          </div>
          <div class="text-right">
            <div class="text-3xl font-extralight text-white tabular-nums">
              <span class="gradient-text-red">{{ completedItems }}</span>
              <span class="text-gray-800 mx-1">/</span>
              <span class="text-gray-500">{{ checklistItems.length }}</span>
            </div>
            <div class="text-[0.6rem] text-gray-600 uppercase tracking-widest mt-1">completed</div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="relative h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden">
          <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        </div>

        <!-- Checklist Items -->
        <div class="space-y-2">
          <div
            v-for="(item, index) in checklistItems"
            :key="index"
            class="checklist-item"
            :class="{ completed: item.completed }"
            @click="toggleItem(index)"
          >
            <div class="flex items-start gap-4 relative z-10">
              <div class="mt-0.5">
                <div class="custom-checkbox" :class="{ checked: item.completed }">
                  <svg
                    v-if="item.completed"
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="3"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="checklist-title" :class="{ 'line-through text-gray-600': item.completed }">
                  {{ item.title }}
                </h3>
                <p class="text-xs text-gray-500 leading-relaxed">{{ item.description }}</p>
              </div>
              <div v-if="item.deadline" class="flex-shrink-0 hidden sm:block">
                <span class="text-[0.6rem] text-gray-600 uppercase tracking-wider bg-white/[0.03] px-2.5 py-1 rounded-md">
                  {{ item.deadline }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="mt-10 pt-8 border-t border-white/5">
          <div class="section-label mb-5">Strategic Tips</div>
          <div class="grid md:grid-cols-2 gap-3">
            <div v-for="tip in tips" :key="tip" class="tip-card">
              <div class="tip-accent"></div>
              <p class="text-xs text-gray-400 leading-relaxed">{{ tip }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="text-center py-8">
        <p class="text-[0.6rem] text-gray-700 uppercase tracking-[0.2em]">
          Good luck with your application
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// ===== View Mode =====
const modes = [
  { id: 'full', label: 'Full', tooltip: 'Full dashboard view' },
  { id: 'widget', label: 'Widget', tooltip: 'Compact floating widget' },
  { id: 'background', label: 'Background', tooltip: 'Ambient background mode' },
]
const mode = ref(localStorage.getItem('mitViewMode') || 'full')
watch(mode, (v) => localStorage.setItem('mitViewMode', v))

// ===== Fullscreen =====
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
  } else {
    document.exitFullscreen().catch(() => {})
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// ===== Quotes =====
const quotes = [
  'The only way to do great work is to love what you do.',
  'It always seems impossible until it\'s done.',
  'Dream big. Start small. Act now.',
  'Your future is created by what you do today.',
  'Be so good they can\'t ignore you.',
  'The best time to plant a tree was 20 years ago. The second best time is now.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  'Believe you can and you\'re halfway there.',
]
const quoteIndex = ref(Math.floor(Math.random() * quotes.length))
const currentQuote = computed(() => quotes[quoteIndex.value])

// ===== Countdown =====
const targetDate = new Date('2026-11-01T23:59:59-05:00')
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const prevSeconds = ref(-1)
const prevMinutes = ref(-1)
const prevHours = ref(-1)
const prevDays = ref(-1)

const timeUnits = computed(() => [
  { label: 'Days', value: days.value, ticked: days.value !== prevDays.value },
  { label: 'Hours', value: hours.value, ticked: hours.value !== prevHours.value },
  { label: 'Minutes', value: minutes.value, ticked: minutes.value !== prevMinutes.value },
  { label: 'Seconds', value: seconds.value, ticked: seconds.value !== prevSeconds.value },
])

const updateCountdown = () => {
  prevDays.value = days.value
  prevHours.value = hours.value
  prevMinutes.value = minutes.value
  prevSeconds.value = seconds.value

  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance < 0) {
    days.value = hours.value = minutes.value = seconds.value = 0
    return
  }

  days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

// ===== Checklist =====
const checklistItems = ref([
  {
    title: 'Create MyMIT Account',
    description: 'Register on MIT\'s application portal (MyMIT) to start your application',
    deadline: 'ASAP',
    completed: false,
  },
  {
    title: 'Complete MIT Application Profile',
    description: 'Fill out your basic information, activities, coursework, and honors on the MIT application',
    deadline: 'Oct 15, 2026',
    completed: false,
  },
  {
    title: 'Take Required SAT or ACT',
    description: 'MIT requires standardized test scores. Submit your strongest SAT or ACT scores.',
    deadline: 'Oct 1, 2026',
    completed: false,
  },
  {
    title: 'Write MIT Application Essays',
    description: 'Complete all MIT-specific essays and short answer questions (5 short answers required)',
    deadline: 'Oct 20, 2026',
    completed: false,
  },
  {
    title: 'Request Teacher Recommendations (2)',
    description: 'One from math/science teacher, one from humanities/social science/language teacher',
    deadline: 'Sep 1, 2026',
    completed: false,
  },
  {
    title: 'Request School Counselor Recommendation',
    description: 'Ask your school counselor for a letter of recommendation and school report',
    deadline: 'Sep 1, 2026',
    completed: false,
  },
  {
    title: 'List Activities & Honors',
    description: 'Detail your extracurriculars, leadership roles, awards, and achievements',
    deadline: 'Oct 20, 2026',
    completed: false,
  },
  {
    title: 'Complete Self-Reported Coursework',
    description: 'Enter all your high school courses and grades in the MIT application',
    deadline: 'Oct 25, 2026',
    completed: false,
  },
  {
    title: 'Prepare Maker Portfolio (Optional)',
    description: 'Submit work samples via SlideRoom for research, arts, or maker projects',
    deadline: 'Oct 28, 2026',
    completed: false,
  },
  {
    title: 'Review & Proofread Everything',
    description: 'Check for typos, verify all sections are complete, review with fresh eyes',
    deadline: 'Oct 30, 2026',
    completed: false,
  },
  {
    title: 'Submit Application Fee / Request Waiver',
    description: 'Pay $75 application fee or request fee waiver if eligible',
    deadline: 'Nov 1, 2026',
    completed: false,
  },
  {
    title: 'Submit MIT Application',
    description: 'Final submission before 11:59 PM EST deadline via MyMIT portal',
    deadline: 'Nov 1, 2026',
    completed: false,
  },
  {
    title: 'Await Interview Assignment',
    description: 'MIT will assign an Educational Counselor interview after you submit (no action needed)',
    deadline: 'Post-submission',
    completed: false,
  },
  {
    title: 'Submit Mid-Year Grades (February)',
    description: 'Update MIT with your first semester senior year grades via February update form',
    deadline: 'Mid-Feb 2027',
    completed: false,
  },
])

const tips = [
  'Start essays 6–8 weeks early. MIT values authenticity over perfection.',
  'Request recommendations in early September. Give recommenders ample time.',
  'Showcase hands-on projects. MIT seeks builders, makers, and problem-solvers.',
  'Be specific and genuine. Generic responses won\'t stand out in this pool.',
]

const completedItems = computed(() => checklistItems.value.filter((item) => item.completed).length)
const progressPercentage = computed(() => (completedItems.value / checklistItems.value.length) * 100)

const toggleItem = (index) => {
  checklistItems.value[index].completed = !checklistItems.value[index].completed
  localStorage.setItem('mitChecklistState', JSON.stringify(checklistItems.value))
}

// ===== Widget Dragging =====
const isDragging = ref(false)
const widgetX = ref(null)
const widgetY = ref(null)
let dragOffsetX = 0
let dragOffsetY = 0

const widgetPosition = computed(() => {
  if (widgetX.value === null) return {}
  return {
    left: widgetX.value + 'px',
    top: widgetY.value + 'px',
    right: 'auto',
    bottom: 'auto',
  }
})

const startDrag = (e) => {
  isDragging.value = true
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()

  if (widgetX.value === null) {
    widgetX.value = rect.left
    widgetY.value = rect.top
  }

  dragOffsetX = clientX - widgetX.value
  dragOffsetY = clientY - widgetY.value

  const onMove = (ev) => {
    const cx = ev.touches ? ev.touches[0].clientX : ev.clientX
    const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
    widgetX.value = Math.max(0, Math.min(window.innerWidth - 100, cx - dragOffsetX))
    widgetY.value = Math.max(0, Math.min(window.innerHeight - 60, cy - dragOffsetY))
  }

  const onEnd = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove, { passive: false })
  document.addEventListener('touchend', onEnd)
}

// ===== Particle Canvas =====
const canvasRef = ref(null)
let animationFrame = null

const initParticles = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  let w, h
  const particles = []
  const particleCount = 60

  const resize = () => {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.3 + 0.05,
    })
  }

  const draw = () => {
    ctx.clearRect(0, 0, w, h)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(163, 31, 52, ${p.alpha})`
      ctx.fill()

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(163, 31, 52, ${0.03 * (1 - dist / 150)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animationFrame = requestAnimationFrame(draw)
  }
  draw()
}

// ===== Lifecycle =====
let countdownInterval = null
let quoteInterval = null

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
  quoteInterval = setInterval(() => {
    quoteIndex.value = (quoteIndex.value + 1) % quotes.length
  }, 12000)

  const savedChecklist = localStorage.getItem('mitChecklistState')
  if (savedChecklist) {
    try {
      const saved = JSON.parse(savedChecklist)
      if (Array.isArray(saved) && saved.length === checklistItems.value.length) {
        checklistItems.value = saved
      }
    } catch (e) {
      console.error('Error loading saved checklist:', e)
    }
  }

  document.addEventListener('fullscreenchange', onFullscreenChange)

  nextTick(() => initParticles())
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (quoteInterval) clearInterval(quoteInterval)
  if (animationFrame) cancelAnimationFrame(animationFrame)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>
