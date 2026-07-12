import { AnimatePresence, motion } from 'framer-motion'
import { memo, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import type { Chapter } from '../../types/chapter'

const ease = [0.22, 1, 0.36, 1] as const
const FADE_IN_MS = 500
const HOLD_MS = 1500
const FADE_OUT_MS = 400
const HIGHLIGHT_MS = 350
const WRONG_TINT_MS = 1000
const WRONG_MESSAGE_MS = 2000

type SuccessPhase = 'idle' | 'highlight' | 'visible' | 'exiting' | 'complete'

interface QuestionCardProps {
  question: Chapter['question']
  options: Chapter['options']
  correctAnswer: string
  successMessage: Chapter['successMessage']
  wrongAnswerMessage: Chapter['wrongAnswerMessage']
  onCorrect: () => void
}

export const QuestionCard = memo(function QuestionCard({
  question,
  options,
  correctAnswer,
  successMessage,
  wrongAnswerMessage,
  onCorrect,
}: QuestionCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const canHover = useMediaQuery('(hover: hover)')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [wrongOption, setWrongOption] = useState<string | null>(null)
  const [showWrongMessage, setShowWrongMessage] = useState(false)
  const [successPhase, setSuccessPhase] = useState<SuccessPhase>('idle')
  const wrongTintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrongMessageTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const correctAnswerLockedRef = useRef(false)

  const isAnswering = successPhase !== 'idle' && successPhase !== 'complete'
  const showSuccessMessage =
    successPhase === 'visible' || successPhase === 'exiting'

  const clearWrongTimers = () => {
    if (wrongTintTimer.current) clearTimeout(wrongTintTimer.current)
    if (wrongMessageTimer.current) clearTimeout(wrongMessageTimer.current)
  }

  useEffect(() => {
    return () => clearWrongTimers()
  }, [])

  useEffect(() => {
    if (successPhase === 'highlight') {
      const timer = setTimeout(() => setSuccessPhase('visible'), HIGHLIGHT_MS)
      return () => clearTimeout(timer)
    }

    if (successPhase === 'visible') {
      const timer = setTimeout(() => setSuccessPhase('exiting'), FADE_IN_MS + HOLD_MS)
      return () => clearTimeout(timer)
    }

    if (successPhase === 'exiting') {
      const timer = setTimeout(() => {
        setSuccessPhase('complete')
        onCorrect()
      }, FADE_OUT_MS)
      return () => clearTimeout(timer)
    }
  }, [successPhase, onCorrect])

  const handleSelect = (option: string) => {
    if (correctAnswerLockedRef.current || isAnswering || successPhase === 'complete') return

    setSelectedOption(option)

    if (option === correctAnswer) {
      correctAnswerLockedRef.current = true
      clearWrongTimers()
      setWrongOption(null)
      setShowWrongMessage(false)
      setSuccessPhase('highlight')
      return
    }

    clearWrongTimers()
    setWrongOption(option)
    setShowWrongMessage(true)

    wrongTintTimer.current = setTimeout(() => setWrongOption(null), WRONG_TINT_MS)
    wrongMessageTimer.current = setTimeout(() => setShowWrongMessage(false), WRONG_MESSAGE_MS)
  }

  return (
    <div className="relative flex min-h-[50dvh] min-w-0 flex-col justify-center">
      <motion.div
        animate={{ opacity: showSuccessMessage ? 0.35 : 1 }}
        transition={{ duration: 0.6, ease }}
        className="flex w-full min-w-0 flex-col gap-6 sm:gap-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="font-serif text-pretty text-[clamp(1rem,2vw+0.5rem,1.25rem)] leading-relaxed whitespace-pre-line text-text-muted"
        >
          {question}
        </motion.p>

        <ul className="flex w-full flex-col gap-2.5 sm:gap-3" role="listbox" aria-label={question}>
          {options.map((option, index) => {
            const isSelected = selectedOption === option
            const isCorrectSelection = isSelected && isAnswering
            const isWrongFeedback = wrongOption === option

            return (
              <motion.li
                key={option}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 + index * 0.1, ease }}
                className="w-full"
              >
                <motion.button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={isAnswering}
                  onClick={() => handleSelect(option)}
                  animate={
                    isWrongFeedback && !prefersReducedMotion
                      ? { x: [0, -5, 5, -3, 3, 0] }
                      : { x: 0, y: 0 }
                  }
                  whileHover={
                    isAnswering || prefersReducedMotion || !canHover ? undefined : { y: -2 }
                  }
                  transition={{ duration: 0.4 }}
                  className={`min-h-11 w-full touch-manipulation break-words rounded-sm border px-4 py-3.5 text-left font-serif text-[clamp(0.9375rem,1.5vw+0.5rem,1rem)] leading-snug outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-default sm:px-5 sm:py-4 ${
                    isWrongFeedback
                      ? 'border-red-400/45 bg-red-950/25 text-red-100/90'
                      : isCorrectSelection
                        ? 'border-accent/70 bg-accent/10 text-accent-soft shadow-[0_0_32px_rgba(201,169,98,0.22)]'
                        : isSelected
                          ? 'border-border bg-surface-overlay text-text'
                          : 'border-border bg-surface-raised text-text hover:border-accent/35 hover:bg-surface-overlay hover:shadow-[0_4px_24px_rgba(201,169,98,0.1)]'
                  }`}
                >
                  {option}
                </motion.button>
              </motion.li>
            )
          })}
        </ul>

        <AnimatePresence>
          {showWrongMessage && !isAnswering && (
            <motion.p
              key="wrong-message"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.45, ease }}
              className="font-serif text-pretty text-[clamp(0.9375rem,1.5vw+0.5rem,1rem)] text-text-muted"
            >
              {wrongAnswerMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: successPhase === 'exiting' ? 0 : 1 }}
            transition={{
              duration: successPhase === 'exiting' ? FADE_OUT_MS / 1000 : FADE_IN_MS / 1000,
              ease,
            }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center safe-px"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: successPhase === 'exiting' ? 0 : 1, y: 0 }}
              transition={{
                duration: successPhase === 'exiting' ? FADE_OUT_MS / 1000 : FADE_IN_MS / 1000,
                ease,
              }}
              className="font-display text-balance text-center text-[clamp(1.375rem,4vw+0.75rem,1.875rem)] font-light tracking-wide text-accent-soft"
            >
              {successMessage}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})
