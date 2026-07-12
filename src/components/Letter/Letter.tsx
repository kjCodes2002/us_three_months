import { memo, useEffect, useMemo, useRef } from 'react'

interface LetterProps {
  paragraphs: string[]
}

const SCROLL_MARGIN_PX = 16

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

function isLetterTopVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return rect.top >= SCROLL_MARGIN_PX && rect.top < window.innerHeight - SCROLL_MARGIN_PX
}

export const Letter = memo(function Letter({ paragraphs }: LetterProps) {
  const letterRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const element = letterRef.current
    if (!element) return

    const frame = requestAnimationFrame(() => {
      if (!isLetterTopVisible(element)) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [paragraphs])

  const paragraphClass =
    'font-serif text-pretty break-words text-[clamp(0.9375rem,1.5vw+0.5rem,1.0625rem)] leading-[2] sm:leading-[2.1] md:leading-[2.15]'

  return (
    <div
      ref={letterRef}
      className="selectable-text scroll-mt-safe mx-auto w-full min-w-0 max-w-[700px] rounded-md border border-border-subtle bg-surface-overlay px-5 py-8 shadow-[0_4px_32px_rgba(0,0,0,0.25)] sm:px-8 sm:py-10 md:px-12 md:py-14"
    >
      <div className="flex flex-col gap-7 sm:gap-8 md:gap-10">
        {body.map((paragraph, index) => {
          const quoted = isFullyQuoted(paragraph)

          return (
            <p
              key={index}
              className={
                quoted
                  ? `${paragraphClass} text-accent-soft/95`
                  : `${paragraphClass} text-text/95`
              }
            >
              {quoted ? paragraph : renderParagraphText(paragraph)}
            </p>
          )
        })}

        {signature && (
          <p className="mt-1 border-t border-border-subtle pt-6 text-right font-serif text-[clamp(0.9375rem,1.5vw+0.5rem,1.125rem)] leading-relaxed text-accent-muted italic sm:mt-2 sm:pt-8">
            {signature}
          </p>
        )}
      </div>
    </div>
  )
})
