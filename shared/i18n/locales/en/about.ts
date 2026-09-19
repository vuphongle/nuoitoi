const about = {
  hero: {
    badge: 'Company',
    titlePrefix: 'Built to feel',
    titleHighlight: 'alive',
    description:
      'We are a product design and engineering studio turning content, commerce, and AI translation into connected digital experiences.',
  },
  missionVision: {
    eyebrow: 'Mission / Vision',
    title: 'Make systems memorable',
    visionTitle: 'Vision',
    visionDesc:
      'Digital infrastructure should carry brand energy, not hide behind generic dashboards.',
    missionTitle: 'Mission',
    missionDesc:
      'Build accessible, resilient product layers that make every campaign, workflow, and API interaction feel intentional.',
  },
  timeline: {
    eyebrow: 'Timeline',
    title: 'From assistant to ecosystem',
    items: [
      {
        year: '2022',
        title: 'Prototype',
        description:
          'Started with a small translation assistant and a question: what if business cards were programmable?',
      },
      {
        year: '2023',
        title: 'Platform',
        description:
          'Unified translation, campaign cards, and workflow automation into one product operating layer.',
      },
      {
        year: '2024',
        title: 'Scale',
        description:
          'Expanded into API-first infrastructure for teams shipping multilingual growth systems.',
      },
      {
        year: '2026',
        title: 'Studio',
        description:
          'Launched the new design language: high-contrast creative direction with production-grade product foundations.',
      },
    ],
  },
  team: {
    eyebrow: 'Team',
    title: 'A compact senior squad',
    roles: ['Design System Architects', 'Frontend Engineers', 'Platform Strategists'],
  },
  values: {
    eyebrow: 'Values',
    title: 'Principles that ship',
    items: [
      {
        title: 'Momentum',
        description: 'We move fast without making the interface feel disposable.',
      },
      {
        title: 'Trust',
        description: 'Security, accessibility, and stable foundations are part of the brand.',
      },
      {
        title: 'Partnership',
        description: 'Product strategy, design craft, and engineering decisions stay connected.',
      },
    ],
  },
  techStack: {
    eyebrow: 'Tech Stack',
    title: 'Built for speed and scale',
    items: [
      { title: 'Next.js', description: 'App Router architecture' },
      { title: 'Tailwind CSS', description: 'Semantic CSS variables' },
      { title: 'Framer Motion', description: 'Kinetic reveal layers' },
    ],
  },
} as const;

export default about;
