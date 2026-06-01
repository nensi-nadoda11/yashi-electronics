import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Card } from '../../components/ui/Card'
import type { Address } from './address.types'
import { AddressCard } from './AddressCard'

type AddressSelectorProps = {
  addresses: Address[]
  selectedAddressId: string | null
  onSelect: (addressId: string) => void
  onAdd: () => void
  onEdit: (address: Address) => void
  isBusy?: boolean
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onAdd,
  onEdit,
  isBusy = false,
}: AddressSelectorProps) {
  if (addresses.length === 0) {
    return (
      <EmptyState
        icon={Plus}
        title="No addresses found"
        description="Add a delivery address to continue."
        action={
          <Button type="button" variant="secondary" onClick={onAdd} disabled={isBusy}>
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onAdd} disabled={isBusy}>
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selectable
            selected={address.id === selectedAddressId}
            onSelect={onSelect}
            onEdit={onEdit}
            isBusy={isBusy}
          />
        ))}
      </div>

      <Card className="border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Select one delivery address to continue.
      </Card>
    </div>
  )
}
