import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PremiumBackground } from '../components/Background/PremiumBackground'
import { Button } from '../components/Button/Button'
import { Lock } from '../components/Lock/Lock'
import { useGuardedAction } from '../hooks/useGuardedAction'

const ease = [0.22, 1, 0.36, 1] as const
const FADE_DURATION = 1.2

const sceneTransition = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: FADE_DURATION, ease },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: FADE_DURATION, ease },
  },
}

const SCENE_HOLD: Record<1 | 2 | 3, number> = {
  1: 2000,
  2: 2000,
  3: 3000,
}

function SceneOne() {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center sm:gap-2">
      <p className="font-display text-balance text-[clamp(1.875rem,5vw+0.75rem,3rem)] font-light tracking-wide text-text">
        Welcome back,
      </p>
      <p className="font-display text-balance text-[clamp(1.875rem,5vw+0.75rem,3rem)] font-light tracking-wide text-accent-soft">
        Gunnu.
      </p>
    </div>
  )
}

function SceneTwo() {
  return (
    <p className="font-display text-balance max-w-lg text-center text-[clamp(1.5rem,4vw+0.75rem,2.25rem)] font-light tracking-wide text-text">
      I made something for you.
    </p>
  )
}

function SceneThree() {
  return (
    <div className="flex max-w-md flex-col gap-3 text-center sm:gap-4">
      <p className="font-serif text-[clamp(1.125rem,2.5vw+0.5rem,1.5rem)] text-text">Take your time.</p>
      <p className="font-serif text-[clamp(1.125rem,2.5vw+0.5rem,1.5rem)] text-text">Don&apos;t rush.</p>
      <p className="font-serif text-pretty text-[clamp(1rem,2vw+0.5rem,1.25rem)] leading-relaxed text-text-muted">
        Every chapter has been waiting for you.
      </p>
    </div>
  )
}

function SceneFour() {
  const navigate = useNavigate()
  const { invoke: unlock, isPending } = useGuardedAction(() => navigate('/chapter/1'))

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 text-center sm:gap-10 md:gap-12">
      <Lock isLocked size="large" />

      <div className="flex flex-col gap-2.5 sm:gap-3">
        <p className="font-serif text-[clamp(1rem,2vw+0.5rem,1.25rem)] text-text-muted">
          Some stories are told.
        </p>
        <p className="font-display text-balance text-[clamp(1.375rem,3.5vw+0.5rem,1.875rem)] font-light tracking-wide text-text">
          Ours has to be unlocked.
        </p>
      </div>

      <Button
        className="font-serif w-full max-w-xs px-8 py-3.5 text-base tracking-wider sm:w-auto sm:max-w-none"
        disabled={isPending}
        onClick={unlock}
      >
        Unlock Our Story
      </Button>
    </div>
  )
}

export default function Opening() {
  const [scene, setScene] = useState<1 | 2 | 3 | 4>(1)

  useEffect(() => {
    if (scene === 4) return

    const hold = SCENE_HOLD[scene]
    const timer = setTimeout(
      () => setScene((current) => (current + 1) as 1 | 2 | 3 | 4),
      FADE_DURATION * 1000 + hold,
    )

    return () => clearTimeout(timer)
  }, [scene])

  return (
    <main className="safe-px safe-pt safe-pb relative flex min-h-dvh flex-1 flex-col items-center justify-center overflow-x-hidden">
      <PremiumBackground />

      <div className="relative z-10 flex w-full min-w-0 max-w-xl items-center justify-center">
        <AnimatePresence mode="wait">
          {scene === 1 && (
            <motion.div key="scene-1" {...sceneTransition} className="w-full">
              <SceneOne />
            </motion.div>
          )}

          {scene === 2 && (
            <motion.div key="scene-2" {...sceneTransition} className="w-full">
              <SceneTwo />
            </motion.div>
          )}

          {scene === 3 && (
            <motion.div key="scene-3" {...sceneTransition} className="w-full">
              <SceneThree />
            </motion.div>
          )}

          {scene === 4 && (
            <motion.div key="scene-4" {...sceneTransition} className="w-full">
              <SceneFour />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
