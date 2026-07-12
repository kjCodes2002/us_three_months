export const CHAPTER_STAGES = {
  QUESTION: 'QUESTION',
  LOCK: 'LOCK',
  LETTER: 'LETTER',
  VOICE: 'VOICE',
  IMAGE: 'IMAGE',
  NEXT: 'NEXT',
} as const

export type ChapterStage = (typeof CHAPTER_STAGES)[keyof typeof CHAPTER_STAGES]
