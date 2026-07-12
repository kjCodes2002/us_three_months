export interface Chapter {
  id: number
  number: number
  title: string
  question: string
  options: string[]
  correctAnswerIndex: number
  successMessage: string
  wrongAnswerMessage: string
  envelopePrompt: string
  letter: string[]
  image?: string
  voiceNote?: string
  buttonText: string
}

export function getCorrectAnswer(chapter: Chapter): string {
  return chapter.options[chapter.correctAnswerIndex]
}
