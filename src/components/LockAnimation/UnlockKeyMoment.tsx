import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ease = [0.22, 1, 0.36, 1] as const
const FADE_IN_MS = 650
const HOLD_MS = 1000
const FADE_OUT_MS = 650

interface UnlockKeyMomentProps {
  onComplete: () => void
}

export function UnlockKeyMoment({ onComplete }: UnlockKeyMomentProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), FADE_IN_MS + HOLD_MS)
    const completeTimer = setTimeout(onComplete, FADE_IN_MS + HOLD_MS + FADE_OUT_MS)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -8 : 0 }}
      transition={{ duration: isExiting ? FADE_OUT_MS / 1000 : FADE_IN_MS / 1000, ease }}
      className="flex flex-col items-center gap-6 px-4 text-center sm:gap-7"
    >
      <div className="relative flex size-20 items-center justify-center sm:size-24 md:size-28">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(201,169,98,0.15)_0%,transparent_70%)]" />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative size-12 sm:size-14 md:size-16"
          aria-hidden
        >
          <defs>
            <linearGradient id="key-brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8d5a3" />
              <stop offset="45%" stopColor="#c9a962" />
              <stop offset="100%" stopColor="#8a7344" />
            </linearGradient>
          </defs>

          <circle cx="8" cy="8" r="4" stroke="url(#key-brass)" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="1.5" fill="#c9a962" />
          <path
            d="M11 8h9M17 8v3M14 8v2"
            stroke="url(#key-brass)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="font-display text-balance text-[clamp(1.125rem,3vw+0.5rem,1.5rem)] font-light tracking-wide text-accent-soft">
        Another memory unlocked. ❤️
      </p>
    </motion.div>
  )
}
