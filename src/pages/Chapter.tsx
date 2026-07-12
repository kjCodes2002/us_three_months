import { Navigate, useParams } from 'react-router-dom'
import { PremiumBackground } from '../components/Background/PremiumBackground'
import { ChapterEngine } from '../components/Chapter/ChapterEngine'
import { useChapter } from '../hooks/useChapter'
import { useChapterNavigation } from '../hooks/useChapterNavigation'
import { getResumePath, isChapterUnlocked } from '../lib/readingProgress'

export default function ChapterPage() {
  const { id } = useParams<{ id: string }>()
  const chapter = useChapter(id)
  const { goToNext } = useChapterNavigation(id ?? '')

  if (!chapter) {
    return <Navigate to="/" replace />
  }

  if (!isChapterUnlocked(chapter.id)) {
    return <Navigate to={getResumePath()} replace />
  }

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col overflow-x-hidden">
      <PremiumBackground />
      <div className="safe-pb relative z-10 flex min-w-0 flex-1 flex-col">
        <ChapterEngine chapter={chapter} onNext={goToNext} />
      </div>
    </main>
  )
}
