import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-surface">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,98,0.06)_0%,_transparent_50%)]"
      />
      <div className="relative flex min-h-dvh flex-1 flex-col">{children}</div>
    </div>
  )
}
