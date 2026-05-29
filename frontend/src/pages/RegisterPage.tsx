import { BadgeCheck, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'

export function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer Registration"
        title="Create your Yashi Electronics customer account"
        description="The registration UI is designed for future validation, customer onboarding, and commerce-ready profile creation."
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
              <UserPlus className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-950">Set up your account</h2>
            <form className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input id="register-name" label="Full Name" placeholder="Rahul Sharma" />
              </div>
              <Input id="register-email" type="email" label="Email Address" placeholder="you@example.com" />
              <Input id="register-phone" type="tel" label="Mobile Number" placeholder="+91 98765 43210" />
              <Input id="register-password" type="password" label="Password" placeholder="Create a password" />
              <Input id="register-confirm-password" type="password" label="Confirm Password" placeholder="Repeat your password" />
              <div className="sm:col-span-2 space-y-4">
                <Button className="w-full" variant="secondary" size="lg">
                  Register
                </Button>
                <p className="text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-brand-700 transition hover:text-brand-800">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </Card>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <BadgeCheck className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold text-slate-950">
                Account creation that scales with future commerce features
              </h3>
              <div className="space-y-4">
                {[
                  'Prepare for saved addresses, wishlist sync, and faster checkout.',
                  'Support future profile details for GST invoices and order communication.',
                  'Keep the registration experience clean, lightweight, and mobile friendly.',
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
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
