import { chatAPI } from './api'
import type { ChatMessage } from '@/types'

export class YouTubeChatService {
  private pollInterval: number | null = null
  private liveChatId: string | null = null
  private pageToken: string | null = null
  private isPolling = false

  constructor(
    private onMessage: (message: ChatMessage) => void,
    private onError: (error: Error) => void
  ) {}

  async initialize(videoId?: string) {
    try {
      // Get OAuth token
      const authResponse = await chatAPI.getYouTubeAuth()
      
      if (!authResponse.data.access_token) {
        throw new Error('No YouTube access token available')
      }

      // Get live chat ID
      if (videoId) {
        const chatResponse = await chatAPI.getYouTubeChatId(videoId)
        this.liveChatId = chatResponse.data.liveChatId
      }

      return true
    } catch (error) {
      this.onError(error as Error)
      return false
    }
  }

  async startPolling() {
    if (!this.liveChatId || this.isPolling) return

    this.isPolling = true
    this.poll()
  }

  private async poll() {
    if (!this.isPolling || !this.liveChatId) return

    try {
      const response = await chatAPI.getYouTubeMessages(this.liveChatId)
      const { items, nextPageToken, pollingIntervalMillis } = response.data

      // Process new messages
      items.forEach((item: any) => {
        const message: ChatMessage = {
          id: `youtube-${item.id}`,
          platform: 'youtube',
          username: item.authorDetails.displayName,
          message: item.snippet.displayMessage,
          timestamp: new Date(item.snippet.publishedAt).getTime(),
          color: '#ff0000', // YouTube red
          badges: this.extractBadges(item.authorDetails)
        }

        this.onMessage(message)
      })

      this.pageToken = nextPageToken

      // Schedule next poll
      setTimeout(() => {
        if (this.isPolling) {
          this.poll()
        }
      }, pollingIntervalMillis || 5000)

    } catch (error) {
      this.onError(error as Error)
      
      // Retry after 10 seconds on error
      setTimeout(() => {
        if (this.isPolling) {
          this.poll()
        }
      }, 10000)
    }
  }

  private extractBadges(authorDetails: any): string[] {
    const badges: string[] = []

    if (authorDetails.isChatOwner) badges.push('owner')
    if (authorDetails.isChatModerator) badges.push('moderator')
    if (authorDetails.isChatSponsor) badges.push('member')

    return badges
  }

  stopPolling() {
    this.isPolling = false
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  disconnect() {
    this.stopPolling()
    this.liveChatId = null
    this.pageToken = null
  }
}