import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { AnimatedRoutes } from './components/Transition/AnimatedRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  )
}
