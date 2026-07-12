import { motion } from 'framer-motion'
import { lazy, Suspense, useCallback, useReducer, useState } from 'react'
import { getCorrectAnswer, type Chapter } from '../../types/chapter'
import { CHAPTER_STAGES, type ChapterStage } from '../../types/stage'
import { ContinueButton } from '../ContinueButton/ContinueButton'
import { EnvelopeStage } from '../Envelope/EnvelopeStage'
import { Letter } from '../Letter/Letter'
import { LockAnimation } from '../LockAnimation/LockAnimation'
import { UnlockKeyMoment } from '../LockAnimation/UnlockKeyMoment'
import { ChapterProgress } from './ChapterProgress'
import { QuestionCard } from '../QuestionCard/QuestionCard'
import { VoiceNotePlayer } from '../VoiceNote/VoiceNotePlayer'

const ImageCard = lazy(() =>
  import('../ImageCard/ImageCard').then((module) => ({ default: module.ImageCard })),
)

type ChapterAction =
  | { type: 'ANSWER_CORRECT' }
  | { type: 'OPEN_ENVELOPE' }
  | { type: 'LETTER_COMPLETE' }
  | { type: 'VOICE_COMPLETE' }
  | { type: 'IMAGE_COMPLETE' }

function getStageAfterLetter(chapter: Chapter): ChapterStage {
  if (chapter.voiceNote) return CHAPTER_STAGES.VOICE
  if (chapter.image) return CHAPTER_STAGES.IMAGE
  return CHAPTER_STAGES.NEXT
}

function getStageAfterVoice(chapter: Chapter): ChapterStage {
  if (chapter.image) return CHAPTER_STAGES.IMAGE
  return CHAPTER_STAGES.NEXT
}

function chapterReducer(state: ChapterStage, action: ChapterAction, chapter: Chapter): ChapterStage {
  switch (action.type) {
    case 'ANSWER_CORRECT':
      return CHAPTER_STAGES.LOCK
    case 'OPEN_ENVELOPE':
      return CHAPTER_STAGES.LETTER
    case 'LETTER_COMPLETE':
      return getStageAfterLetter(chapter)
    case 'VOICE_COMPLETE':
      return getStageAfterVoice(chapter)
    case 'IMAGE_COMPLETE':
      return CHAPTER_STAGES.NEXT
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

  const [stage, dispatch] = useReducer(
    (state: ChapterStage, action: ChapterAction) => chapterReducer(state, action, chapter),
    CHAPTER_STAGES.QUESTION,
  )

  const handleLetterComplete = useCallback(() => {
    dispatch({ type: 'LETTER_COMPLETE' })
  }, [])

  const handleVoiceComplete = useCallback(() => {
    dispatch({ type: 'VOICE_COMPLETE' })
  }, [])

  const handleImageComplete = useCallback(() => {
    dispatch({ type: 'IMAGE_COMPLETE' })
  }, [])

  const handleEnvelopeOpen = useCallback(() => {
    dispatch({ type: 'OPEN_ENVELOPE' })
  }, [])

  const isRevealStage =
    stage === CHAPTER_STAGES.LETTER ||
    stage === CHAPTER_STAGES.VOICE ||
    stage === CHAPTER_STAGES.IMAGE ||
    stage === CHAPTER_STAGES.NEXT

  const showVoice =
    chapter.voiceNote &&
    (stage === CHAPTER_STAGES.VOICE ||
      stage === CHAPTER_STAGES.IMAGE ||
      stage === CHAPTER_STAGES.NEXT)

  const showImage =
    chapter.image &&
    (stage === CHAPTER_STAGES.IMAGE || stage === CHAPTER_STAGES.NEXT)

  return (
    <article
      aria-label={chapter.title}
      className="safe-px mx-auto flex w-full max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16"
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

      {isRevealStage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8 sm:gap-10 md:gap-14"
        >
          <Letter
            paragraphs={chapter.letter}
            animate={stage === CHAPTER_STAGES.LETTER}
            onComplete={handleLetterComplete}
          />

          {showVoice && (
            <VoiceNotePlayer
              src={chapter.voiceNote!}
              animate={stage === CHAPTER_STAGES.VOICE}
              onComplete={handleVoiceComplete}
            />
          )}

          {showImage && (
            <Suspense
              fallback={
                <div
                  aria-hidden
                  className="mx-auto aspect-[4/3] w-full max-w-lg animate-pulse rounded-lg bg-surface-overlay"
                />
              }
            >
              <ImageCard
                src={chapter.image!}
                animate={stage === CHAPTER_STAGES.IMAGE}
                onComplete={handleImageComplete}
              />
            </Suspense>
          )}

          {stage === CHAPTER_STAGES.NEXT && (
            <ContinueButton label={chapter.buttonText} onClick={onNext} />
          )}
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
  const [phase, setPhase] = useState<'lock' | 'key' | 'envelope'>('lock')

  return (
    <div className="flex min-h-[45dvh] flex-col items-center justify-center sm:min-h-[50dvh]">
      {phase === 'lock' && <LockAnimation onComplete={() => setPhase('key')} />}
      {phase === 'key' && <UnlockKeyMoment onComplete={() => setPhase('envelope')} />}
      {phase === 'envelope' && (
        <EnvelopeStage prompt={chapter.envelopePrompt} onOpen={onEnvelopeOpen} />
      )}
    </div>
  )
}
