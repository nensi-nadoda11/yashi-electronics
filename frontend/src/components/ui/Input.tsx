import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  hint?: string
  error?: string
}

export function Input({ className, label, hint, error, id, required, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700" htmlFor={id}>
      {label ? (
        <span>
          {label}
          {required ? <span className="ml-1 text-rose-600">*</span> : null}
        </span>
      ) : null}
      <input
        id={id}
        className={cn(
          'h-12 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:ring-4',
          error
            ? 'border-rose-300 focus:border-rose-300 focus:ring-rose-100'
            : 'border-slate-200 focus:border-brand-300 focus:ring-brand-100',
          className,
        )}
        aria-invalid={error ? 'true' : 'false'}
        required={required}
        {...props}
      />
      {error ? <span className="text-xs font-normal text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs font-normal text-slate-500">{hint}</span> : null}
    </label>
  )
}
