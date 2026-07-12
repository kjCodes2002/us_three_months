import { motion } from 'framer-motion'
import { memo } from 'react'

const TOTAL_CHAPTERS = 7
const ease = [0.22, 1, 0.36, 1] as const

interface ChapterProgressProps {
  number: number
  title: string
}

export const ChapterProgress = memo(function ChapterProgress({
  number,
  title,
}: ChapterProgressProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="mb-6 sm:mb-8 md:mb-10"
    >
      <p className="font-serif text-xs tracking-[0.16em] text-text-faint uppercase">
        Chapter {number} of {TOTAL_CHAPTERS}
      </p>
      <p className="text-pretty mt-1.5 font-display text-[clamp(1rem,2vw+0.5rem,1.25rem)] font-light tracking-wide text-text-muted">
        {title}
      </p>
    </motion.header>
  )
})
