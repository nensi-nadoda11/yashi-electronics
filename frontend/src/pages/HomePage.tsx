import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Grid2x2,
  Headphones,
  MonitorSmartphone,
  RotateCcw,
  ShieldCheck,
  Speaker,
  Truck,
} from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { SectionTitle } from '../components/ui/SectionTitle'
import { buttonStyles } from '../components/ui/button-styles'
import firstHeroImage from '../assets/first image.png'
import secondHeroImage from '../assets/second image.png'
import thirdHeroImage from '../assets/third image.png'
import { products as showcaseProducts } from '../data/mock-data'

type HeroSlide = {
  eyebrow: string
  titleLead: string
  titleAccent: string
  description: string
  primaryAction: {
    label: string
    href: string
  }
  accentClass: string
  featureClass: string
  image: string
  imageAlt: string
}

const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'Premium quality, trusted performance',
    titleLead: 'Powering Your Ideas',
    titleAccent: 'with Quality Components',
    description: 'Browse reliable electronics for homes, workshops, and business builds.',
    primaryAction: {
      label: 'Shop Now',
      href: '/products',
    },
    accentClass: 'from-brand-50 via-white to-brand-100',
    featureClass: 'text-brand-700',
    image: firstHeroImage,
    imageAlt: 'Electronics components collage',
  },
  {
    eyebrow: 'New arrivals, ready to ship',
    titleLead: 'Built for Faster',
    titleAccent: 'Upgrades and Repairs',
    description: 'Fresh components for powering up projects without slowing down the workflow.',
    primaryAction: {
      label: 'View New Arrivals',
      href: '/products?sort=newest',
    },
    accentClass: 'from-emerald-50 via-white to-sky-100',
    featureClass: 'text-emerald-700',
    image: secondHeroImage,
    imageAlt: 'Electronics bulk and business supplies collage',
  },
  {
    eyebrow: 'Bulk orders and special offers',
    titleLead: 'Smarter Purchasing',
    titleAccent: 'for Teams and Businesses',
    description: 'Scale confidently with clean pricing, dependable stock, and easy browsing.',
    primaryAction: {
      label: 'View Offers',
      href: '/products?sort=discount_high_to_to',
    },
    accentClass: 'from-amber-50 via-white to-brand-100',
    featureClass: 'text-amber-700',
    image: thirdHeroImage,
    imageAlt: 'Electronics offer and procurement collage',
  },
]

const featureHighlights = [
  { icon: Grid2x2, title: 'Wide Product Range', value: '1000+ Products' },
  { icon: BadgeCheck, title: 'Best Price Guarantee', value: 'Competitive Pricing' },
  { icon: Truck, title: 'Fast & Reliable Delivery', value: 'Pan India Shipping' },
  { icon: ShieldCheck, title: 'Secure Payments', value: '100% Safe Checkout' },
  { icon: RotateCcw, title: 'Easy Returns', value: '7 Days Return Policy' },
  { icon: Headphones, title: 'Customer Support', value: 'Mon - Sat 10AM - 7PM' },
]

const categoryCards = [
  { name: 'Power Supply Components', slug: 'power-supply-components', icon: BatteryCharging },
  { name: 'Integrated Circuits (ICs)', slug: 'integrated-circuits', icon: Cpu },
  { name: 'Display Components', slug: 'display-components', icon: MonitorSmartphone },
  { name: 'Sensors', slug: 'sensors', icon: BadgeCheck },
  { name: 'Connectors & Wiring', slug: 'connectors-and-wiring', icon: Truck },
  { name: 'Audio Components', slug: 'audio-components', icon: Speaker },
  { name: 'All Categories', slug: null, icon: Grid2x2 },
] as const

const brandLogos = [
  'Panasonic',
  'Philips',
  'Schneider Electric',
  'Mean Well',
  'ST',
  'Texas Instruments',
  'Microchip',
  'Yashi',
]

const trustCards = [
  {
    title: 'Who We Are',
    icon: Grid2x2,
    text: 'A focused electronics store built for serious buyers.',
  },
  {
    title: 'Quality Assurance',
    icon: ShieldCheck,
    text: 'Original products and dependable listings throughout.',
  },
  {
    title: 'Our Mission',
    icon: Sparkles,
    text: 'Keep the catalog clear, useful, and easy to shop.',
  },
  {
    title: 'Need Help?',
    icon: Headphones,
    text: 'Reach support quickly when you need a hand.',
  },
]

