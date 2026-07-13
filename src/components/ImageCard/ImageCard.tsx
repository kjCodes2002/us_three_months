import { memo, useState } from 'react'

interface ImageCardProps {
  src: string
}

export const ImageCard = memo(function ImageCard({ src }: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg overflow-hidden rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.35)] bg-surface-overlay">
      <div className="relative w-full flex items-center justify-center">
        {!isLoaded && (
          <div aria-hidden className="absolute inset-0 min-h-[300px] animate-pulse bg-surface-raised rounded-lg" />
        )}
        <img
          src={src}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto max-h-[70vh] rounded-lg object-contain transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  )
})
