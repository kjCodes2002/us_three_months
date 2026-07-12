import { useRef, useState } from 'react'

interface VoiceNotePlayerProps {
  src: string
}

export function VoiceNotePlayer({ src }: VoiceNotePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    void audio.play()
    setIsPlaying(true)
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg rounded-md border border-border-subtle bg-surface-overlay px-5 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)] sm:px-6 sm:py-5">
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
          onClick={togglePlay}
          className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent-soft outline-none transition-colors duration-300 hover:border-accent/60 hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-overlay"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="0.5" />
              <rect x="14" y="5" width="4" height="14" rx="0.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 translate-x-0.5" aria-hidden>
              <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.5-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
            </svg>
          )}
        </button>

        <div className="flex flex-col gap-1">
          <p className="font-serif text-sm tracking-wide text-text">Voice note</p>
          <p className="font-serif text-xs text-text-muted">Tap to listen</p>
        </div>
      </div>
    </div>
  )
}
