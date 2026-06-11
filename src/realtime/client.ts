import { Client, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

type Handler = (body: unknown) => void

const subscribers = new Map<string, Set<Handler>>()
let client: Client | null = null
let connected = false

function ensureClient(): Client {
  if (client) return client

  const wsUrl = import.meta.env.VITE_WS_URL ?? '/ws'
  client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 3000,
    onConnect: () => {
      connected = true
      for (const topic of subscribers.keys()) {
        subscribeOnBroker(topic)
      }
    },
    onWebSocketClose: () => {
      connected = false
    },
  })
  client.activate()
  return client
}

const brokerSubs = new Map<string, { unsubscribe: () => void }>()

function subscribeOnBroker(topic: string) {
  if (!client || !connected || brokerSubs.has(topic)) return
  const sub = client.subscribe(topic, (message: IMessage) => {
    let body: unknown = message.body
    try {
      body = JSON.parse(message.body)
    } catch {
      // keep raw string
    }
    subscribers.get(topic)?.forEach((handler) => handler(body))
  })
  brokerSubs.set(topic, sub)
}

export function subscribe(topic: string, handler: Handler): () => void {
  ensureClient()
  if (!subscribers.has(topic)) {
    subscribers.set(topic, new Set())
  }
  subscribers.get(topic)!.add(handler)
  subscribeOnBroker(topic)

  return () => {
    const set = subscribers.get(topic)
    set?.delete(handler)
    if (set && set.size === 0) {
      subscribers.delete(topic)
      brokerSubs.get(topic)?.unsubscribe()
      brokerSubs.delete(topic)
    }
  }
}
