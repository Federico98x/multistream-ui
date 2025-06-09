import type { ChatMessage, TwitchEmote } from '@/types'

export function sanitizeMessage(message: string): string {
  // Remove potentially harmful HTML/JS
  return message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function processEmotes(message: string, emotes: TwitchEmote[]): string {
  if (!emotes || emotes.length === 0) return sanitizeMessage(message)

  let processedMessage = message
  
  // Sort emotes by position (reverse order to avoid index shifting)
  const sortedEmotes = [...emotes].sort((a, b) => b.positions[0][0] - a.positions[0][0])
  
  for (const emote of sortedEmotes) {
    for (const [start, end] of emote.positions) {
      const emoteImg = `<img src="${emote.url}" alt="${emote.name}" class="inline w-6 h-6 align-middle mx-1" title="${emote.name}" loading="lazy" />`
      processedMessage = processedMessage.slice(0, start) + emoteImg + processedMessage.slice(end + 1)
    }
  }
  
  return processedMessage
}

export function filterBadWords(message: string): string {
  // Basic profanity filter - in production, use a proper library
  const badWords = ['spam', 'hate'] // Add more as needed
  let filtered = message
  
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    filtered = filtered.replace(regex, '*'.repeat(word.length))
  })
  
  return filtered
}

export function isValidChatMessage(message: ChatMessage): boolean {
  return !!(
    message.id &&
    message.platform &&
    message.username &&
    message.message &&
    message.timestamp
  )
}

export function getDominantColor(username: string): string {
  // Generate consistent color based on username
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 60%)`
}

export function truncateMessage(message: string, maxLength: number = 200): string {
  if (message.length <= maxLength) return message
  return message.slice(0, maxLength) + '...'
}