import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-950 text-white shadow-lg shadow-slate-950/10 hover:-translate-y-0.5 hover:bg-slate-800',
  secondary:
    'bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 hover:bg-brand-600',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950',
  danger:
    'border border-rose-200 bg-rose-50 text-rose-600 hover:-translate-y-0.5 hover:bg-rose-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm sm:text-[15px]',
  lg: 'h-12 px-6 text-sm sm:text-base',
}

export const buttonStyles = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
) =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:pointer-events-none disabled:opacity-60',
    variantStyles[variant],
    sizeStyles[size],
  )
