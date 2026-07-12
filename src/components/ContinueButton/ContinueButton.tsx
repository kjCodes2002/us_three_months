import { motion } from 'framer-motion'
import { Button } from '../Button/Button'
import { useGuardedAction } from '../../hooks/useGuardedAction'

const ease = [0.22, 1, 0.36, 1] as const

interface ContinueButtonProps {
  label: string
  onClick: () => void
}

export function ContinueButton({ label, onClick }: ContinueButtonProps) {
  const { invoke: handleContinue, isPending } = useGuardedAction(onClick)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease }}
      className="flex justify-center pt-2"
    >
      <motion.div
        whileHover={isPending ? undefined : { y: -2 }}
        transition={{ duration: 0.3, ease }}
        className="w-full max-w-md sm:w-auto"
      >
        <Button
          className="font-serif w-full px-8 py-3.5 text-base tracking-wider transition-shadow duration-500 hover:border-accent/60 hover:bg-accent/15 hover:shadow-[0_0_28px_rgba(201,169,98,0.2)] sm:w-auto"
          disabled={isPending}
          onClick={handleContinue}
        >
          {label}
        </Button>
      </motion.div>
    </motion.div>
  )
}
