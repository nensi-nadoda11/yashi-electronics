import type {
  Address,
  CartItem,
  CategoryPreview,
  CustomerProfile,
  Order,
  Product,
} from '../types/store'

export const categoryPreviews: CategoryPreview[] = [
  {
    name: 'Smartphones',
    description: 'Flagship and value-driven devices for work, gaming, and travel.',
    accent: 'From 5G essentials to premium launch models',
  },
  {
    name: 'Laptops',
    description: 'Portable performance for professionals, students, and creators.',
    accent: 'Thin-and-light, gaming, and office-ready machines',
  },
  {
    name: 'TV & Audio',
    description: 'Immersive home entertainment with crisp visuals and bold sound.',
    accent: 'Smart TVs, soundbars, earbuds, and party speakers',
  },
  {
    name: 'Appliances',
    description: 'Efficient everyday electronics built for modern Indian homes.',
    accent: 'Kitchen, comfort, and productivity upgrades',
  },
]

export const products: Product[] = [
  {
    id: 1,
    name: 'Astra X5 5G Smartphone',
    brand: 'Astra',
    category: 'Smartphones',
    shortDescription: 'AMOLED display, fast charging, and triple-camera flexibility.',
    description:
      'Astra X5 blends dependable daily performance with a vivid AMOLED panel, a reliable all-day battery, and a polished camera setup for work and entertainment.',
    price: 28999,
    mrp: 34999,
    rating: 4.6,
    reviews: 184,
    stockStatus: 'In Stock',
    tags: ['5G', 'AMOLED', 'Fast Charge'],
    delivery: 'Free delivery by tomorrow in select PIN codes.',
    heroLabel: '6.7" AMOLED | 120Hz | 67W charging',
    specs: [
      { label: 'Display', value: '6.7-inch AMOLED, 120Hz refresh rate' },
      { label: 'Processor', value: 'Octa-core 5G chipset' },
      { label: 'Memory', value: '8GB RAM + 256GB storage' },
      { label: 'Camera', value: '50MP + 8MP + 2MP rear, 32MP front' },
      { label: 'Battery', value: '5000mAh with 67W fast charging' },
    ],
  },
  {
    id: 2,
    name: 'VoltBook Air 14',
    brand: 'Volt',
    category: 'Laptops',
    shortDescription: 'Lightweight business laptop with balanced battery life.',
    description:
      'VoltBook Air 14 is built for professionals who need dependable performance, clean video calls, and a sleek chassis that is easy to carry every day.',
    price: 55990,
    mrp: 64990,
    rating: 4.5,
    reviews: 96,
    stockStatus: 'In Stock',
    tags: ['Work', 'SSD', 'Office Ready'],
    delivery: 'Standard delivery within 2-4 business days.',
    heroLabel: '14" FHD | 16GB RAM | 512GB SSD',
    specs: [
      { label: 'Display', value: '14-inch Full HD anti-glare display' },
      { label: 'Processor', value: 'Intel Core i5 class processor' },
      { label: 'Memory', value: '16GB RAM + 512GB NVMe SSD' },
      { label: 'Battery', value: 'Up to 10 hours typical usage' },
      { label: 'Weight', value: '1.38kg lightweight design' },
    ],
  },
  {
    id: 3,
    name: 'NeoSound Beam 500',
    brand: 'NeoSound',
    category: 'TV & Audio',
    shortDescription: 'Compact soundbar with wireless subwoofer and clear vocals.',
    description:
      'NeoSound Beam 500 adds cinematic punch to your living room while keeping dialogue crisp for daily TV, OTT content, and sports broadcasts.',
    price: 12990,
    mrp: 16990,
    rating: 4.4,
    reviews: 72,
    stockStatus: 'Limited Stock',
    tags: ['Dolby Audio', 'Bluetooth', 'Home Theater'],
    delivery: 'Installation assistance available after purchase.',
    heroLabel: '320W output | Wireless subwoofer | HDMI ARC',
    specs: [
      { label: 'Channels', value: '2.1 channel soundbar system' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, HDMI ARC, Optical, USB' },
      { label: 'Output', value: '320W total sound output' },
      { label: 'Modes', value: 'Movie, Music, News, Sports presets' },
      { label: 'In the Box', value: 'Soundbar, subwoofer, remote, wall kit' },
    ],
  },
  {
    id: 4,
    name: 'PixelView QLED 55',
    brand: 'PixelView',
    category: 'TV & Audio',
    shortDescription: '4K smart TV with vivid panel and voice-enabled remote.',
    description:
      'PixelView QLED 55 offers rich colors, slim bezels, and a familiar smart TV experience for streaming, gaming, and family viewing.',
    price: 46990,
    mrp: 57990,
    rating: 4.7,
    reviews: 143,
    stockStatus: 'In Stock',
    tags: ['4K', 'QLED', 'Smart TV'],
    delivery: 'Free wall-mount installation in metro cities.',
    heroLabel: '55" 4K QLED | HDR10+ | Voice remote',
    specs: [
      { label: 'Panel', value: '55-inch 4K QLED display' },
      { label: 'Resolution', value: '3840 x 2160 Ultra HD' },
      { label: 'OS', value: 'Smart TV platform with OTT app support' },
      { label: 'Audio', value: '30W speaker output with surround tuning' },
      { label: 'Ports', value: '3 HDMI, 2 USB, Wi-Fi, Bluetooth' },
    ],
  },
  {
    id: 5,
    name: 'CoolFlow Inverter AC 1.5 Ton',
    brand: 'CoolFlow',
    category: 'Appliances',
    shortDescription: 'Energy-efficient cooling with stabilizer-free operation.',
    description:
      'CoolFlow Inverter AC keeps rooms comfortable during peak summer while helping manage electricity costs with energy-conscious compressor tuning.',
    price: 38990,
    mrp: 45990,
    rating: 4.3,
    reviews: 58,
    stockStatus: 'In Stock',
    tags: ['Inverter', '5 Star', 'Smart Diagnostics'],
    delivery: 'Installation slot selection available at checkout.',
    heroLabel: '5 Star | Copper condenser | Smart diagnostics',
    specs: [
      { label: 'Capacity', value: '1.5 Ton inverter split AC' },
      { label: 'Energy Rating', value: '5 Star efficiency' },
      { label: 'Condenser', value: '100% copper with anti-corrosion coating' },
      { label: 'Cooling Modes', value: 'Turbo, Eco, Sleep, Dry' },
      { label: 'Warranty', value: '10 years compressor warranty' },
    ],
  },
  {
    id: 6,
    name: 'SparkBuds Pro',
    brand: 'Spark',
    category: 'TV & Audio',
    shortDescription: 'Noise cancellation and long battery in a pocketable design.',
    description:
      'SparkBuds Pro is tuned for calls and commuting with strong active noise cancellation, compact ergonomics, and quick device pairing.',
    price: 5990,
    mrp: 7990,
    rating: 4.2,
    reviews: 211,
    stockStatus: 'In Stock',
    tags: ['ANC', 'True Wireless', 'Quick Pair'],
    delivery: 'Same-day dispatch on prepaid orders.',
    heroLabel: 'ANC | 36-hour battery | Quad mic ENC',
    specs: [
      { label: 'Audio', value: 'Dynamic drivers with deep bass tuning' },
      { label: 'Battery', value: 'Up to 36 hours with charging case' },
      { label: 'Noise Control', value: 'Active noise cancellation + transparency' },
      { label: 'Calls', value: 'Quad microphone with ENC' },
      { label: 'Durability', value: 'IPX5 sweat and splash resistance' },
    ],
  },
]

export const featuredProducts = products.slice(0, 4)

export const cartItems: CartItem[] = [
  { productId: 1, quantity: 1 },
  { productId: 2, quantity: 1 },
  { productId: 6, quantity: 2 },
]

export const wishlistItems = [products[3], products[4], products[2]].filter(
  Boolean,
) as Product[]

export const orders: Order[] = [
  {
    id: 'YE-10482',
    placedOn: '24 May 2026',
    amount: 46990,
    items: 1,
    orderStatus: 'Shipped',
    paymentStatus: 'Paid',
  },
  {
    id: 'YE-10439',
    placedOn: '15 May 2026',
    amount: 12990,
    items: 1,
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
  },
  {
    id: 'YE-10398',
    placedOn: '04 May 2026',
    amount: 55990,
    items: 1,
    orderStatus: 'Processing',
    paymentStatus: 'Pending',
  },
]

export const addresses: Address[] = [
  {
    id: 1,
    label: 'Home',
    name: 'Rahul Sharma',
    line1: '221, Palm Residency',
    line2: 'Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201309',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Office',
    name: 'Rahul Sharma',
    line1: '4th Floor, Tech Axis Tower',
    line2: 'Electronic City Phase 1',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560100',
    phone: '+91 98765 43210',
  },
]

export const customerProfile: CustomerProfile = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  company: 'Sharma Retail Ventures',
  gstin: '09ABCDE1234F1Z5',
  memberSince: 'January 2024',
}

export const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Cart', href: '/cart' },
  { label: 'Orders', href: '/orders' },
]

export const supportLinks = [
  { label: 'Shipping Information', href: '/checkout' },
  { label: 'Track Orders', href: '/orders' },
  { label: 'Account Settings', href: '/profile' },
  { label: 'Customer Login', href: '/login' },
]

export const whyChooseYashi = [
  {
    title: 'Trusted Electronics Curation',
    description:
      'A practical catalog focused on genuine products, dependable brands, and transparent offers.',
  },
  {
    title: 'Invoice-Ready Shopping',
    description:
      'Future-ready order flows designed to support GST billing, delivery updates, and clean records.',
  },
  {
    title: 'Responsive Support Experience',
    description:
      'Support-first shopping with quick access to order help, warranty guidance, and account assistance.',
  },
]

export const offerHighlights = [
  'Weekend exchange offers on select smartphones',
  'No-cost EMI placeholder for future payment integrations',
  'Business purchases ready for invoice-oriented checkout flows',
]
