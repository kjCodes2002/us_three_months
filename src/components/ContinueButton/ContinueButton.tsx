import { motion } from 'framer-motion'
import { Button } from '../Button/Button'
import { useGuardedAction } from '../../hooks/useGuardedAction'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const ease = [0.22, 1, 0.36, 1] as const

interface ContinueButtonProps {
  label: string
  onClick: () => void
  /** When true, skip enter animation (parent handles reveal). */
  staticReveal?: boolean
}

export function ContinueButton({ label, onClick, staticReveal = false }: ContinueButtonProps) {
  const { invoke: handleContinue, isPending } = useGuardedAction(onClick)
  const canHover = useMediaQuery('(hover: hover)')

  const button = (
    <Button
      className="font-serif w-full px-8 py-3.5 text-base tracking-wider transition-shadow duration-500 hover:border-accent/60 hover:bg-accent/15 hover:shadow-[0_0_28px_rgba(201,169,98,0.2)] sm:w-auto"
      disabled={isPending}
      onClick={handleContinue}
    >
      {label}
    </Button>
  )

  if (staticReveal) {
    return (
      <div className="safe-pb flex justify-center pt-2">
        <div className="w-full max-w-md sm:w-auto">{button}</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease }}
      className="safe-pb flex justify-center pt-2"
    >
      <motion.div
        whileHover={isPending || !canHover ? undefined : { y: -2 }}
        transition={{ duration: 0.3, ease }}
        className="w-full max-w-md sm:w-auto"
      >
        {button}
      </motion.div>
    </motion.div>
  )
}
