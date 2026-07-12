import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChapterPage from '../../pages/Chapter'
import Final from '../../pages/Final'
import Landing from '../../pages/Landing'
import Opening from '../../pages/Opening'
import { PageTransition } from './PageTransition'

const ease = [0.22, 1, 0.36, 1] as const

export function AnimatedRoutes() {
  const location = useLocation()
  const isFinal = location.pathname === '/final'

  return (
    <AnimatePresence mode="wait">
      {isFinal ? (
        <motion.div
          key="final"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex min-h-dvh flex-1 flex-col"
        >
          <Routes location={location}>
            <Route path="/final" element={<Final />} />
          </Routes>
        </motion.div>
      ) : (
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/opening" element={<Opening />} />
            <Route path="/chapter/:id" element={<ChapterPage />} />
          </Routes>
        </PageTransition>
      )}
    </AnimatePresence>
  )
}
