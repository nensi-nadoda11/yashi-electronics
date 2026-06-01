import { LogOut, MapPinned, Plus, RotateCcw, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddressCard } from '../features/address/AddressCard'
import { AddressModal } from '../features/address/AddressModal'
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
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useAuth } from '../features/auth/useAuth'

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not available yet'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ProfilePage() {
  const { customer, logout } = useAuth()
  const {
    addresses,
    count,
    loading,
    error,
    isMutating,
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress,
    setDefault,
  } = useAddress()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const editingAddress = editingAddressId
    ? addresses.find((address) => address.id === editingAddressId) ?? null
    : null
  const deleteTarget = deleteTargetId
    ? addresses.find((address) => address.id === deleteTargetId) ?? null
    : null

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

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

  const handleDelete = (addressId: string) => {
    setDeleteError('')
    setDeleteTargetId(addressId)
  }

  const closeDeleteDialog = () => {
    setDeleteTargetId(null)
    setDeleteError('')
  }

  const handleSubmitAddress = async (payload: Parameters<typeof addAddress>[0]) => {
    if (editingAddress) {
      await editAddress(editingAddress.id, payload)
      return
    }

    await addAddress(payload)
  }

  return (
    <>
      <PageHeader
        eyebrow="Customer Profile"
        title="Manage account details and saved addresses"
        description="Review your registered customer details and keep delivery addresses up to date."
        actions={
          <Button type="button" variant="secondary" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        }
      />

      <Container className="grid gap-6 pb-16 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white">
              <UserRound className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                Customer account
              </p>
              <h2 className="text-3xl font-bold text-slate-950">{customer?.fullName}</h2>
              <p className="text-sm text-slate-600">{customer?.email}</p>
              <p className="text-sm text-slate-600">{customer?.mobile ?? 'Mobile not added yet'}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Account Status</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {customer?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Last Login</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {formatDate(customer?.lastLoginAt ?? null)}
              </p>
            </div>
            <button
              type="button"
              className={`${buttonStyles('danger', 'md')} w-full`}
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            eyebrow="Saved Addresses"
            title="Delivery address book"
            description="Add, edit, delete, or set a default delivery address."
            action={
              <Button type="button" variant="outline" onClick={() => void fetchAddresses()} disabled={loading}>
                <RotateCcw className="h-4 w-4" />
                Refresh
              </Button>
            }
          />

          <div className="mt-6">
            {loading && addresses.length === 0 ? (
              <LoadingState
                title="Loading addresses"
                description="Fetching your saved delivery addresses."
                cardCount={2}
              />
            ) : error && addresses.length === 0 ? (
              <ErrorState
                title="Unable to load addresses"
                description={error}
                action={
                  <Button type="button" variant="outline" onClick={() => void fetchAddresses()}>
                    Retry
                  </Button>
                }
              />
            ) : addresses.length === 0 ? (
              <EmptyState
                icon={MapPinned}
                title="No addresses found"
                description="Add a delivery address to get started."
                action={
                  <Button type="button" variant="secondary" onClick={openCreateModal}>
                    <Plus className="h-4 w-4" />
                    Add Address
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <div className="grid gap-4">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={() => openEditModal(address.id)}
                      onDelete={() => handleDelete(address.id)}
                      onSetDefault={() => {
                        void setDefault(address.id).catch(() => undefined)
                      }}
                      isBusy={isMutating}
                      showDelete
                      showSetDefault
                    />
                  ))}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <MapPinned className="h-5 w-5 text-brand-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Saved addresses</p>
                      <p className="text-lg font-semibold text-slate-950">
                        {count} {count === 1 ? 'address' : 'addresses'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-5">
            <Link to="/orders" className={buttonStyles('ghost', 'md')}>
              View Recent Orders
            </Link>
          </div>
        </Card>
      </Container>

      <AddressModal
        isOpen={isAddressModalOpen}
        mode={editingAddress ? 'edit' : 'create'}
        address={editingAddress}
        onClose={closeAddressModal}
        onSubmit={(payload) => handleSubmitAddress(payload)}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete this address?"
        description="This address will be removed from your saved delivery list."
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        error={deleteError}
        isLoading={isMutating}
        onCancel={closeDeleteDialog}
        onConfirm={async () => {
          if (!deleteTarget) {
            return
          }

          setDeleteError('')

          try {
            await removeAddress(deleteTarget.id)
            closeDeleteDialog()
          } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'Unable to delete address')
          }
        }}
      />
    </>
  )
}
