export type CatalogCategoryNode = {
  name: string
  slug: string
  children: CatalogCategoryNode[]
}

export const catalogNavigation: CatalogCategoryNode[] = [
  {
    name: 'Basic Electronic Components',
    slug: 'basic-electronic-components',
    children: [
      { name: 'Resistor', slug: 'resistor', children: [] },
      { name: 'Capacitor', slug: 'capacitor', children: [] },
      { name: 'Inductor', slug: 'inductor', children: [] },
      { name: 'Transformer', slug: 'transformer', children: [] },
      { name: 'Diode', slug: 'diode', children: [] },
      { name: 'LED (Light Emitting Diode)', slug: 'led-light-emitting-diode', children: [] },
      { name: 'Zener Diode', slug: 'zener-diode', children: [] },
      { name: 'Transistor', slug: 'transistor', children: [] },
      { name: 'Relay', slug: 'relay', children: [] },
      { name: 'Fuse', slug: 'fuse', children: [] },
      { name: 'Switch', slug: 'switch', children: [] },
      { name: 'Push Button', slug: 'push-button', children: [] },
      { name: 'Potentiometer', slug: 'potentiometer', children: [] },
      { name: 'Crystal Oscillator', slug: 'crystal-oscillator', children: [] },
    ],
  },
  {
    name: 'Integrated Circuits (ICs)',
    slug: 'integrated-circuits',
    children: [
      { name: 'Timer IC', slug: 'timer-ic', children: [] },
      { name: 'Op-Amp IC', slug: 'op-amp-ic', children: [] },
      { name: 'Microcontroller', slug: 'microcontroller', children: [] },
      { name: 'Microprocessor', slug: 'microprocessor', children: [] },
      { name: 'Logic IC', slug: 'logic-ic', children: [] },
      { name: 'Voltage Regulator IC', slug: 'voltage-regulator-ic', children: [] },
      { name: 'Memory IC', slug: 'memory-ic', children: [] },
    ],
  },
  {
    name: 'Power Supply Components',
    slug: 'power-supply-components',
    children: [
      { name: 'Battery', slug: 'battery', children: [] },
      { name: 'SMPS (Switch Mode Power Supply)', slug: 'smps-switch-mode-power-supply', children: [] },
      { name: 'Adapter', slug: 'adapter', children: [] },
      { name: 'Voltage Regulator', slug: 'voltage-regulator', children: [] },
      { name: 'Rectifier', slug: 'rectifier', children: [] },
      { name: 'Inverter', slug: 'inverter', children: [] },
      { name: 'UPS Components', slug: 'ups-components', children: [] },
    ],
  },
  {
    name: 'Display Components',
    slug: 'display-components',
    children: [
      { name: 'LCD Display', slug: 'lcd-display', children: [] },
      { name: 'LED Display', slug: 'led-display', children: [] },
      { name: 'OLED Display', slug: 'oled-display', children: [] },
      { name: 'Seven Segment Display', slug: 'seven-segment-display', children: [] },
      { name: 'Touch Screen', slug: 'touch-screen', children: [] },
    ],
  },
  {
    name: 'Sensors',
    slug: 'sensors',
    children: [
      { name: 'Temperature Sensor', slug: 'temperature-sensor', children: [] },
      { name: 'Motion Sensor', slug: 'motion-sensor', children: [] },
      { name: 'IR Sensor', slug: 'ir-sensor', children: [] },
      { name: 'Ultrasonic Sensor', slug: 'ultrasonic-sensor', children: [] },
      { name: 'Gas Sensor', slug: 'gas-sensor', children: [] },
      { name: 'Light Sensor', slug: 'light-sensor', children: [] },
      { name: 'Humidity Sensor', slug: 'humidity-sensor', children: [] },
    ],
  },
  {
    name: 'Connectors & Wiring',
    slug: 'connectors-and-wiring',
    children: [
      { name: 'USB Connector', slug: 'usb-connector', children: [] },
      { name: 'HDMI Connector', slug: 'hdmi-connector', children: [] },
      { name: 'Terminal Block', slug: 'terminal-block', children: [] },
      { name: 'Jumper Wire', slug: 'jumper-wire', children: [] },
      { name: 'Ribbon Cable', slug: 'ribbon-cable', children: [] },
      { name: 'PCB Connector', slug: 'pcb-connector', children: [] },
    ],
  },
  {
    name: 'Audio Components',
    slug: 'audio-components',
    children: [
      { name: 'Speaker', slug: 'speaker', children: [] },
      { name: 'Microphone', slug: 'microphone', children: [] },
      { name: 'Buzzer', slug: 'buzzer', children: [] },
      { name: 'Amplifier Module', slug: 'amplifier-module', children: [] },
    ],
  },
  {
    name: 'Communication Modules',
    slug: 'communication-modules',
    children: [
      { name: 'Wi-Fi Module', slug: 'wi-fi-module', children: [] },
      { name: 'Bluetooth Module', slug: 'bluetooth-module', children: [] },
      { name: 'GSM Module', slug: 'gsm-module', children: [] },
      { name: 'GPS Module', slug: 'gps-module', children: [] },
      { name: 'RF Module', slug: 'rf-module', children: [] },
    ],
  },
  {
    name: 'Computer & PCB Components',
    slug: 'computer-and-pcb-components',
    children: [
      { name: 'Printed Circuit Board (PCB)', slug: 'printed-circuit-board-pcb', children: [] },
      { name: 'Breadboard', slug: 'breadboard', children: [] },
      { name: 'Heat Sink', slug: 'heat-sink', children: [] },
      { name: 'Cooling Fan', slug: 'cooling-fan', children: [] },
      { name: 'Soldering Wire', slug: 'soldering-wire', children: [] },
      { name: 'IC Socket', slug: 'ic-socket', children: [] },
    ],
  },
  {
    name: 'Industrial Electronics Components',
    slug: 'industrial-electronics-components',
    children: [
      { name: 'PLC', slug: 'plc', children: [] },
      { name: 'HMI Display', slug: 'hmi-display', children: [] },
      { name: 'Contactor', slug: 'contactor', children: [] },
      { name: 'Circuit Breaker', slug: 'circuit-breaker', children: [] },
      { name: 'Servo Motor Driver', slug: 'servo-motor-driver', children: [] },
      { name: 'VFD (Variable Frequency Drive)', slug: 'vfd-variable-frequency-drive', children: [] },
    ],
  },
]

const findNodeBySlug = (nodes: CatalogCategoryNode[], slug: string): CatalogCategoryNode | undefined => {
  for (const node of nodes) {
    if (node.slug === slug) {
      return node
    }

    const childMatch = findNodeBySlug(node.children, slug)
    if (childMatch) {
      return childMatch
    }
  }

  return undefined
}

export const getCategoryLabel = (slug?: string | null) => {
  if (!slug) {
    return 'All'
  }

  const node = findNodeBySlug(catalogNavigation, slug)
  return node?.name ?? slug
}

export const getMainCategoryForSlug = (slug?: string | null) => {
  if (!slug) {
    return undefined
  }

  return catalogNavigation.find(
    (category) => category.slug === slug || category.children.some((child) => child.slug === slug),
  )
}

export const getCategoryFilterSlugs = (slug: string) => {
  const mainCategory = catalogNavigation.find((category) => category.slug === slug)

  if (!mainCategory) {
    return [slug]
  }

  return mainCategory.children.map((child) => child.slug)
}

export const getLeafCategorySlugs = () =>
  catalogNavigation.flatMap((category) => category.children.map((child) => child.slug))
