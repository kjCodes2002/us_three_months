import { motion } from 'framer-motion'
import { memo, useEffect, useMemo, useState } from 'react'

interface LetterProps {
  paragraphs: string[]
  onComplete: () => void
  animate?: boolean
}

const PARAGRAPH_DELAY = 1200
const ease = [0.22, 1, 0.36, 1] as const

function isSignature(text: string): boolean {
  return /^[—–-]\s/.test(text.trim())
}

function isFullyQuoted(text: string): boolean {
  const trimmed = text.trim()
  return (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  )
}

function renderParagraphText(text: string) {
  const parts = text.split(/("[^"]*"|'[^']*')/g).filter(Boolean)

  if (parts.length === 1) return text

  return parts.map((part, index) =>
    /^["']/.test(part) ? (
      <span key={index} className="text-accent-soft">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

export const Letter = memo(function Letter({ paragraphs, onComplete, animate = true }: LetterProps) {
  const { body, signature } = useMemo(() => {
    if (paragraphs.length === 0) {
      return { body: [], signature: null }
    }

    const last = paragraphs[paragraphs.length - 1]

    if (isSignature(last)) {
      return {
        body: paragraphs.slice(0, -1),
        signature: last,
      }
    }

    return { body: paragraphs, signature: null }
  }, [paragraphs])

  const totalItems = body.length + (signature ? 1 : 0)
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : totalItems)

  useEffect(() => {
    if (!animate) {
      setVisibleCount(totalItems)
      return
    }

    if (visibleCount >= totalItems) {
      const timer = setTimeout(onComplete, 900)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => setVisibleCount((count) => count + 1), PARAGRAPH_DELAY)
    return () => clearTimeout(timer)
  }, [animate, visibleCount, totalItems, onComplete])

  const paragraphClass =
    'font-serif text-pretty text-[clamp(0.9375rem,1.5vw+0.5rem,1.0625rem)] leading-[2] sm:leading-[2.1] md:leading-[2.15]'

  const renderBodyParagraph = (text: string, index: number) => {
    const quoted = isFullyQuoted(text)

    return (
      <motion.p
        key={index}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className={
          quoted
            ? `${paragraphClass} text-accent-soft/95`
            : `${paragraphClass} text-text/95`
        }
      >
        {quoted ? text : renderParagraphText(text)}
      </motion.p>
    )
  }

  const visibleBodyCount = Math.min(visibleCount, body.length)
  const showSignature = signature && visibleCount > body.length

  return (
    <div className="selectable-text mx-auto w-full max-w-[700px] rounded-md border border-border-subtle bg-surface-overlay px-5 py-8 shadow-[0_4px_32px_rgba(0,0,0,0.25)] sm:px-8 sm:py-10 md:px-12 md:py-14">
      <div className="flex flex-col gap-7 sm:gap-8 md:gap-10">
        {body.slice(0, visibleBodyCount).map((paragraph, index) => renderBodyParagraph(paragraph, index))}

        {showSignature && (
          <motion.p
            initial={animate ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="mt-1 border-t border-border-subtle pt-6 text-right font-serif text-[clamp(0.9375rem,1.5vw+0.5rem,1.125rem)] leading-relaxed text-accent-muted italic sm:mt-2 sm:pt-8"
          >
            {signature}
          </motion.p>
        )}
      </div>
    </div>
  )
})
