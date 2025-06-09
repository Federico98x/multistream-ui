<template>
  <div 
    class="glass rounded-lg p-4 max-w-sm min-w-[300px] shadow-lg border"
    :class="notificationClass"
  >
    <div class="flex items-start gap-3">
      <div 
        class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        :class="iconClass"
      >
        <component :is="iconComponent" class="w-4 h-4 text-white" />
      </div>
      
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold text-white">{{ notification.title }}</h4>
        <p v-if="notification.message" class="text-xs text-gray-300 mt-1">{{ notification.message }}</p>
      </div>
      
      <button
        @click="$emit('close', notification.id)"
        class="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
      >
        <XMarkIcon class="w-3 h-3 text-gray-400" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'
import type { NotificationMessage } from '@/types'

const props = defineProps<{
  notification: NotificationMessage
}>()

const emit = defineEmits<{
  close: [id: string]
}>()

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[props.notification.type]
})

const notificationClass = computed(() => {
  const classes = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    info: 'border-blue-500/30 bg-blue-500/10'
  }
  return classes[props.notification.type]
})

const iconClass = computed(() => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[props.notification.type]
})

onMounted(() => {
  // Auto-close after duration
  const duration = props.notification.duration || 5000
  setTimeout(() => {
    emit('close', props.notification.id)
  }, duration)
})
</script>