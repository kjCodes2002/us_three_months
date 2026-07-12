import { FloatingParticles } from '../Particles/FloatingParticles'

export function PremiumBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[#0F0F0F]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.07)_0%,transparent_65%)]" />
      <FloatingParticles />
    </div>
  )
}
