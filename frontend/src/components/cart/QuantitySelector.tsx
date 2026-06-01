import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

interface QuantitySelectorProps {
  value: number
  min: number
  max: number
  disabled?: boolean
  onChange: (value: number) => void
  className?: string
}

export function QuantitySelector({
  value,
  min,
  max,
  disabled = false,
  onChange,
  className,
}: QuantitySelectorProps) {
  const effectiveMin = Math.max(1, min)
  const effectiveMax = Math.max(effectiveMin, max)
  const canDecrease = !disabled && value > effectiveMin
  const canIncrease = !disabled && value < effectiveMax

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-sm',
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 w-10 shrink-0 rounded-full p-0 text-slate-800 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        disabled={!canDecrease}
        onClick={() => onChange(Math.max(effectiveMin, value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="h-5 w-5" strokeWidth={2.5} />
      </Button>
      <span
        className={cn(
          'min-w-12 rounded-full px-3 text-center text-base font-semibold text-slate-800',
          disabled ? 'opacity-60' : '',
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 w-10 shrink-0 rounded-full p-0 text-slate-800 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        disabled={!canIncrease}
        onClick={() => onChange(Math.min(effectiveMax, value + 1))}
        aria-label="Increase quantity"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
      </Button>
    </div>
  )
}
