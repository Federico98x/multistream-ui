<template>
  <div
    @click="$emit('toggle', platform.id)"
    class="relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer"
    :class="[
      selected 
        ? 'border-blue-500 bg-blue-500/20' 
        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500',
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
  >
    <!-- Background gradient -->
    <div 
      v-if="selected"
      class="absolute inset-0 opacity-10"
      :class="gradientClass"
    ></div>

    <div class="relative p-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- Platform Icon -->
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center text-white"
          :class="platform.id === 'twitch' ? 'bg-twitch-500' : 'bg-youtube-500'"
        >
          <TwitchIcon v-if="platform.id === 'twitch'" class="w-8 h-8" />
          <YouTubeIcon v-else class="w-8 h-8" />
        </div>

        <!-- Platform Info -->
        <div>
          <h4 class="text-lg font-medium text-white">{{ platform.name }}</h4>
          <p class="text-sm text-gray-400">
            {{ platform.configured ? 'Configured' : 'Not configured' }}
          </p>
        </div>
      </div>

      <!-- Selection Indicator -->
      <div 
        class="w-6 h-6 rounded-full border-2 transition-all duration-300"
        :class="selected ? 'border-blue-500 bg-blue-500' : 'border-gray-500'"
      >
        <CheckIcon v-if="selected" class="w-full h-full text-white p-0.5" />
      </div>
    </div>

    <!-- Active Indicator -->
    <div 
      v-if="isActive"
      class="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
import TwitchIcon from '../ui/icons/TwitchIcon.vue'
import YouTubeIcon from '../ui/icons/YouTubeIcon.vue'
import { useStreamStore } from '@/stores/stream'
import type { Platform } from '@/types'

const props = defineProps<{
  platform: Platform
  selected: boolean
  disabled: boolean
}>()

defineEmits<{
  toggle: [platformId: string]
}>()

const streamStore = useStreamStore()

const isActive = computed(() => 
  streamStore.isStreaming && streamStore.stats.platforms?.includes(props.platform.id)
)

const gradientClass = computed(() => 
  props.platform.id === 'twitch' 
    ? 'bg-gradient-to-br from-purple-500 to-purple-700' 
    : 'bg-gradient-to-br from-red-500 to-red-700'
)
</script>