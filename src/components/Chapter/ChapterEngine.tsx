import { motion } from 'framer-motion'
import { lazy, Suspense, useCallback, useReducer, useState } from 'react'
import { getCorrectAnswer, type Chapter } from '../../types/chapter'
import { CHAPTER_STAGES, type ChapterStage } from '../../types/stage'
import { ContinueButton } from '../ContinueButton/ContinueButton'
import { EnvelopeStage } from '../Envelope/EnvelopeStage'
import { Letter } from '../Letter/Letter'
import { LockAnimation } from '../LockAnimation/LockAnimation'
import { ChapterProgress } from './ChapterProgress'
import { QuestionCard } from '../QuestionCard/QuestionCard'
import { VoiceNotePlayer } from '../VoiceNote/VoiceNotePlayer'

const ImageCard = lazy(() =>
  import('../ImageCard/ImageCard').then((module) => ({ default: module.ImageCard })),
)

const revealEase = [0.22, 1, 0.36, 1] as const
const REVEAL_DURATION = 0.45

type ChapterAction = { type: 'ANSWER_CORRECT' } | { type: 'OPEN_ENVELOPE' }

function chapterReducer(state: ChapterStage, action: ChapterAction): ChapterStage {
  switch (action.type) {
    case 'ANSWER_CORRECT':
      return CHAPTER_STAGES.LOCK
    case 'OPEN_ENVELOPE':
      return CHAPTER_STAGES.LETTER
    default:
      return state
  }
}

interface ChapterEngineProps {
  chapter: Chapter
  onNext: () => void
}

export function ChapterEngine({ chapter, onNext }: ChapterEngineProps) {
  const correctAnswer = getCorrectAnswer(chapter)

  const [stage, dispatch] = useReducer(chapterReducer, CHAPTER_STAGES.QUESTION)

  const handleEnvelopeOpen = useCallback(() => {
    dispatch({ type: 'OPEN_ENVELOPE' })
  }, [])

  return (
    <article
      aria-label={chapter.title}
      className="safe-px safe-pt safe-pb mx-auto flex w-full min-w-0 max-w-2xl flex-col py-8 sm:py-12 md:py-16"
    >
      <ChapterProgress number={chapter.number} title={chapter.title} />

      {stage === CHAPTER_STAGES.QUESTION && (
        <QuestionCard
          question={chapter.question}
          options={chapter.options}
          correctAnswer={correctAnswer}
          successMessage={chapter.successMessage}
          wrongAnswerMessage={chapter.wrongAnswerMessage}
          onCorrect={() => dispatch({ type: 'ANSWER_CORRECT' })}
        />
      )}

      {stage === CHAPTER_STAGES.LOCK && (
        <LockStage chapter={chapter} onEnvelopeOpen={handleEnvelopeOpen} />
      )}

      {stage === CHAPTER_STAGES.LETTER && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, ease: revealEase }}
          className="flex min-w-0 flex-col gap-8 sm:gap-10 md:gap-14"
        >
          <Letter paragraphs={chapter.letter} />

          {chapter.voiceNote && <VoiceNotePlayer src={chapter.voiceNote} />}

          {chapter.image && (
            <Suspense
              fallback={
                <div
                  aria-hidden
                  className="mx-auto min-h-[300px] w-full max-w-lg rounded-lg bg-surface-overlay animate-pulse"
                />
              }
            >
              <ImageCard src={chapter.image} />
            </Suspense>
          )}

          <ContinueButton label={chapter.buttonText} onClick={onNext} staticReveal />
        </motion.div>
      )}
    </article>
  )
}

interface LockStageProps {
  chapter: Chapter
  onEnvelopeOpen: () => void
}

function LockStage({ chapter, onEnvelopeOpen }: LockStageProps) {
  const [showEnvelope, setShowEnvelope] = useState(false)

  return (
    <div className="flex min-h-[45dvh] flex-col items-center justify-center sm:min-h-[50dvh]">
      {!showEnvelope && <LockAnimation onComplete={() => setShowEnvelope(true)} />}
      {showEnvelope && (
        <EnvelopeStage prompt={chapter.envelopePrompt} onOpen={onEnvelopeOpen} />
      )}
    </div>
  )
}
