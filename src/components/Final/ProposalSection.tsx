import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useGuardedAction } from '../../hooks/useGuardedAction'
import { Button } from '../Button/Button'

const ease = [0.22, 1, 0.36, 1] as const
const MAX_ATTEMPTS = 5
const NO_ATTEMPT_COOLDOWN_MS = 400

const DODGE_OFFSETS = [
  { x: 68, y: -32 },
  { x: -72, y: 28 },
  { x: 52, y: 44 },
  { x: -58, y: -40 },
  { x: 84, y: 16 },
] as const

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function scaleOffset(
  offset: { x: number; y: number },
  bounds: { maxX: number; maxY: number },
  isMobile: boolean,
): { x: number; y: number } {
  const scale = isMobile ? 0.55 : 1
  return {
    x: clamp(offset.x * scale, -bounds.maxX, bounds.maxX),
    y: clamp(offset.y * scale, -bounds.maxY, bounds.maxY),
  }
}

interface ProposalSectionProps {
  proposal: string
  onAccept: () => void
}

export function ProposalSection({ proposal, onAccept }: ProposalSectionProps) {
  const dodgeAreaRef = useRef<HTMLDivElement>(null)
  const noAttemptLockedRef = useRef(false)
  const { invoke: accept, isPending: isAccepting } = useGuardedAction(onAccept)
  const isMobile = useMediaQuery('(max-width: 639px)')
  const [attempt, setAttempt] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [showMessage, setShowMessage] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [dodgeBounds, setDodgeBounds] = useState({ maxX: 72, maxY: 44 })

  useLayoutEffect(() => {
    const updateBounds = () => {
      const area = dodgeAreaRef.current
      if (!area) return

      const width = area.clientWidth
      const height = area.clientHeight
      setDodgeBounds({
        maxX: Math.max(24, width / 2 - 56),
        maxY: Math.max(16, height / 2 - 28),
      })
    }

    updateBounds()
    window.addEventListener('resize', updateBounds)
    return () => window.removeEventListener('resize', updateBounds)
  }, [isMobile, hidden])

  const handleNoAttempt = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (hidden || fadeOut || attempt >= MAX_ATTEMPTS || noAttemptLockedRef.current) return

      const next = attempt + 1
      if (next > MAX_ATTEMPTS) return

      noAttemptLockedRef.current = true
      window.setTimeout(() => {
        noAttemptLockedRef.current = false
      }, NO_ATTEMPT_COOLDOWN_MS)

      setAttempt(next)

      if (next <= 3) {
        const base = DODGE_OFFSETS[(next - 1) % DODGE_OFFSETS.length]
        setOffset(scaleOffset(base, dodgeBounds, isMobile))
      }

      if (next === 3) {
        setShowMessage(true)
      }

      if (next === 4) {
        setScale(0.72)
      }

      if (next === 5) {
        setFadeOut(true)
        window.setTimeout(() => setHidden(true), 550)
      }
    },
    [attempt, dodgeBounds, fadeOut, hidden, isMobile],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease }}
      className="safe-px flex w-full min-w-0 flex-col items-center gap-8 text-center sm:gap-10"
    >
      <p className="font-display text-balance max-w-md break-words text-[clamp(1.375rem,4vw+0.75rem,1.875rem)] font-light leading-relaxed tracking-wide whitespace-pre-line text-text">
        {proposal}
      </p>

      <div className="flex w-full min-w-0 max-w-sm flex-col items-stretch gap-4 sm:max-w-md">
        <Button
          className="font-serif w-full px-8 py-3.5 text-base tracking-wider transition-shadow duration-500 hover:shadow-[0_0_28px_rgba(201,169,98,0.2)] sm:w-auto sm:self-center"
          disabled={isAccepting}
          onClick={accept}
        >
          ❤️ Always
        </Button>

        <div
          ref={dodgeAreaRef}
          className="relative min-h-16 w-full overflow-hidden sm:min-h-14"
          aria-hidden={hidden}
        >
          <AnimatePresence>
            {!hidden && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: fadeOut ? 0 : 1,
                  x: offset.x,
                  y: offset.y,
                  scale,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  opacity: { duration: fadeOut ? 0.5 : 0.35, ease },
                  x: { type: 'spring', stiffness: 280, damping: 22 },
                  y: { type: 'spring', stiffness: 280, damping: 22 },
                  scale: { duration: 0.35, ease },
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Button
                  variant="ghost"
                  className="font-serif px-8 py-3.5 text-base tracking-wider"
                  onPointerDown={handleNoAttempt}
                >
                  🤍 No
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showMessage && !hidden && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: fadeOut ? 0 : 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.45, ease }}
              className="font-display text-pretty text-lg font-light tracking-wide text-accent-soft sm:text-xl"
            >
              Hatt... try the other one. 💋
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
