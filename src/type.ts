import { SayFn } from '@slack/bolt'
import { WebClient } from '@slack/web-api'

export type AppMentionArgs = {
  client: WebClient
  event: any
  say: SayFn
}

export type OpenHomeArgs = {
  event: any
  client: WebClient
}

export type openModalArgs = {
  body: any
  client: WebClient
}

export type submitPromptArgs = {
  body: any
  client: WebClient
  ack: any
}

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export type ApiRequest = {
  messages: Message[]
  slack_id: string
  timestamp: string
  thread_id: string
  channel_id: string
  service: string
}

export type ApiResponse = {
  message: string
}
