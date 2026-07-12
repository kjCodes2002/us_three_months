import { memo, useState } from 'react'

interface ImageCardProps {
  src: string
}

export const ImageCard = memo(function ImageCard({ src }: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg overflow-hidden rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
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
    </div>
  )
})
