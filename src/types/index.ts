export interface Platform {
  id: string
  name: string
  configured: boolean
  isActive: boolean
  color: string
}

export interface StreamStats {
  active: boolean
  uptime?: number
  stats?: {
    bitrate: number
    fps: number
    viewers: number
  }
  platforms?: string[]
}

export interface SystemStats {
  api?: {
    memory: number
    cpu: number
  }
  stream?: {
    memory: number
    cpu: number
  }
}

export interface ChatMessage {
  id: string
  platform: 'twitch' | 'youtube'
  username: string
  message: string
  timestamp: number
  color?: string
  badges?: string[]
  emotes?: Emote[]
  isModerated?: boolean
}

export interface Emote {
  id: string
  name: string
  url: string
  positions: number[][]
}

export interface TwitchEmote {
  id: string
  name: string
  positions: number[][]
  url: string
}

export interface YouTubeUser {
  channelId: string
  displayName: string
  profileImageUrl?: string
}

export interface NotificationMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}