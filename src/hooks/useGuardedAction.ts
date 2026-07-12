import { useCallback, useRef, useState } from 'react'

interface UseGuardedActionOptions {
  /** Unlock after this many ms. Omit to stay locked until unmount (one-shot). */
  lockMs?: number
}

export function useGuardedAction(
  action: () => void,
  options?: UseGuardedActionOptions,
): {
  invoke: () => void
  isPending: boolean
} {
  const lockedRef = useRef(false)
  const [isPending, setIsPending] = useState(false)
  const lockMs = options?.lockMs

  const invoke = useCallback(() => {
    if (lockedRef.current) return

    lockedRef.current = true
    setIsPending(true)
    action()

    if (lockMs != null) {
      window.setTimeout(() => {
        lockedRef.current = false
        setIsPending(false)
      }, lockMs)
    }
  }, [action, lockMs])

  return { invoke, isPending }
}
