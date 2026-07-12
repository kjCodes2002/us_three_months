import { motion } from 'framer-motion'

interface LockProps {
  isLocked: boolean
  size?: 'default' | 'large'
}

const sizeStyles = {
  default: {
    container: 'size-16',
    icon: 'size-7',
  },
  large: {
    container: 'size-28 md:size-32',
    icon: 'size-14 md:size-16',
  },
}

export function Lock({ isLocked, size = 'default' }: LockProps) {
  const styles = sizeStyles[size]

  return (
    <motion.div
      aria-hidden
      data-locked={isLocked}
      initial={{ scale: 1, opacity: 1 }}
      animate={
        isLocked
          ? { scale: 1, opacity: 1, rotate: 0 }
          : { scale: 1.15, opacity: 0, rotate: -12 }
      }
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative inline-flex items-center justify-center ${styles.container}`}
    >
      <div className="absolute inset-0 rounded-full border border-accent/30 bg-surface-raised shadow-[0_0_40px_rgba(201,169,98,0.12)] data-[locked=false]:border-accent/40" />

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={`relative text-accent ${styles.icon}`}
      >
        <motion.path
          d="M7 11V8a5 5 0 0 1 10 0"
          strokeLinecap="round"
          animate={isLocked ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <rect x="5" y="11" width="14" height="10" rx="1.5" />
      </svg>

      {!isLocked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-accent/20"
        />
      )}
    </motion.div>
  )
}
