import { FileText, LogOut, MapPinned, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { addresses, customerProfile, orders } from '../data/mock-data'

export function ProfilePage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer Profile"
        title="Manage account details and shopping preferences"
        description="This profile dashboard is ready for future account editing, saved addresses, invoices, and security settings."
      />

      <Container className="grid gap-6 pb-16 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white">
              <UserRound className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                Member since {customerProfile.memberSince}
              </p>
              <h2 className="text-3xl font-bold text-slate-950">{customerProfile.name}</h2>
              <p className="text-sm text-slate-600">{customerProfile.email}</p>
              <p className="text-sm text-slate-600">{customerProfile.phone}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Company</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {customerProfile.company}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">GSTIN Placeholder</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {customerProfile.gstin}
              </p>
            </div>
            <button type="button" className={`${buttonStyles('danger', 'md')} w-full`}>
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-950">Account Details</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Primary Email', value: customerProfile.email },
                { label: 'Mobile Number', value: customerProfile.phone },
                { label: 'Preferred Billing', value: 'GST invoice ready placeholder' },
                { label: 'Recent Order', value: orders[0]?.id ?? 'No orders yet' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <MapPinned className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-950">Saved Addresses</h2>
            </div>
            <div className="mt-5 grid gap-4">
              {addresses.map((address) => (
                <div key={address.id} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">{address.label}</h3>
                    {address.isDefault ? <Badge variant="brand">Default</Badge> : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {address.name}, {address.line1}, {address.line2}, {address.city},{' '}
                    {address.state} - {address.pincode}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/orders" className={`${buttonStyles('outline', 'md')} mt-5`}>
              View Recent Orders
            </Link>
          </Card>
        </div>
      </Container>
    </>
  )
}
