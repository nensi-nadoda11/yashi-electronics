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
        'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-2',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 rounded-full p-0"
        disabled={!canDecrease}
        onClick={() => onChange(Math.max(effectiveMin, value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span
        className={cn(
          'min-w-10 rounded-full px-2 text-center text-sm font-semibold text-slate-700',
          disabled ? 'opacity-60' : '',
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 rounded-full p-0"
        disabled={!canIncrease}
        onClick={() => onChange(Math.min(effectiveMax, value + 1))}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
