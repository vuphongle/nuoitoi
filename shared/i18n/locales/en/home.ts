const home = {
  hero: {
    eyebrow: 'A next-generation product studio',
    titlePrefix: 'Digital',
    titleHighlight: 'Products',
    titleSuffix: 'With Gravity',
    description:
      'Raw creative energy, disciplined product architecture, and conversion-focused digital systems.',
    explore: 'Explore Platform',
    contact: 'Get In Touch',
  },
  marquee: {
    items: ['Digital Products', 'Creative Agency', 'SaaS Platform', 'Design System'],
  },
  about: {
    eyebrow: 'About',
    title: 'Brutal outside. Precise inside.',
    description:
      'Card Platform turns loud creative positioning into stable product systems: APIs, customer portals, analytics surfaces, and reusable design primitives.',
    cardBadge: 'Original synthesis',
    cardTitle: 'Agency energy, platform discipline.',
    stats: {
      stat1: { value: '99%', label: 'Lighthouse Score', text: 'Optimized delivery' },
      stat2: { value: '0px', label: 'Layout Shift', text: 'Stable bento grids' },
      stat3: { value: '16ms', label: 'Frame Budget', text: 'Smooth motion system' },
    },
  },
  featuredProducts: {
    eyebrow: 'Featured Products',
    title: 'Platform modules with teeth',
    items: {
      aiTranslate: {
        title: 'AI Translate',
        category: 'AI',
        description:
          'Real-time multilingual translation for products, support centers, and document-heavy workflows.',
        metrics: '120+ Languages',
      },
      commerceCards: {
        title: 'Commerce Cards',
        category: 'Cards',
        description:
          'Programmable campaign and loyalty cards with wallet-ready experiences and brand token controls.',
        metrics: '4.8x Activation',
      },
      documentFlow: {
        title: 'Document Flow',
        category: 'Automation',
        description:
          'Classify, translate, approve, and route sensitive business documents across teams.',
        metrics: '72% Faster',
      },
    },
  },
  services: {
    eyebrow: 'Services',
    title: 'Reusable system blocks',
    items: {
      bentoGrids: {
        title: 'Bento Grids',
        description: 'Precision CSS Grid architectures engineered for content clarity.',
      },
      kineticMotion: {
        title: 'Kinetic Motion',
        description:
          'Scroll-linked animations, spring physics, and stagger layers powered by Framer Motion.',
      },
      glassSurfaces: {
        title: 'Glass Surfaces',
        description:
          'Backdrop blur, soft radial glows, and elevation tokens built for dark-mode-first platforms.',
      },
      serverBoundaries: {
        title: 'Server Boundaries',
        description: 'App Router foundations designed to keep interactive effects isolated and reusable.',
      },
    },
  },
  clients: {
    eyebrow: 'Clients',
    title: 'Trusted by teams shipping fast',
  },
  testimonials: {
    eyebrow: 'Testimonials',
    title: 'Signal from builders',
    items: [
      {
        quote:
          'The design language is unapologetically bold. It takes the best of creative agency portfolios and makes it usable for SaaS.',
        name: 'Sarah Jenkins',
        role: 'Product Designer',
      },
      {
        quote:
          "Finally, a platform that doesn't look like another generic template. The motion design feels tactile and responsive.",
        name: 'Marcus Chen',
        role: 'Frontend Lead',
      },
    ],
  },
} as const;

export default home;
