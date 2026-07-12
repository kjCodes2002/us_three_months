import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { saveChapterCompleted } from '../lib/readingProgress'

export function useChapterNavigation(id: string) {
  const navigate = useNavigate()
  const navigatingRef = useRef(false)
  const currentIndex = chapters.findIndex((chapter) => chapter.id === Number(id))

  const goToNext = () => {
    if (navigatingRef.current) return
    navigatingRef.current = true

    const currentChapter = chapters[currentIndex]
    if (currentChapter) {
      saveChapterCompleted(currentChapter.id)
    }

    const nextChapter = chapters[currentIndex + 1]

    if (nextChapter) {
      navigate(`/chapter/${nextChapter.id}`)
      return
    }

    navigate('/final')
  }

  return { goToNext }
}
