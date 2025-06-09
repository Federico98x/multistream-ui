import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NotificationMessage } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<NotificationMessage[]>([])

  // Actions
  function addNotification(notification: Omit<NotificationMessage, 'id'>) {
    const newNotification: NotificationMessage = {
      id: `notification-${Date.now()}-${Math.random()}`,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove after duration
    const duration = notification.duration || 5000
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, duration)
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  }
})