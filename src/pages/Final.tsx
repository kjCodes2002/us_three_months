import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FinalLetter } from '../components/Final/FinalLetter'
import { ProposalSection } from '../components/Final/ProposalSection'
import { StarryBackground } from '../components/Final/StarryBackground'
import { FINAL_LETTER, FINAL_PROPOSAL } from '../data/final'
import { getResumePath, hasCompletedAllChapters, clearReadingProgress } from '../lib/readingProgress'

const ease = [0.22, 1, 0.36, 1] as const

type FinalStage = 'black' | 'letter' | 'proposal' | 'finale' | 'closing'

export default function Final() {
  const [stage, setStage] = useState<FinalStage>('black')
  const [showChapterEight, setShowChapterEight] = useState(false)
  const [canAccessFinal] = useState(() => hasCompletedAllChapters())

  useEffect(() => {
    if (!canAccessFinal) return

    const timer = setTimeout(() => setStage('letter'), 800)
    return () => clearTimeout(timer)
  }, [canAccessFinal])

  useEffect(() => {
    if (!canAccessFinal || stage !== 'finale') return

    const chapterTimer = setTimeout(() => {
      setShowChapterEight(true)
      clearReadingProgress()
    }, 3000)
    return () => clearTimeout(chapterTimer)
  }, [canAccessFinal, stage])

  if (!canAccessFinal) {
    return <Navigate to={getResumePath()} replace />
  }

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col overflow-x-hidden bg-black">
      <AnimatePresence>
        {stage === 'finale' || stage === 'closing' ? (
          <motion.div
            key="starry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease }}
          >
            <StarryBackground />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="safe-px safe-pt safe-pb relative z-10 flex min-h-dvh min-w-0 flex-1 flex-col items-center justify-start overflow-x-hidden overflow-y-auto py-8 sm:justify-center sm:py-16">
        <AnimatePresence mode="wait">
          {stage === 'black' && (
            <motion.div
              key="black"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              className="fixed inset-0 bg-black"
            />
          )}

          {stage === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease }}
              className="w-full min-w-0"
            >
              <FinalLetter paragraphs={FINAL_LETTER} onComplete={() => setStage('proposal')} />
            </motion.div>
          )}

          {stage === 'proposal' && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease }}
              className="w-full min-w-0"
            >
              <ProposalSection proposal={FINAL_PROPOSAL} onAccept={() => setStage('finale')} />
            </motion.div>
          )}

          {(stage === 'finale' || stage === 'closing') && (
            <motion.div
              key="finale"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease }}
              className="flex w-full min-w-0 flex-col items-center gap-6 text-center sm:gap-8"
            >
              <h1 className="font-display text-balance text-[clamp(1.5rem,4.5vw+0.75rem,3rem)] font-light tracking-wide text-accent-soft">
                Happy Three Months, Jaan. ❤️
              </h1>

              <p className="font-serif text-pretty max-w-md text-[clamp(1rem,2vw+0.5rem,1.25rem)] leading-relaxed text-text-muted">
                To the girl who unknowingly became my favorite chapter.
              </p>

              <AnimatePresence>
                {showChapterEight && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease }}
                    className="mt-4 flex flex-col items-center gap-3 sm:mt-8 sm:gap-4"
                  >
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, ease }}
                      className="font-display text-[clamp(1.375rem,3.5vw+0.5rem,1.875rem)] font-light tracking-[0.15em] text-text"
                    >
                      Chapter 8
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 1.4, ease }}
                      className="font-serif text-[clamp(1rem,2vw+0.5rem,1.25rem)] text-accent-muted"
                    >
                      Begins Tomorrow.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
