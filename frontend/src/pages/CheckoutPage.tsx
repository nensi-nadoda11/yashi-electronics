import { AlertTriangle, CheckCircle2, CreditCard, MapPin, Package, Plus, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionTitle } from '../components/ui/SectionTitle'
import { buttonStyles } from '../components/ui/button-styles'
import { AddressModal } from '../features/address/AddressModal'
import { AddressSelector } from '../features/address/AddressSelector'
import { useAddress } from '../features/address/useAddress'
import { createPendingOrder, getCheckoutSummary } from '../features/checkout/checkout.api'
import type { CheckoutSummaryResponse } from '../features/checkout/checkout.types'
import { getApiErrorMessage } from '../lib/api-client'
import { formatCurrency } from '../utils/format'

const emptyCheckoutSummary: CheckoutSummaryResponse = {
  items: [],
  selectedAddress: null,
  summary: {
    mrpTotal: 0,
    discountAmount: 0,
    subtotal: 0,
    gstAmount: 0,
    deliveryCharge: 0,
    finalAmount: 0,
    totalItems: 0,
  },
  canCheckout: false,
  issues: [],
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const {
    addresses,
    selectedAddress,
    loading: addressLoading,
    error: addressError,
    isMutating: isAddressMutating,
    fetchAddresses,
    addAddress,
    editAddress,
    selectAddress,
  } = useAddress()
  const [checkout, setCheckout] = useState<CheckoutSummaryResponse>(emptyCheckoutSummary)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const selectedAddressId = selectedAddress?.id
  const editingAddress = editingAddressId
    ? addresses.find((address) => address.id === editingAddressId) ?? null
    : null

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

  const fetchSummary = async (addressId?: string) => {
    setSummaryLoading(true)
    setSummaryError(null)

    try {
      const data = await getCheckoutSummary(addressId)
      setCheckout(data)

      if (data.selectedAddress && data.selectedAddress.id !== selectedAddress?.id) {
        selectAddress(data.selectedAddress.id)
      }
    } catch (requestError) {
      setCheckout(emptyCheckoutSummary)
      setSummaryError(getApiErrorMessage(requestError))
    } finally {
      setSummaryLoading(false)
    }
  }

  useEffect(() => {
    void fetchSummary(selectedAddressId)
  }, [selectedAddressId])

  const handleSubmitAddress = async (payload: Parameters<typeof addAddress>[0]) => {
    if (editingAddress) {
      await editAddress(editingAddress.id, payload)
      return
    }

    await addAddress(payload)
  }

  const handleContinueToPayment = async () => {
    if (!selectedAddressId || !checkout.canCheckout || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const data = await createPendingOrder({
        addressId: selectedAddressId,
        paymentMethod: 'online',
      })

      navigate(`/payment/${data.order.id}`, {
        state: {
          orderNumber: data.order.orderNumber,
          totalAmount: data.order.totalAmount,
          paymentStatus: data.payment.status,
        },
      })
    } catch (requestError) {
      setSummaryError(getApiErrorMessage(requestError))
      await fetchSummary(selectedAddressId)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (summaryLoading && checkout.items.length === 0 && addressLoading && addresses.length === 0) {
    return (
      <Container className="py-12">
        <LoadingState
          title="Preparing checkout"
          description="Loading your verified order summary and delivery addresses."
          cardCount={2}
        />
      </Container>
    )
  }

  const canContinue =
    Boolean(selectedAddressId) &&
    checkout.canCheckout &&
    !summaryLoading &&
    !isSubmitting

  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Review your order before payment"
        description="Totals, stock, GST, delivery, and address validity are verified from the backend before the order is created."
      />

      <Container className="pb-16">
        {summaryError && checkout.items.length === 0 ? (
          <ErrorState
            title="Unable to load checkout"
            description={summaryError}
            action={(
              <Button type="button" variant="outline" onClick={() => void fetchSummary(selectedAddressId)}>
                Retry
              </Button>
            )}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <Card className="p-6">
                <SectionTitle
                  eyebrow="Delivery Address"
                  title="Choose where this order should go"
                  description="Address changes refresh the backend checkout summary automatically."
                  action={(
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          void fetchAddresses()
                          void fetchSummary(selectedAddressId)
                        }}
                        disabled={isAddressMutating || summaryLoading}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Refresh
                      </Button>
                      <Button type="button" variant="secondary" size="sm" onClick={openCreateModal}>
                        <Plus className="h-4 w-4" />
                        Add Address
                      </Button>
                    </div>
                  )}
                />

                <div className="mt-6">
                  {addressError && addresses.length === 0 ? (
                    <ErrorState
                      title="Unable to load addresses"
                      description={addressError}
                      action={(
                        <Button type="button" variant="outline" onClick={() => void fetchAddresses()}>
                          Retry
                        </Button>
                      )}
                    />
                  ) : addresses.length === 0 && !addressLoading ? (
                    <EmptyState
                      icon={MapPin}
                      title="No delivery address yet"
                      description="Please add a delivery address before continuing to payment."
                      action={(
                        <Button type="button" variant="secondary" onClick={openCreateModal}>
                          <Plus className="h-4 w-4" />
                          Add Address
                        </Button>
                      )}
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
                        selectedAddressId={selectedAddressId ?? null}
                        onSelect={(addressId) => selectAddress(addressId)}
                        onAdd={openCreateModal}
                        onEdit={(address) => openEditModal(address.id)}
                        isBusy={isAddressMutating || summaryLoading}
                      />
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle
                  eyebrow="Cart Validation"
                  title="Items verified for checkout"
                  description="Pricing, availability, and GST are coming from the backend."
                />

                <div className="mt-6 space-y-4">
                  {summaryLoading && checkout.items.length === 0 ? (
                    <LoadingState
                      title="Checking cart"
                      description="Validating stock and recalculating totals."
                      cardCount={1}
                    />
                  ) : checkout.items.length === 0 ? (
                    <EmptyState
                      icon={Package}
                      title="Your cart is empty"
                      description="Add products to your cart before starting checkout."
                      action={(
                        <Link to="/products" className={buttonStyles('secondary', 'md')}>
                          Browse products
                        </Link>
                      )}
                    />
                  ) : (
                    checkout.items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-lg font-semibold text-slate-950">{item.name}</p>
                              {item.validation.isAvailable ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Attention needed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">
                              {item.brand ?? 'Generic'} · {item.category} · Qty {item.quantity}
                            </p>
                            <p className="text-sm text-slate-500">
                              SKU: {item.sku}
                            </p>
                            {item.validation.message ? (
                              <p className="text-sm font-medium text-rose-700">{item.validation.message}</p>
                            ) : null}
                          </div>

                          <div className="space-y-1 text-right text-sm text-slate-600">
                            <p>MRP: {formatCurrency(item.lineMrpTotal)}</p>
                            <p>Subtotal: {formatCurrency(item.lineSubtotal)}</p>
                            <p>GST: {formatCurrency(item.lineGstAmount)}</p>
                            <p className="text-base font-semibold text-slate-950">
                              Total: {formatCurrency(item.lineTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-brand-600" />
                  <h2 className="text-xl font-bold text-slate-950">Order Summary</h2>
                </div>

                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>MRP Total</span>
                    <span>{formatCurrency(checkout.summary.mrpTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="font-medium text-emerald-700">
                      -{formatCurrency(checkout.summary.discountAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(checkout.summary.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GST</span>
                    <span>{formatCurrency(checkout.summary.gstAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery Charge</span>
                    <span>
                      {checkout.summary.deliveryCharge === 0
                        ? 'Free'
                        : formatCurrency(checkout.summary.deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Items</span>
                    <span>{checkout.summary.totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-950">
                    <span>Final Payable Amount</span>
                    <span>{formatCurrency(checkout.summary.finalAmount)}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle
                  eyebrow="Payment Method"
                  title="Online payment"
                  description="This module creates a pending order and moves to a payment placeholder."
                />

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-3xl border border-brand-200 bg-brand-50/60 p-4">
                  <input type="radio" name="paymentMethod" checked readOnly className="mt-1 h-4 w-4 accent-current" />
                  <div>
                    <p className="font-semibold text-slate-950">Online Payment</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Payment gateway integration will be added in Module 9.
                    </p>
                  </div>
                </label>
              </Card>

              <Card className="p-6">
                <SectionTitle
                  eyebrow="Checkout Status"
                  title="Ready when every check passes"
                  description="We block order creation if the cart, address, or stock state needs attention."
                />

                <div className="mt-5 space-y-3">
                  {summaryError ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {summaryError}
                    </div>
                  ) : null}

                  {checkout.issues.length > 0 ? (
                    <>
                      {checkout.issues.map((issue, index) => (
                        <div
                          key={`${issue.type}-${issue.productId ?? 'general'}-${index}`}
                          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                        >
                          {issue.message}
                        </div>
                      ))}
                      <Link to={checkout.items.length === 0 ? '/products' : '/cart'} className={buttonStyles('outline', 'md')}>
                        {checkout.items.length === 0 ? 'Go to Products' : 'Review Cart'}
                      </Link>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Cart, address, stock, and pricing checks are complete.
                    </div>
                  )}

                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={() => void handleContinueToPayment()}
                    disabled={!canContinue}
                  >
                    {isSubmitting ? 'Creating Order...' : 'Continue to Payment'}
                  </Button>

                  <Link to="/cart" className={`${buttonStyles('ghost', 'md')} w-full`}>
                    Back to Cart
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        )}
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
