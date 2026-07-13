import { chapters } from '../data/chapters'

const STORAGE_KEY = 'us_three_months_reading_progress'

export interface ReadingProgress {
  lastCompletedChapterId: number
}

const EMPTY_PROGRESS: ReadingProgress = { lastCompletedChapterId: 0 }

export function getReadingProgress(): ReadingProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS

    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'lastCompletedChapterId' in parsed &&
      typeof (parsed as ReadingProgress).lastCompletedChapterId === 'number'
    ) {
      const id = (parsed as ReadingProgress).lastCompletedChapterId
      if (id >= 0 && id <= chapters.length) {
        return { lastCompletedChapterId: id }
      }
    }
  } catch {
    // Ignore corrupt storage
  }

  return EMPTY_PROGRESS
}

export function saveChapterCompleted(chapterId: number): void {
  const { lastCompletedChapterId } = getReadingProgress()
  if (chapterId <= lastCompletedChapterId) return

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ lastCompletedChapterId: chapterId } satisfies ReadingProgress),
  )
}

export function hasStartedReading(): boolean {
  return getReadingProgress().lastCompletedChapterId > 0
}

export function hasCompletedAllChapters(): boolean {
  return getReadingProgress().lastCompletedChapterId >= chapters.length
}

export function isChapterUnlocked(chapterId: number): boolean {
  const { lastCompletedChapterId } = getReadingProgress()
  return chapterId <= lastCompletedChapterId + 1
}

export function getResumePath(): string {
  const { lastCompletedChapterId } = getReadingProgress()

  if (lastCompletedChapterId >= chapters.length) {
    return '/final'
  }

  if (lastCompletedChapterId === 0) {
    return '/opening'
  }

  const nextChapter = chapters.find((chapter) => chapter.id === lastCompletedChapterId + 1)
  return nextChapter ? `/chapter/${nextChapter.id}` : '/chapter/1'
}

export function getEntryPath(): string {
  return hasStartedReading() ? getResumePath() : '/opening'
}

export function clearReadingProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}

