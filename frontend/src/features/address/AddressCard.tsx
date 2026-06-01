import { Pencil, Star, Trash2 } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { cn } from '../../utils/cn'
import type { Address } from './address.types'

type AddressCardProps = {
  address: Address
  selected?: boolean
  selectable?: boolean
  onSelect?: (addressId: string) => void
  onEdit?: (address: Address) => void
  onDelete?: (address: Address) => void
  onSetDefault?: (address: Address) => void
  isBusy?: boolean
  showDelete?: boolean
  showSetDefault?: boolean
}

export function AddressCard({
  address,
  selected = false,
  selectable = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isBusy = false,
  showDelete = false,
  showSetDefault = false,
}: AddressCardProps) {
  return (
    <Card
      className={cn(
        'p-5 transition',
        selected ? 'border-brand-200 bg-brand-50/40 shadow-[0_18px_60px_-35px_rgba(59,130,246,0.45)]' : 'border-slate-200',
        selectable && !isBusy ? 'cursor-pointer hover:border-brand-200 hover:bg-brand-50/20' : '',
      )}
      onClick={() => {
        if (selectable && onSelect && !isBusy) {
          onSelect(address.id)
        }
      }}
    >
      <div className="flex items-start gap-4">
        {selectable ? (
          <input
            type="radio"
            checked={selected}
            onChange={() => onSelect?.(address.id)}
            disabled={isBusy}
            className="mt-1 h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-300"
            aria-label={`Select ${address.fullName}`}
          />
        ) : null}

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-950">{address.fullName}</h3>
            {address.isDefault ? <Badge variant="brand">Default</Badge> : null}
            {selected ? <Badge variant="success">Selected</Badge> : null}
          </div>

          <div className="space-y-1 text-sm leading-6 text-slate-600">
            <p>{address.mobile}</p>
            <p>
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''}
            </p>
            <p>
              {address.city}, {address.state} - {address.pincode}
            </p>
            {address.landmark ? <p>Landmark: {address.landmark}</p> : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {onEdit ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={(event) => {
                  event.stopPropagation()
                  onEdit(address)
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            ) : null}

            {showSetDefault && !address.isDefault && onSetDefault ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isBusy}
                onClick={(event) => {
                  event.stopPropagation()
                  onSetDefault(address)
                }}
              >
                <Star className="h-4 w-4" />
                Set Default
              </Button>
            ) : null}

            {showDelete && onDelete ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={isBusy}
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete(address)
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  )
}
