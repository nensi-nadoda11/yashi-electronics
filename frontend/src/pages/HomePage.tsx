import { ArrowRight, BadgePercent, MonitorSmartphone, ShieldCheck, Truck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { SectionTitle } from '../components/ui/SectionTitle'
import { buttonStyles } from '../components/ui/button-styles'
import {
  categoryPreviews,
  featuredProducts,
  offerHighlights,
  whyChooseYashi,
} from '../data/mock-data'

const categoryIcons = [MonitorSmartphone, Zap, BadgePercent, ShieldCheck]

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/90 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
                <BadgePercent className="h-4 w-4" />
                Trusted electronics deals, clean pricing, and future-ready checkout
              </div>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
                  Premium electronics shopping designed for speed, trust, and clarity.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Yashi Electronics brings together high-demand devices, household
                  essentials, and a professional customer journey that is ready
                  for upcoming catalog, cart, checkout, invoice, and tracking modules.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/products" className={buttonStyles('primary', 'lg')}>
                  Shop Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/products" className={buttonStyles('outline', 'lg')}>
                  View Offers
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="p-5">
                  <p className="text-sm font-semibold text-brand-600">50+</p>
                  <p className="mt-2 text-lg font-bold text-slate-950">Curated product catalog foundation</p>
                </Card>
                <Card className="p-5">
                  <p className="text-sm font-semibold text-brand-600">GST Ready</p>
                  <p className="mt-2 text-lg font-bold text-slate-950">Invoice-friendly future order flow</p>
                </Card>
                <Card className="p-5">
                  <p className="text-sm font-semibold text-brand-600">Support First</p>
                  <p className="mt-2 text-lg font-bold text-slate-950">Clear contact and order help structure</p>
                </Card>
              </div>
            </div>

            <Card className="relative overflow-hidden p-6 sm:p-8 animate-fade-up delay-1">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.12),transparent_45%)]" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                      Launch Preview
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-950">
                      Electronics storefront foundation
                    </h2>
                  </div>
                  <div className="rounded-3xl bg-slate-950 px-4 py-3 text-right text-white shadow-xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                      Starting at
                    </p>
                    <p className="text-2xl font-bold">₹5,990</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    'Responsive catalog foundation',
                    'Reusable UI blocks for future modules',
                    'Fast-loading lightweight Tailwind theme',
                    'Prepared routing for customer journeys',
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-2xl bg-brand-50 p-2 text-brand-600">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <p className="text-sm leading-6 text-slate-700">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-xl">
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-200">
                    Customer Promise
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <Truck className="h-5 w-5 text-brand-300" />
                      <p className="mt-3 text-sm text-slate-300">Delivery and service placeholders ready for real workflows.</p>
                    </div>
                    <div>
                      <MonitorSmartphone className="h-5 w-5 text-brand-300" />
                      <p className="mt-3 text-sm text-slate-300">Built to expand across devices, categories, and future filters.</p>
                    </div>
                    <div>
                      <BadgePercent className="h-5 w-5 text-brand-300" />
                      <p className="mt-3 text-sm text-slate-300">Prepared for promotional campaigns, offers, and launch banners.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="space-y-8">
          <SectionTitle
            eyebrow="Browse Categories"
            title="Explore the customer-first catalog structure"
            description="A clean category system helps future browsing, filtering, and merchandising stay fast and intuitive."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categoryPreviews.map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length]

              return (
                <Card
                  key={category.name}
                  className="group p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-100"
                >
                  <div className="space-y-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-slate-950">{category.name}</h3>
                      <p className="text-sm leading-6 text-slate-600">{category.description}</p>
                      <p className="text-sm font-medium text-brand-700">{category.accent}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="space-y-8">
          <SectionTitle
            eyebrow="Featured Products"
            title="Popular electronics showcased with reusable product cards"
            description="These static cards set up the visual foundation for future API-driven product listings and merchandising."
            action={
              <Link to="/products" className={buttonStyles('outline', 'md')}>
                View all products
              </Link>
            }
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="space-y-8">
          <SectionTitle
            eyebrow="Why Choose Us"
            title="A professional storefront foundation for a real electronics business"
            description="The interface is tuned for trust, strong spacing, future commerce workflows, and lightweight performance."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {whyChooseYashi.map((item, index) => (
              <Card key={item.title} className="p-7">
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <span className="text-lg font-bold">0{index + 1}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                    <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <Card className="overflow-hidden bg-slate-950 p-8 text-white sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">
                  Offer Banner
                </p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Keep offers visible without overwhelming the experience.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-slate-300">
                  This banner is ready for promotional campaigns, launch sales,
                  financing messages, or seasonal electronics highlights in the next modules.
                </p>
              </div>
              <div className="grid gap-3">
                {offerHighlights.map((offer) => (
                  <div key={offer} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                    {offer}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  )
}
