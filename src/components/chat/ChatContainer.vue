<template>
  <div class="glass-dark rounded-2xl p-6 h-[600px] flex flex-col">
    <!-- Chat Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-white">Live Chat</h3>
      <div class="flex gap-2">
        <button
          v-for="platform in ['twitch', 'youtube']"
          :key="platform"
          @click="togglePlatform(platform)"
          class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
          :class="activePlatforms.includes(platform) 
            ? (platform === 'twitch' ? 'bg-twitch-500 text-white' : 'bg-youtube-500 text-white')
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
        >
          {{ platform.charAt(0).toUpperCase() + platform.slice(1) }}
        </button>
      </div>
    </div>

    <!-- Chat Messages -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
    >
      <TransitionGroup
        name="chat"
        tag="div"
        class="space-y-1"
      >
        <ChatMessage
          v-for="message in filteredMessages"
          :key="message.id"
          :message="message"
        />
      </TransitionGroup>
    </div>

    <!-- Connection Status -->
    <div class="mt-4 flex items-center justify-between text-sm">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div 
            class="w-2 h-2 rounded-full"
            :class="twitchConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'"
          ></div>
          <span class="text-gray-400">Twitch</span>
        </div>
        <div class="flex items-center gap-2">
          <div 
            class="w-2 h-2 rounded-full"
            :class="youtubeConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'"
          ></div>
          <span class="text-gray-400">YouTube</span>
        </div>
      </div>
      <span class="text-gray-500">{{ messages.length }} messages</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import ChatMessage from './ChatMessage.vue'

const chatStore = useChatStore()
const messagesContainer = ref<HTMLElement>()
const activePlatforms = ref<string[]>(['twitch', 'youtube'])

const messages = computed(() => chatStore.messages)
const twitchConnected = computed(() => chatStore.twitchConnected)
const youtubeConnected = computed(() => chatStore.youtubeConnected)

const filteredMessages = computed(() => 
  messages.value.filter(message => 
    activePlatforms.value.includes(message.platform)
  )
)

const togglePlatform = (platform: string) => {
  const index = activePlatforms.value.indexOf(platform)
  if (index > -1) {
    activePlatforms.value.splice(index, 1)
  } else {
    activePlatforms.value.push(platform)
  }
}

// Auto-scroll to bottom when new messages arrive
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { flush: 'post' })
</script>

<style scoped>
.chat-enter-active {
  transition: all 0.3s ease-out;
}

.chat-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.chat-leave-active {
  transition: all 0.2s ease-in;
}

.chat-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* Custom scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.7);
}
</style>