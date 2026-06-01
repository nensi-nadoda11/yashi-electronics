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
        'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm',
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 w-9 shrink-0 rounded-full p-0 text-slate-800 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        disabled={!canDecrease}
        onClick={() => onChange(Math.max(effectiveMin, value - 1))}
        aria-label="Decrease quantity"
      >
        <span className="text-3xl leading-none font-light" aria-hidden="true">
          −
        </span>
      </Button>
      <span
        className={cn(
          'min-w-10 rounded-full px-2.5 text-center text-sm font-semibold text-slate-800',
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
        className="h-9 w-9 shrink-0 rounded-full p-0 text-slate-800 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        disabled={!canIncrease}
        onClick={() => onChange(Math.min(effectiveMax, value + 1))}
        aria-label="Increase quantity"
      >
        <span className="text-3xl leading-none font-light" aria-hidden="true">
          +
        </span>
      </Button>
    </div>
  )
}
