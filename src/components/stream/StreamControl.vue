<template>
  <div class="glass-dark rounded-3xl shadow-2xl p-8">
    <h2 class="text-3xl font-bold text-white mb-6 text-center">
      Stream Control
    </h2>

    <!-- Status Indicator -->
    <div class="flex items-center justify-center mb-8">
      <div class="relative">
        <div v-if="isStreaming" class="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
        <div 
          class="relative w-4 h-4 rounded-full"
          :class="isStreaming ? 'bg-green-500' : 'bg-gray-500'"
        ></div>
      </div>
      <span class="ml-3 text-lg font-medium text-white">
        {{ isStreaming ? 'LIVE' : 'OFFLINE' }}
      </span>
      <span v-if="streamStats.uptime" class="ml-3 text-gray-400">
        {{ formatUptime(streamStats.uptime) }}
      </span>
    </div>

    <!-- Platform Selection -->
    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-300 mb-4">Select Platforms</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlatformCard
          v-for="platform in platforms"
          :key="platform.id"
          :platform="platform"
          :selected="selectedPlatforms.includes(platform.id)"
          :disabled="isStreaming"
          @toggle="togglePlatform"
        />
      </div>
    </div>

    <!-- Main Control Button -->
    <div class="flex justify-center mb-8">
      <button
        @click="toggleStream"
        :disabled="loading || (!isStreaming && selectedPlatforms.length === 0)"
        class="group relative overflow-hidden rounded-full px-12 py-6 text-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        :class="isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'"
      >
        <!-- Animated background -->
        <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <span class="relative flex items-center gap-3">
          <PlayIcon v-if="!isStreaming" class="w-8 h-8" />
          <StopIcon v-else class="w-8 h-8" />
          {{ isStreaming ? 'Stop Streaming' : 'Start Streaming' }}
        </span>
      </button>
    </div>

    <!-- Live Stats -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 transform translate-y-4"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isStreaming" class="grid grid-cols-3 gap-4">
        <StatCard
          title="Bitrate"
          :value="`${streamStats.stats?.bitrate || 0} kbps`"
          icon="signal"
          color="blue"
        />
        <StatCard
          title="FPS"
          :value="`${streamStats.stats?.fps || 0}`"
          icon="video"
          color="green"
        />
        <StatCard
          title="Viewers"
          :value="streamStats.stats?.viewers || 0"
          icon="users"
          color="purple"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlayIcon, StopIcon } from '@heroicons/vue/24/solid'
import { useStreamStore } from '@/stores/stream'
import PlatformCard from './PlatformCard.vue'
import StatCard from '../ui/StatCard.vue'

const streamStore = useStreamStore()
const selectedPlatforms = ref<string[]>(['twitch', 'youtube'])
const loading = ref(false)

const isStreaming = computed(() => streamStore.isStreaming)
const streamStats = computed(() => streamStore.stats)
const platforms = computed(() => streamStore.platforms)

const togglePlatform = (platformId: string) => {
  if (isStreaming.value) return
  
  const index = selectedPlatforms.value.indexOf(platformId)
  if (index > -1) {
    selectedPlatforms.value.splice(index, 1)
  } else {
    selectedPlatforms.value.push(platformId)
  }
}

const toggleStream = async () => {
  loading.value = true
  try {
    if (isStreaming.value) {
      await streamStore.stopStream()
    } else {
      await streamStore.startStream(selectedPlatforms.value)
    }
  } finally {
    loading.value = false
  }
}

const formatUptime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}
</script>