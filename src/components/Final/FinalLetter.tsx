import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from '../Button/Button'
import { useGuardedAction } from '../../hooks/useGuardedAction'

interface FinalLetterProps {
  paragraphs: string[]
  onComplete: () => void
}

const PARAGRAPH_DELAY = 1100
const BUTTON_DELAY_MS = 1000
const ease = [0.22, 1, 0.36, 1] as const

export function FinalLetter({ paragraphs, onComplete }: FinalLetterProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const { invoke: continueToProposal, isPending } = useGuardedAction(onComplete)

  const allParagraphsVisible = visibleCount >= paragraphs.length

  useEffect(() => {
    if (!allParagraphsVisible) {
      const timer = setTimeout(() => setVisibleCount((count) => count + 1), PARAGRAPH_DELAY)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => setShowContinueButton(true), BUTTON_DELAY_MS)
    return () => clearTimeout(timer)
  }, [allParagraphsVisible, visibleCount])

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-10 sm:gap-12">
      <div className="selectable-text safe-px mx-auto w-full min-w-0 max-w-[700px]">
        <div className="flex flex-col gap-6 sm:gap-7 md:gap-9">
          {paragraphs.slice(0, visibleCount).map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="font-[Caveat] text-pretty break-words text-[clamp(1.2rem,3.5vw+0.5rem,1.6rem)] leading-[1.75] text-text/90 sm:leading-[1.8]"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showContinueButton && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.9, ease }}
            className="safe-px flex w-full justify-center"
          >
            <Button
              className="font-serif w-full max-w-md px-8 py-3.5 text-base tracking-wider transition-shadow duration-500 hover:shadow-[0_0_28px_rgba(201,169,98,0.2)] sm:w-auto"
              disabled={isPending}
              onClick={continueToProposal}
            >
              There&apos;s one last thing... ❤️
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
