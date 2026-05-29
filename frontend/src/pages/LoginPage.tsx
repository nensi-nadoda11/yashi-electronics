import { KeyRound, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'

export function LoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer Login"
        title="Sign in to access orders, wishlist, and profile details"
        description="This form is ready for future authentication wiring without changing the visual structure."
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
              <KeyRound className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-950">Welcome back</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Log in to manage your saved items, review past orders, and continue toward a streamlined checkout.
            </p>
            <form className="mt-8 space-y-5">
              <Input id="login-email" type="email" label="Email Address" placeholder="you@example.com" />
              <Input id="login-password" type="password" label="Password" placeholder="Enter your password" />
              <div className="flex items-center justify-between gap-3 text-sm">
                <Link to="/register" className="font-medium text-brand-700 transition hover:text-brand-800">
                  Create account
                </Link>
                <button type="button" className="font-medium text-slate-500 transition hover:text-slate-900">
                  Forgot password?
                </button>
              </div>
              <Button className="w-full" size="lg">
                Login
              </Button>
            </form>
          </Card>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-950">
                  Built for a reliable customer account experience
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  Future modules can plug in auth, secure sessions, order history, invoice downloads, and address books directly into this layout.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  'Access your order history and tracking',
                  'Save products to your wishlist across devices',
                  'Manage profile details and addresses',
                  'Prepare for future GST-ready checkout workflows',
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </>
  )
}