export function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const brandTrackRef = useRef<HTMLDivElement | null>(null)

  const slide = heroSlides[activeSlide]

  const scrollBrandTrack = (offset: number) => {
    brandTrackRef.current?.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <main className="pb-6">
      <Container className="pt-4">
        <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,#eef4ff_0%,#ffffff_48%,#dbeafe_100%)] px-4 py-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.28)] sm:px-6 sm:py-4 lg:px-8 lg:py-5">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setActiveSlide((value) => (value - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setActiveSlide((value) => (value + 1) % heroSlides.length)}
            className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5 animate-fade-up">
              <Badge variant="brand" className="w-fit">
                {slide.eyebrow}
              </Badge>

              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  {slide.titleLead}{' '}
                  <span className="text-brand-600">{slide.titleAccent}</span>
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600">
                  {slide.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to={slide.primaryAction.href} className={buttonStyles('secondary', 'lg')}>
                  {slide.primaryAction.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  { icon: BadgeCheck, label: '100% Original Products' },
                  { icon: ShieldCheck, label: 'Secure Payments' },
                  { icon: Truck, label: 'Fast Shipping' },
                ].map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                    >
                      <Icon className={`h-4 w-4 ${slide.featureClass}`} />
                      {item.label}
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center gap-2 pl-1">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition ${
                      index === activeSlide ? 'w-8 bg-brand-600' : 'w-2.5 bg-slate-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[620px]">
              <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${slide.accentClass}`} />
              <div className="relative z-0 overflow-hidden rounded-[34px] border border-white/70 bg-white/80 p-4 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className="h-[360px] w-full object-contain object-center sm:h-[410px] lg:h-[470px]"
                />
              </div>
            </div>
          </div>
        </section>
      </Container>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureHighlights.map((item) => {
              const Icon = item.icon

              return (
                <Card key={item.title} className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {item.title}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-950">{item.value}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="categories" className="py-8 sm:py-10">
        <Container className="space-y-6">
          <SectionTitle
            title="Shop by Categories"
            action={
              <Link to="/products" className={buttonStyles('ghost', 'md')}>
                View All Categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {categoryCards.map((category, index) => {
              const Icon = category.icon
              const isAllCategories = category.slug === null
              const href = isAllCategories
                ? '/products'
                : `/products?category=${encodeURIComponent(category.slug)}`

              return (
                <Link key={category.name} to={href}>
                  <Card className="group h-full p-4 transition duration-300 hover:-translate-y-1 hover:border-brand-100">
                    <div className="flex h-full flex-col items-center text-center">
                      <div
                        className={`flex aspect-square w-full items-center justify-center rounded-[28px] ${
                          isAllCategories
                            ? 'bg-brand-50 text-brand-700'
                            : index % 2 === 0
                              ? 'bg-slate-50 text-slate-700'
                              : 'bg-brand-50 text-brand-700'
                        }`}
                      >
                        <Icon className="h-9 w-9" />
                      </div>
                      <p className="mt-4 text-sm font-semibold leading-6 text-slate-950">
                        {category.name}
                      </p>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="best-sellers" className="py-8 sm:py-10">
        <Container className="space-y-6">
          <SectionTitle
            title="Best Selling Products"
            action={
              <Link to="/products" className={buttonStyles('ghost', 'md')}>
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {showcaseProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-10">
        <Container className="space-y-6">
          <SectionTitle title="Top Brands You Can Trust" />

          <div className="relative">
            <button
              type="button"
              aria-label="Scroll brands left"
              onClick={() => scrollBrandTrack(-320)}
              className="absolute left-0 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={brandTrackRef}
              className="scrollbar-hidden mx-14 flex items-center gap-3 overflow-x-auto py-1"
            >
              {brandLogos.map((brand) => (
                <div
                  key={brand}
                  className="inline-flex min-w-[150px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm font-bold tracking-wide text-brand-700 shadow-sm"
                >
                  {brand}
                </div>
              ))}
            </div>

            <button
              type="button"
              aria-label="Scroll brands right"
              onClick={() => scrollBrandTrack(320)}
              className="absolute right-0 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustCards.map((item) => {
              const Icon = item.icon

              return (
                <Card key={item.title} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>
    </main>
  )
}
