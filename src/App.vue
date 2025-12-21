<template>
  <div class="min-h-screen relative overflow-hidden">
    <div class="particle-background"></div>
    
    <div class="ambient-glow top-20 left-10"></div>
    <div class="ambient-glow bottom-20 right-10 delay-2"></div>
    <div class="ambient-glow top-1/2 left-1/2 delay-4"></div>

    <div class="max-w-7xl mx-auto px-4 py-12 relative z-10">
      <header class="text-center mb-20 animate-fade-in">
        <div class="inline-block mb-8">
          <div class="text-9xl font-extralight text-white tracking-tighter leading-none mb-3 gradient-text">
            MIT
          </div>
          <div class="h-0.5 bg-gradient-to-r from-transparent via-mit-red to-transparent glow-line"></div>
        </div>
        <h1 class="text-3xl md:text-4xl font-light text-gray-300 mb-3 tracking-wide">
          Early Action · Class of 2031
        </h1>
        <p class="text-sm text-gray-500 uppercase tracking-[0.2em]">
          Application Deadline Countdown
        </p>
      </header>

      <div class="glass-card rounded-3xl p-12 md:p-16 mb-8 hover-lift">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div v-for="unit in timeUnits" :key="unit.label" class="text-center group">
            <div class="relative mb-6">
              <div class="countdown-number">
                {{ unit.value.toString().padStart(2, '0') }}
              </div>
              <div class="countdown-underline"></div>
            </div>
            <div class="text-xs md:text-sm text-gray-500 uppercase tracking-[0.15em] font-medium">
              {{ unit.label }}
            </div>
          </div>
        </div>
        
        <div class="pt-8 border-t border-glass-border">
          <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm">
            <div class="flex items-center gap-3">
              <div class="pulse-dot"></div>
              <span class="text-gray-400">Deadline:</span>
              <span class="text-white font-medium">November 1, 2026 · 11:59 PM EST</span>
            </div>
            <div class="hidden md:block w-px h-5 bg-glass-border"></div>
            <div class="flex items-center gap-3">
              <span class="text-gray-500">Decisions:</span>
              <span class="text-gray-400">Mid-December 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="glass-card-subtle rounded-2xl p-6 hover-lift-subtle">
          <div class="text-3xl font-light text-mit-red mb-2">4.5%</div>
          <div class="text-sm text-gray-400">Acceptance Rate</div>
          <div class="text-xs text-gray-600 mt-1">Class of 2029</div>
        </div>
        <div class="glass-card-subtle rounded-2xl p-6 hover-lift-subtle">
          <div class="text-3xl font-light text-white mb-2">1,324</div>
          <div class="text-sm text-gray-400">Students Admitted</div>
          <div class="text-xs text-gray-600 mt-1">Out of 29,282</div>
        </div>
        <div class="glass-card-subtle rounded-2xl p-6 hover-lift-subtle">
          <div class="text-3xl font-light text-white mb-2">Non-Binding</div>
          <div class="text-sm text-gray-400">Early Action</div>
          <div class="text-xs text-gray-600 mt-1">Apply elsewhere too</div>
        </div>
      </div>

      <div class="glass-card rounded-3xl p-10 md:p-12 mb-8">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-3xl font-light text-white tracking-wide">
            Application Checklist
          </h2>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">Progress</span>
            <div class="text-2xl font-light text-white tabular-nums">
              <span class="text-mit-red">{{ completedItems }}</span>
              <span class="text-gray-700 mx-1.5">/</span>
              <span class="text-gray-400">{{ checklistItems.length }}</span>
            </div>
          </div>
        </div>

        <div class="relative h-2 bg-gray-900/50 rounded-full mb-12 overflow-hidden backdrop-blur">
          <div 
            class="progress-bar"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>

        <div class="space-y-3">
          <div 
            v-for="(item, index) in checklistItems" 
            :key="index"
            class="checklist-item"
            :class="{ 'completed': item.completed }"
            @click="toggleItem(index)"
          >
            <div class="flex items-start gap-5">
              <div class="flex-shrink-0 mt-1">
                <div class="custom-checkbox" :class="{ 'checked': item.completed }">
                  <svg 
                    v-if="item.completed" 
                    class="w-5 h-5 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    stroke-width="3"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="checklist-title" :class="{ 'line-through text-gray-600': item.completed }">
                  {{ item.title }}
                </h3>
                <p class="text-sm text-gray-500 leading-relaxed mb-2">
                  {{ item.description }}
                </p>
                <div v-if="item.deadline" class="flex items-center gap-2 text-xs text-gray-600">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                  <span class="uppercase tracking-wide">{{ item.deadline }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-10 border-t border-glass-border">
          <h3 class="text-xl font-light text-white mb-6 tracking-wide">Strategic Tips</h3>
          <div class="grid md:grid-cols-2 gap-5">
            <div class="tip-card">
              <div class="tip-accent"></div>
              <p class="text-sm text-gray-400 leading-relaxed">Start essays 6-8 weeks early. MIT values authenticity over perfection.</p>
            </div>
            <div class="tip-card">
              <div class="tip-accent"></div>
              <p class="text-sm text-gray-400 leading-relaxed">Request recommendations in early September. Give recommenders ample time.</p>
            </div>
            <div class="tip-card">
              <div class="tip-accent"></div>
              <p class="text-sm text-gray-400 leading-relaxed">Showcase hands-on projects. MIT seeks builders, makers, and problem-solvers.</p>
            </div>
            <div class="tip-card">
              <div class="tip-accent"></div>
              <p class="text-sm text-gray-400 leading-relaxed">Be specific and genuine. Generic responses won't stand out in this pool.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const checklistItems = ref([
  {
    title: 'Create MyMIT Account',
    description: 'Register on MIT\'s application portal (MyMIT) to start your application',
    deadline: 'ASAP',
    completed: false
  },
  {
    title: 'Complete MIT Application Profile',
    description: 'Fill out your basic information, activities, coursework, and honors on the MIT application',
    deadline: 'October 15, 2026',
    completed: false
  },
  {
    title: 'Take Required SAT or ACT',
    description: 'MIT requires standardized test scores. Submit your strongest SAT or ACT scores.',
    deadline: 'October 1, 2026',
    completed: false
  },
  {
    title: 'Write MIT Application Essays',
    description: 'Complete all MIT-specific essays and short answer questions (5 short answers required)',
    deadline: 'October 20, 2026',
    completed: false
  },
  {
    title: 'Request Teacher Recommendations (2)',
    description: 'One from math/science teacher, one from humanities/social science/language teacher',
    deadline: 'September 1, 2026',
    completed: false
  },
  {
    title: 'Request School Counselor Recommendation',
    description: 'Ask your school counselor for a letter of recommendation and school report',
    deadline: 'September 1, 2026',
    completed: false
  },
  {
    title: 'List Activities & Honors',
    description: 'Detail your extracurriculars, leadership roles, awards, and achievements',
    deadline: 'October 20, 2026',
    completed: false
  },
  {
    title: 'Complete Self-Reported Coursework',
    description: 'Enter all your high school courses and grades in the MIT application',
    deadline: 'October 25, 2026',
    completed: false
  },
  {
    title: 'Prepare Maker Portfolio (Optional)',
    description: 'Submit work samples via SlideRoom for research, arts, or maker projects',
    deadline: 'October 28, 2026',
    completed: false
  },
  {
    title: 'Review & Proofread Everything',
    description: 'Check for typos, verify all sections are complete, review with fresh eyes',
    deadline: 'October 30, 2026',
    completed: false
  },
  {
    title: 'Submit Application Fee / Request Waiver',
    description: 'Pay $75 application fee or request fee waiver if eligible',
    deadline: 'November 1, 2026',
    completed: false
  },
  {
    title: 'Submit MIT Application',
    description: 'Final submission before 11:59 PM EST deadline via MyMIT portal',
    deadline: 'November 1, 2026',
    completed: false
  },
  {
    title: 'Await Interview Assignment',
    description: 'MIT will assign an Educational Counselor interview after you submit (no action needed)',
    deadline: 'Post-submission',
    completed: false
  },
  {
    title: 'Submit Mid-Year Grades (February)',
    description: 'Update MIT with your first semester senior year grades via February update form',
    deadline: 'Mid-February 2027',
    completed: false
  }
])

const targetDate = new Date('2026-11-01T23:59:59-05:00')
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const timeUnits = computed(() => [
  { label: 'Days', value: days.value },
  { label: 'Hours', value: hours.value },
  { label: 'Minutes', value: minutes.value },
  { label: 'Seconds', value: seconds.value }
])

const updateCountdown = () => {
  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance < 0) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    return
  }

  days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

let countdownInterval = null

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
  
  const savedChecklist = localStorage.getItem('mitChecklistState')
  if (savedChecklist) {
    try {
      const savedItems = JSON.parse(savedChecklist)
      checklistItems.value = savedItems
    } catch (e) {
      console.error('Error loading saved checklist:', e)
    }
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

const completedItems = computed(() => {
  return checklistItems.value.filter(item => item.completed).length
})

const progressPercentage = computed(() => {
  return (completedItems.value / checklistItems.value.length) * 100
})

const toggleItem = (index) => {
  checklistItems.value[index].completed = !checklistItems.value[index].completed
  localStorage.setItem('mitChecklistState', JSON.stringify(checklistItems.value))
}
</script>
