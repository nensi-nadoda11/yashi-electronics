import { Headphones, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { quickLinks, supportLinks } from '../../data/mock-data'
import { Container } from '../ui/Container'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-200">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
              Yashi Electronics
            </p>
            <h2 className="text-3xl font-bold text-white">
              Customer-first electronics shopping built for confidence.
            </h2>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              Explore premium electronics, clean pricing, and a dependable
              customer experience prepared for future checkout, invoices, and
              order tracking workflows.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="grid gap-3 text-sm text-slate-400">
              {quickLinks.map((link) => (
                <Link key={link.label} to={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Customer Support</h3>
            <div className="grid gap-3 text-sm text-slate-400">
              {supportLinks.map((link) => (
                <Link key={link.label} to={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="grid gap-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-300" />
                <span>Showroom and fulfilment contact details will be mapped here.</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-300" />
                <span>+91 98XXX XXXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-300" />
                <span>support@yashielectronics.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Headphones className="h-4 w-4 text-brand-300" />
                <span>Mon-Sat, 10:00 AM to 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Yashi Electronics. All rights reserved.</p>
          <p>Professional customer storefront foundation for future eCommerce modules.</p>
        </div>
      </Container>
    </footer>
  )
}
