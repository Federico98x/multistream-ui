<template>
  <div class="glass rounded-xl p-4 text-center">
    <div class="flex items-center justify-center mb-2">
      <div 
        class="w-8 h-8 rounded-full flex items-center justify-center"
        :class="iconClass"
      >
        <component :is="iconComponent" class="w-5 h-5 text-white" />
      </div>
    </div>
    <div class="text-lg font-bold text-white mb-1">{{ value }}</div>
    <div class="text-sm text-gray-400">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  SignalIcon, 
  VideoCameraIcon, 
  UsersIcon,
  CpuChipIcon,
  ChartBarIcon
} from '@heroicons/vue/24/solid'

const props = defineProps<{
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow'
}>()

const iconComponent = computed(() => {
  const icons = {
    signal: SignalIcon,
    video: VideoCameraIcon,
    users: UsersIcon,
    cpu: CpuChipIcon,
    chart: ChartBarIcon
  }
  return icons[props.icon as keyof typeof icons] || ChartBarIcon
})

const iconClass = computed(() => {
  const classes = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  }
  return classes[props.color]
})
</script>