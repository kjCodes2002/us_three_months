import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PremiumBackground } from '../components/Background/PremiumBackground'
import { Button } from '../components/Button/Button'
import { useGuardedAction } from '../hooks/useGuardedAction'
import { getEntryPath } from '../lib/readingProgress'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease },
  },
})

export default function Landing() {
  const navigate = useNavigate()
  const { invoke: begin, isPending } = useGuardedAction(() => navigate(getEntryPath()))

  return (
    <main className="safe-px relative flex min-h-dvh flex-1 flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      <PremiumBackground />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-6 text-center sm:gap-8 md:gap-10">
        <motion.h1
          {...fadeUp(0.4)}
          className="font-display text-balance text-[clamp(1.875rem,5vw+0.75rem,3.75rem)] leading-tight font-light tracking-wide text-text"
        >
          There&apos;s something waiting for you.
        </motion.h1>

        <motion.p
          {...fadeUp(1.1)}
          className="font-serif text-pretty max-w-md text-[clamp(1rem,2vw+0.5rem,1.125rem)] leading-relaxed text-text-muted"
        >
          You&apos;ll have to earn every piece of it.
        </motion.p>

        <motion.div {...fadeUp(1.8)} className="w-full max-w-xs sm:max-w-none">
          <Button
            className="font-serif w-full px-8 py-3.5 text-base tracking-wider sm:w-auto"
            disabled={isPending}
            onClick={begin}
          >
            Let&apos;s Begin
          </Button>
        </motion.div>
      </div>
    </main>
  )
}
