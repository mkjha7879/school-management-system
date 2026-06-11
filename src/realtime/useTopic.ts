import { useEffect, useRef } from 'react'
import { subscribe } from './client'

export function useTopic<T = unknown>(
  topic: string,
  onMessage: (body: T) => void
) {
  const handlerRef = useRef(onMessage)
  handlerRef.current = onMessage

  useEffect(() => {
    return subscribe(topic, (body) => handlerRef.current(body as T))
  }, [topic])
}
