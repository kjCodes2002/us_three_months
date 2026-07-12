import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

interface EnvelopeProps {
  isOpen: boolean
  onClick?: () => void
}

export function Envelope({ isOpen, onClick }: EnvelopeProps) {
  return (
    <motion.button
      type="button"
      aria-label={isOpen ? undefined : 'Open envelope'}
      disabled={isOpen}
      onClick={onClick}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={isOpen ? undefined : { y: -3, scale: 1.01 }}
      transition={{ duration: 1, ease }}
      className="relative mx-auto aspect-[4/3] w-full max-w-[min(100%,20rem)] touch-manipulation overflow-hidden rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-default sm:max-w-xs md:max-w-sm"
      style={{ perspective: 900 }}
    >
      <div className="absolute inset-x-0 bottom-0 h-[72%] rounded-md border border-border bg-[#161412] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(201,169,98,0.06)]" />

      <motion.div
        animate={{ rotateX: isOpen ? 180 : 0 }}
        transition={{ duration: 1.1, ease }}
        style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
        className="absolute inset-x-0 top-[28%] h-[44%] rounded-t-md border border-border bg-[#1e1b16]"
      />

      <div className="pointer-events-none absolute inset-x-0 top-[28%] mx-auto h-0 w-0 border-x-[50%] border-x-transparent border-b-[28%] border-b-[#1e1b16]" />

      {!isOpen && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="pointer-events-none absolute top-[36%] left-1/2 z-10 size-11 -translate-x-1/2 rounded-full border border-[#5a1818]/70 bg-[#7a2228] shadow-[0_4px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] md:size-13"
        >
          <div className="absolute inset-[4px] rounded-full border border-[#4a1414]/60" />
          <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9a3038]/80" />
        </motion.div>
      )}
    </motion.button>
  )
}
