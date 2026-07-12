import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'border border-accent/40 bg-accent/10 text-accent-soft hover:bg-accent/20 hover:border-accent/60',
  ghost: 'border border-transparent text-text-muted hover:text-text hover:border-border',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', children, className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex min-h-11 touch-manipulation select-none items-center justify-center rounded-sm px-6 py-3 font-body text-sm tracking-wide transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
