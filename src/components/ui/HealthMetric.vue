<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-300">{{ label }}</span>
      <span class="text-sm text-white">{{ value }}{{ unit }}</span>
    </div>
    
    <!-- Progress Bar -->
    <div class="w-full bg-gray-700 rounded-full h-2">
      <div 
        class="h-2 rounded-full transition-all duration-500 ease-out"
        :class="progressClass"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  max: number
  unit: string
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow'
}>()

const percentage = computed(() => Math.min((props.value / props.max) * 100, 100))

const progressClass = computed(() => {
  const baseClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  }
  
  // Dynamic color based on percentage if no color specified
  if (!props.color) {
    if (percentage.value < 50) return 'bg-green-500'
    if (percentage.value < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  return baseClasses[props.color]
})
</script>