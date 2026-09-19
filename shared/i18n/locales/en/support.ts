const support = {
  hero: {
    badge: 'Help Center',
    titlePrefix: 'Platform',
    titleHighlight: 'Support',
    description:
      'Documentation, API references, and direct channels to engineering support.',
  },
  resources: {
    guides: {
      title: 'Guides',
      text: 'Step-by-step tutorials for translation pipelines and campaign cards.',
      action: 'Read Guides',
    },
    apiReference: {
      title: 'API Reference',
      text: 'Typed endpoints, webhook structures, SDKs, and error code maps.',
      action: 'Explore API',
    },
    liveSupport: {
      title: 'Live Support',
      text: 'Priority engineering channels for launch-critical platform teams.',
      action: 'Open Chat',
    },
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Frequent questions',
    items: [
      {
        question: 'How do I generate an API key?',
        answer:
          'Navigate to your dashboard, select Developers, and click Generate Secret. Store this securely because secrets are only shown once.',
      },
      {
        question: 'What is the rate limit?',
        answer:
          'Standard accounts support 1,000 requests per minute. Enterprise accounts receive dedicated throughput pools and custom SLAs.',
      },
      {
        question: 'How do Commerce Cards connect?',
        answer:
          'Cards are provisioned through the REST API, mapped to customer profiles, and can connect with Apple Wallet or Google Pay flows.',
      },
      {
        question: 'Is the platform accessible?',
        answer:
          'Yes. The design system uses semantic markup, visible focus states, ARIA labels, and reduced-motion fallbacks.',
      },
    ],
  },
} as const;

export default support;
