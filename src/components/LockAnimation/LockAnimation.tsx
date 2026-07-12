import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type LockPhase = 'enter' | 'shake' | 'unlock' | 'fade'

interface LockAnimationProps {
  onComplete: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function LockAnimation({ onComplete }: LockAnimationProps) {
  const [phase, setPhase] = useState<LockPhase>('enter')

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('shake'), 180),
      setTimeout(() => setPhase('unlock'), 480),
      setTimeout(() => setPhase('fade'), 780),
      setTimeout(onComplete, 1000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const isShaking = phase === 'shake'
  const isLocked = phase !== 'unlock' && phase !== 'fade'
  const isGlowing = phase === 'shake' || phase === 'unlock'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: phase === 'fade' ? 0 : 1,
        y: phase === 'fade' ? -8 : 0,
        scale: phase === 'fade' ? 0.96 : 1,
        x: isShaking ? [0, -4, 4, -3, 3, 0] : 0,
      }}
      transition={{
        opacity: { duration: 0.35, ease },
        y: { duration: 0.35, ease },
        scale: { duration: 0.35, ease },
        x: { duration: 0.35 },
      }}
      className="flex flex-col items-center justify-center"
    >
      <div
        className={`relative flex size-32 items-center justify-center rounded-sm border bg-surface-overlay p-8 transition-shadow duration-500 sm:size-36 md:size-40 ${
          isGlowing
            ? 'border-accent/50 shadow-[0_0_48px_rgba(201,169,98,0.25)]'
            : 'border-border shadow-[0_0_32px_rgba(201,169,98,0.08)]'
        }`}
      >
        <div className="absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.06)_0%,transparent_70%)]" />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative size-12 md:size-14"
          aria-hidden
        >
          <defs>
            <linearGradient id="lock-brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8d5a3" />
              <stop offset="45%" stopColor="#c9a962" />
              <stop offset="100%" stopColor="#8a7344" />
            </linearGradient>
          </defs>

          <motion.path
            d="M7 11V8a5 5 0 0 1 10 0"
            stroke="url(#lock-brass)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            animate={
              isLocked
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.35, ease }}
          />

          <rect
            x="5"
            y="11"
            width="14"
            height="10"
            rx="1.5"
            stroke="url(#lock-brass)"
            strokeWidth="1.5"
            fill="#1a1612"
          />

          <circle cx="12" cy="15.5" r="1.2" fill="#c9a962" />
        </svg>

        {phase === 'unlock' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 rounded-sm bg-accent/20"
          />
        )}
      </div>
    </motion.div>
  )
}
