import { motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { Envelope } from './Envelope'

const ease = [0.22, 1, 0.36, 1] as const
const ENVELOPE_OPEN_MS = 1100

interface EnvelopeStageProps {
  prompt: string
  onOpen: () => void
}

export function EnvelopeStage({ prompt, onOpen }: EnvelopeStageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const openingRef = useRef(false)

  const handleOpen = useCallback(() => {
    if (isOpen || openingRef.current) return

    openingRef.current = true
    setIsOpen(true)
    setTimeout(onOpen, ENVELOPE_OPEN_MS)
  }, [isOpen, onOpen])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease }}
      className="flex min-h-[45dvh] flex-col items-center justify-center gap-8 px-4 sm:min-h-[50dvh] sm:gap-10 sm:px-6 md:gap-12"
    >
      <Envelope isOpen={isOpen} onClick={handleOpen} />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease }}
        className="font-serif text-pretty text-center text-[clamp(1rem,2vw+0.5rem,1.25rem)] text-text-muted"
      >
        {prompt}
      </motion.p>
    </motion.div>
  )
}
