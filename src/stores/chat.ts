import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import tmi from 'tmi.js'
import type { ChatMessage, TwitchEmote } from '@/types'
import { useNotificationStore } from './notification'

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref<ChatMessage[]>([])
  const twitchClient = ref<tmi.Client | null>(null)
  const twitchConnected = ref(false)
  const youtubeConnected = ref(false)
  const maxMessages = 100
  const messageBuffer = ref<ChatMessage[]>([])

  // Computed
  const connectionStatus = computed(() => ({
    twitch: twitchConnected.value,
    youtube: youtubeConnected.value
  }))

  // Message processing with buffering for performance
  const flushMessageBuffer = () => {
    if (messageBuffer.value.length > 0) {
      messages.value.push(...messageBuffer.value)
      
      // Keep only recent messages
      if (messages.value.length > maxMessages) {
        messages.value = messages.value.slice(-maxMessages)
      }
      
      messageBuffer.value = []
    }
  }

  // Flush buffer every 100ms for smooth performance
  setInterval(flushMessageBuffer, 100)

  // Actions
  async function initialize() {
    const notificationStore = useNotificationStore()
    
    try {
      await connectTwitch()
      await connectYouTube()
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      notificationStore.addNotification({
        type: 'warning',
        title: 'Chat Initialization',
        message: 'Some chat connections failed'
      })
    }
  }

  async function connectTwitch() {
    const notificationStore = useNotificationStore()
    
    try {
      // Anonymous connection for reading chat
      twitchClient.value = new tmi.Client({
        connection: {
          secure: true,
          reconnect: true
        },
        channels: ['your_channel_name'] // Replace with actual channel
      })

      twitchClient.value.on('message', (channel, tags, message, self) => {
        if (self) return // Ignore messages from the bot itself

        const chatMessage: ChatMessage = {
          id: `twitch-${Date.now()}-${Math.random()}`,
          platform: 'twitch',
          username: tags['display-name'] || tags.username || 'Anonymous',
          message: message,
          timestamp: Date.now(),
          color: tags.color || '#ffffff',
          badges: Object.keys(tags.badges || {}),
          emotes: processTwitchEmotes(message, tags.emotes || {})
        }

        messageBuffer.value.push(chatMessage)
      })

      twitchClient.value.on('connected', () => {
        twitchConnected.value = true
        notificationStore.addNotification({
          type: 'success',
          title: 'Twitch Chat Connected',
          message: 'Now reading Twitch chat messages'
        })
      })

      twitchClient.value.on('disconnected', () => {
        twitchConnected.value = false
        notificationStore.addNotification({
          type: 'warning',
          title: 'Twitch Chat Disconnected',
          message: 'Lost connection to Twitch chat'
        })
      })

      await twitchClient.value.connect()
    } catch (error) {
      console.error('Failed to connect to Twitch:', error)
      notificationStore.addNotification({
        type: 'error',
        title: 'Twitch Chat Error',
        message: 'Could not connect to Twitch chat'
      })

      // Add mock messages for development
      addMockTwitchMessages()
    }
  }

  async function connectYouTube() {
    const notificationStore = useNotificationStore()
    
    try {
      // YouTube Live Chat API implementation would go here
      // For now, we'll mock the connection and add sample messages
      
      youtubeConnected.value = true
      notificationStore.addNotification({
        type: 'info',
        title: 'YouTube Chat Mock',
        message: 'YouTube chat simulation active'
      })

      // Add mock YouTube messages
      addMockYouTubeMessages()
    } catch (error) {
      console.error('Failed to connect to YouTube:', error)
      notificationStore.addNotification({
        type: 'error',
        title: 'YouTube Chat Error',
        message: 'Could not connect to YouTube chat'
      })
    }
  }

  function processTwitchEmotes(message: string, emotes: any): TwitchEmote[] {
    if (!emotes) return []

    const emoteList: TwitchEmote[] = []
    
    Object.keys(emotes).forEach(emoteId => {
      const positions = emotes[emoteId]
      positions.forEach((position: string) => {
        const [start, end] = position.split('-').map(Number)
        const emoteName = message.slice(start, end + 1)
        
        emoteList.push({
          id: emoteId,
          name: emoteName,
          positions: [[start, end]],
          url: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`
        })
      })
    })

    return emoteList
  }

  function addMockTwitchMessages() {
    const mockMessages = [
      { username: 'StreamerFan1', message: 'Great stream! Kappa', color: '#ff6b6b' },
      { username: 'ChatMod', message: 'Welcome everyone!', color: '#4ecdc4' },
      { username: 'Viewer123', message: 'How are you doing today?', color: '#45b7d1' },
      { username: 'EmoteUser', message: 'PogChamp amazing content!', color: '#96ceb4' }
    ]

    mockMessages.forEach((mock, index) => {
      setTimeout(() => {
        const message: ChatMessage = {
          id: `mock-twitch-${Date.now()}-${index}`,
          platform: 'twitch',
          username: mock.username,
          message: mock.message,
          timestamp: Date.now(),
          color: mock.color,
          badges: index === 1 ? ['moderator'] : []
        }
        messageBuffer.value.push(message)
      }, index * 2000)
    })
  }

  function addMockYouTubeMessages() {
    const mockMessages = [
      { username: 'YouTubeFan', message: 'Love this content!', color: '#ff0000' },
      { username: 'Subscriber', message: 'Been watching for years!', color: '#00ff00' },
      { username: 'NewViewer', message: 'First time here, loving it!', color: '#0000ff' }
    ]

    mockMessages.forEach((mock, index) => {
      setTimeout(() => {
        const message: ChatMessage = {
          id: `mock-youtube-${Date.now()}-${index}`,
          platform: 'youtube',
          username: mock.username,
          message: mock.message,
          timestamp: Date.now(),
          color: mock.color,
          badges: index === 1 ? ['member'] : []
        }
        messageBuffer.value.push(message)
      }, (index + 2) * 3000)
    })
  }

  function clearMessages() {
    messages.value = []
    messageBuffer.value = []
  }

  function disconnect() {
    if (twitchClient.value) {
      twitchClient.value.disconnect()
      twitchConnected.value = false
    }
    youtubeConnected.value = false
  }

  return {
    messages,
    twitchConnected,
    youtubeConnected,
    connectionStatus,
    initialize,
    connectTwitch,
    connectYouTube,
    clearMessages,
    disconnect
  }
})