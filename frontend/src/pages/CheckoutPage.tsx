import { CreditCard, MapPin, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddressModal } from '../features/address/AddressModal'
import { AddressSelector } from '../features/address/AddressSelector'
import { useAddress } from '../features/address/useAddress'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionTitle } from '../components/ui/SectionTitle'
import { buttonStyles } from '../components/ui/button-styles'
import { useCart } from '../features/cart/useCart'
import { formatCurrency } from '../utils/format'

export function CheckoutPage() {
  const {
    items,
    summary,
    count: cartCount,
    isLoading: cartLoading,
    error: cartError,
    fetchCart,
  } = useCart()
  const {
    addresses,
    selectedAddress,
    loading: addressLoading,
    error: addressError,
    isMutating,
    fetchAddresses,
    addAddress,
    editAddress,
    selectAddress,
  } = useAddress()
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const selectedAddressId = selectedAddress?.id ?? null
  const editingAddress = editingAddressId
    ? addresses.find((address) => address.id === editingAddressId) ?? null
    : null
  const canContinue = Boolean(selectedAddress)

  const openCreateModal = () => {
    setEditingAddressId(null)
    setIsAddressModalOpen(true)
  }

  const openEditModal = (addressId: string) => {
    setEditingAddressId(addressId)
    setIsAddressModalOpen(true)
  }

  const closeAddressModal = () => {
    setIsAddressModalOpen(false)
    setEditingAddressId(null)
  }

  const handleSubmitAddress = async (payload: Parameters<typeof addAddress>[0]) => {
    if (editingAddress) {
      await editAddress(editingAddress.id, payload)
      return
    }

    await addAddress(payload)
  }

  if ((cartLoading && items.length === 0) || (addressLoading && addresses.length === 0)) {
    return (
      <Container className="py-12">
        <LoadingState
          title="Preparing checkout"
          description="Loading your cart and delivery addresses."
          cardCount={2}
        />
      </Container>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Select your delivery address"
        description="Pick a saved address for this order. Payment and order placement will come in the next module."
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card className="p-6">
              <SectionTitle
                eyebrow="Delivery Address"
                title="Address selector"
                description="Choose the address that should receive this checkout."
                action={
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void fetchAddresses()}
                      disabled={isMutating}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Refresh
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={openCreateModal}
                    >
                      <Plus className="h-4 w-4" />
                      Add Address
                    </Button>
                  </div>
                }
              />

              <div className="mt-6">
                {addressError && addresses.length === 0 ? (
                  <ErrorState
                    title="Unable to load addresses"
                    description={addressError}
                    action={
                      <Button type="button" variant="outline" onClick={() => void fetchAddresses()}>
                        Retry
                      </Button>
                    }
                  />
                ) : addresses.length === 0 ? (
                  <EmptyState
                    icon={MapPin}
                    title="No addresses found"
                    description="Please add a delivery address."
                    action={
                      <Button type="button" variant="secondary" onClick={openCreateModal}>
                        <Plus className="h-4 w-4" />
                        Add Address
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {addressError ? (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {addressError}
                      </div>
                    ) : null}

                    <AddressSelector
                      addresses={addresses}
                      selectedAddressId={selectedAddressId}
                      onSelect={(addressId) => selectAddress(addressId)}
                      onAdd={openCreateModal}
                      onEdit={(address) => openEditModal(address.id)}
                      isBusy={isMutating}
                    />
                  </div>
                )}
              </div>
            </Card>

            {cartError ? (
              <Card className="border-rose-100 bg-rose-50/70 p-4 text-sm text-rose-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p>{cartError}</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => void fetchCart()}>
                    Retry
                  </Button>
                </div>
              </Card>
            ) : null}
          </div>

          <Card className="h-fit p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-950">Order Summary</h2>
            </div>

            <div className="mt-5 space-y-4">
              {items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                  Your cart is empty.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartItemId} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.product.name}</p>
                      <p className="text-sm text-slate-500">
                        Qty {item.quantity} - {item.product.brand ?? 'Generic'}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST</span>
                <span>{formatCurrency(summary.gstAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <span>{summary.deliveryCharge === 0 ? 'Free' : formatCurrency(summary.deliveryCharge)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-slate-950">
                <span>Total Payable</span>
                <span>{formatCurrency(summary.finalAmount)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brand-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-500">Selected address</p>
                  {selectedAddress ? (
                    <div className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                      <p className="font-semibold text-slate-950">{selectedAddress.fullName}</p>
                      <p>{selectedAddress.mobile}</p>
                      <p>
                        {selectedAddress.addressLine1}
                        {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
                      </p>
                      <p>
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">Please add a delivery address.</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`${buttonStyles('primary', 'lg')} mt-6 w-full`}
              disabled={!canContinue}
            >
              Continue
            </button>

            <Link to="/cart" className={`${buttonStyles('ghost', 'md')} mt-3 w-full`}>
              Back to Cart
            </Link>
          </Card>
        </div>
      </Container>

      <AddressModal
        isOpen={isAddressModalOpen}
        mode={editingAddress ? 'edit' : 'create'}
        address={editingAddress}
        onClose={closeAddressModal}
        onSubmit={(payload) => handleSubmitAddress(payload)}
      />
    </>
  )
}
