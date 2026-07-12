import { useMemo } from 'react'
import { chapters } from '../data/chapters'
import type { Chapter } from '../types/chapter'

export function useChapter(id: string | undefined): Chapter | undefined {
  return useMemo(() => {
    if (!id) return undefined
    return chapters.find((chapter) => chapter.id === Number(id))
  }, [id])
}
