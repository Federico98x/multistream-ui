import { ref, computed, watch } from 'vue'
import { useStreamStore } from '@/stores/stream'
import { useNotificationStore } from '@/stores/notification'

export function useStream() {
  const streamStore = useStreamStore()
  const notificationStore = useNotificationStore()
  
  const selectedPlatforms = ref<string[]>(['twitch', 'youtube'])
  const isLoading = ref(false)
  const autoReconnect = ref(true)

  const isStreaming = computed(() => streamStore.isStreaming)
  const platforms = computed(() => streamStore.platforms)
  const streamStats = computed(() => streamStore.stats)
  const systemStats = computed(() => streamStore.systemStats)

  const canStart = computed(() => 
    !isLoading.value && 
    !isStreaming.value && 
    selectedPlatforms.value.length > 0
  )

  const canStop = computed(() => 
    !isLoading.value && 
    isStreaming.value
  )

  const activePlatforms = computed(() => 
    platforms.value.filter(p => 
      streamStats.value.platforms?.includes(p.id)
    )
  )

  async function startStream() {
    if (!canStart.value) return

    isLoading.value = true
    
    try {
      await streamStore.startStream(selectedPlatforms.value)
    } catch (error) {
      console.error('Failed to start stream:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function stopStream() {
    if (!canStop.value) return

    isLoading.value = true
    
    try {
      await streamStore.stopStream()
    } catch (error) {
      console.error('Failed to stop stream:', error)
    } finally {
      isLoading.value = false
    }
  }

  function toggleStream() {
    if (isStreaming.value) {
      stopStream()
    } else {
      startStream()
    }
  }

  function togglePlatform(platformId: string) {
    if (isStreaming.value) return

    const index = selectedPlatforms.value.indexOf(platformId)
    if (index > -1) {
      selectedPlatforms.value.splice(index, 1)
    } else {
      selectedPlatforms.value.push(platformId)
    }
  }

  function isPlatformSelected(platformId: string): boolean {
    return selectedPlatforms.value.includes(platformId)
  }

  function isPlatformActive(platformId: string): boolean {
    return streamStats.value.platforms?.includes(platformId) || false
  }

  // Auto-reconnection logic
  watch(
    () => streamStore.stats.active,
    (isActive, wasActive) => {
      if (wasActive && !isActive && autoReconnect.value) {
        notificationStore.addNotification({
          type: 'warning',
          title: 'Stream Disconnected',
          message: 'Attempting to reconnect...'
        })

        // Attempt reconnection after 5 seconds
        setTimeout(() => {
          if (autoReconnect.value && !streamStore.isStreaming) {
            startStream()
          }
        }, 5000)
      }
    }
  )

  return {
    // State
    selectedPlatforms,
    isLoading,
    autoReconnect,

    // Computed
    isStreaming,
    platforms,
    streamStats,
    systemStats,
    canStart,
    canStop,
    activePlatforms,

    // Methods
    startStream,
    stopStream,
    toggleStream,
    togglePlatform,
    isPlatformSelected,
    isPlatformActive
  }
}