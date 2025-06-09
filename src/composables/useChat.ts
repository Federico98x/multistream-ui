import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import type { ChatMessage } from '@/types'

export function useChat() {
  const chatStore = useChatStore()
  const messageFilter = ref('')
  const selectedPlatforms = ref<string[]>(['twitch', 'youtube'])

  const filteredMessages = computed(() => {
    let messages = chatStore.messages

    // Filter by platform
    if (selectedPlatforms.value.length > 0) {
      messages = messages.filter(msg => selectedPlatforms.value.includes(msg.platform))
    }

    // Filter by search term
    if (messageFilter.value.trim()) {
      const filter = messageFilter.value.toLowerCase()
      messages = messages.filter(msg => 
        msg.username.toLowerCase().includes(filter) ||
        msg.message.toLowerCase().includes(filter)
      )
    }

    return messages
  })

  const connectionStatus = computed(() => chatStore.connectionStatus)
  const isConnected = computed(() => 
    chatStore.twitchConnected || chatStore.youtubeConnected
  )

  const messageCount = computed(() => ({
    total: chatStore.messages.length,
    twitch: chatStore.messages.filter(m => m.platform === 'twitch').length,
    youtube: chatStore.messages.filter(m => m.platform === 'youtube').length
  }))

  function togglePlatform(platform: string) {
    const index = selectedPlatforms.value.indexOf(platform)
    if (index > -1) {
      selectedPlatforms.value.splice(index, 1)
    } else {
      selectedPlatforms.value.push(platform)
    }
  }

  function clearMessages() {
    chatStore.clearMessages()
  }

  function reconnect() {
    chatStore.disconnect()
    setTimeout(() => {
      chatStore.initialize()
    }, 1000)
  }

  return {
    // State
    messageFilter,
    selectedPlatforms,
    
    // Computed
    filteredMessages,
    connectionStatus,
    isConnected,
    messageCount,
    
    // Methods
    togglePlatform,
    clearMessages,
    reconnect
  }
}