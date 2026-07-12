import { motion } from 'framer-motion'
import { memo, useEffect, useState } from 'react'

interface ImageCardProps {
  src: string
  onComplete: () => void
  animate?: boolean
}

const ease = [0.22, 1, 0.36, 1] as const

export const ImageCard = memo(function ImageCard({ src, onComplete, animate = true }: ImageCardProps) {
  const [hasCompleted, setHasCompleted] = useState(!animate)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!animate || hasCompleted) return

    const timer = setTimeout(() => {
      setHasCompleted(true)
      onComplete()
    }, 1400)

    return () => clearTimeout(timer)
  }, [animate, hasCompleted, onComplete])

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.96 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease }}
      className="mx-auto w-full max-w-lg overflow-hidden rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[4/3] w-full bg-surface-overlay">
        {!isLoaded && (
          <div aria-hidden className="absolute inset-0 animate-pulse bg-surface-raised" />
        )}
        <img
          src={src}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`h-full w-full rounded-lg object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </motion.div>
  )
})
