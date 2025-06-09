<template>
  <button
    @click="$emit('click')"
    class="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105"
    :class="buttonClass"
  >
    <!-- Animated background -->
    <div class="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
    
    <div class="relative flex flex-col items-center gap-2">
      <div 
        class="w-10 h-10 rounded-full flex items-center justify-center"
        :class="iconClass"
      >
        <component :is="iconComponent" class="w-6 h-6 text-white" />
      </div>
      <span class="text-sm font-medium text-white">{{ label }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  CogIcon, 
  DocumentTextIcon, 
  AdjustmentsHorizontalIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/vue/24/solid'

const props = defineProps<{
  label: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray' | 'twitch' | 'youtube'
}>()

defineEmits<{
  click: []
}>()

const iconComponent = computed(() => {
  const icons = {
    cog: CogIcon,
    'document-text': DocumentTextIcon,
    adjustments: AdjustmentsHorizontalIcon,
    play: PlayIcon,
    stop: StopIcon
  }
  return icons[props.icon as keyof typeof icons] || CogIcon
})

const buttonClass = computed(() => {
  const classes = {
    blue: 'bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30',
    green: 'bg-green-600/20 border border-green-500/30 hover:bg-green-600/30',
    purple: 'bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30',
    red: 'bg-red-600/20 border border-red-500/30 hover:bg-red-600/30',
    yellow: 'bg-yellow-600/20 border border-yellow-500/30 hover:bg-yellow-600/30',
    gray: 'bg-gray-600/20 border border-gray-500/30 hover:bg-gray-600/30',
    twitch: 'bg-twitch-600/20 border border-twitch-500/30 hover:bg-twitch-600/30',
    youtube: 'bg-youtube-600/20 border border-youtube-500/30 hover:bg-youtube-600/30'
  }
  return classes[props.color]
})

const iconClass = computed(() => {
  const classes = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
    twitch: 'bg-twitch-500',
    youtube: 'bg-youtube-500'
  }
  return classes[props.color]
})
</script>