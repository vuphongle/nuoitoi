const products = {
  hero: {
    badge: 'Capabilities',
    titlePrefix: 'Platform',
    titleHighlight: 'Products',
    description:
      'From enterprise API primitives to no-code campaign blocks. An architecture built for scale.',
  },
  searchPlaceholder: 'Search platform products...',
  categories: {
    all: 'All',
    ai: 'AI',
    cards: 'Cards',
    automation: 'Automation',
    developer: 'Developer',
    security: 'Security',
  },
  empty: {
    title: 'No products found',
    description: 'Try adjusting your search query or category filter.',
  },
  dialog: {
    featured: 'Featured',
    keyMetric: 'Key Metric',
    close: 'Close',
  },
  items: {

    aiTranslate: {
      title: 'AI Translate',
      category: 'AI',
      description:
        'Real-time text, voice, and document translation with enterprise controls.',
      metrics: '120+ Languages',
    },
    commerceCards: {
      title: 'Commerce Cards',
      category: 'Cards',
      description:
        'Programmable campaign cards, loyalty cards, and embedded wallet experiences.',
      metrics: '4.8x Activation',
    },
    documentFlow: {
      title: 'Document Flow',
      category: 'Automation',
      description:
        'Upload, classify, translate, and route business documents through secure workflows.',
      metrics: '72% Faster',
    },
    apiCore: {
      title: 'API Core',
      category: 'Developer',
      description:
        'A typed API layer for translation, card issuing, identity, and analytics events.',
      metrics: '99.99% Uptime',
    },
    riskShield: {
      title: 'Risk Shield',
      category: 'Security',
      description:
        'Policy checks, audit trails, and fraud detection for high-volume digital operations.',
      metrics: 'SOC2 Ready',
    },
    insightEngine: {
      title: 'Insight Engine',
      category: 'AI',
      description:
        'Behavioral segmentation, content recommendations, and campaign intelligence.',
      metrics: '38% Lift',
    },
    creativeStudio: {
      title: 'Creative Studio',
      category: 'Cards',
      description:
        'No-code card creation with design tokens, brand rules, and conversion presets.',
      metrics: 'Minutes to Ship',
    },
  },
  status: {
    active: 'Active',
    draft: 'Draft',
    archived: 'Archived',
  },
  admin: {
    list: {
      eyebrow: 'Content category',
      title: 'Manage products',
      description: 'Manage products, translations, categories, status, and display order.',
      addProduct: 'Add product',
      commandSearchPlaceholder: 'Search products by title or slug',
      toolbarSearchPlaceholder: 'Search title, slug...',
      searchAriaLabel: 'Search products',
      filterCategoryAriaLabel: 'Filter by category',
      filterStatusAriaLabel: 'Filter by status',
      filterFeaturedAriaLabel: 'Filter featured products',
      allCategories: 'All categories',
      allStatuses: 'All statuses',
      statusPlaceholder: 'Status',
      featuredPlaceholder: 'Featured',
      allFeatured: 'All products',
      featuredOnly: 'Featured',
      normal: 'Normal',
      metrics: {
        total: 'Total products',
        totalTrend: 'Based on current data',
        active: 'Active',
        drafts: 'Drafts',
        categories: 'Categories',
        categoriesTrend: 'Categories available',
        pageTrend: 'On this page',
      },
      table: {
        product: 'Product',
        category: 'Category',
        metrics: 'Metrics',
        order: 'Order',
        status: 'Status',
        updatedAt: 'Updated',
        actions: 'Actions',
        featured: 'Featured',
      },
      status: {
        active: 'Active',
        draft: 'Draft',
        archived: 'Archived',
      },
      rowActionsTrigger: 'Open actions for {{slug}}',
      deleteLabel: 'Delete product',
      pageOf: 'Page {{page}} / {{totalPages}}',
      listTitle: 'Product list',
      listDescription: 'Showing {{shown}} of {{total}} products',
      listDescriptionFallback: 'Current product data',
      loadError: 'Unable to load the product list.',
      emptyFilteredTitle: 'No matching products found',
      emptyTitle: 'No products yet',
      emptyFilteredDescription: 'Try adjusting or clearing the filters to see more results.',
      emptyDescription: 'Create your first product to start managing content.',
      deleteConfirmTitle: 'Delete product',
      deleteConfirmDescription:
        'Are you sure you want to delete the product "{{title}}"? This action cannot be undone.',
      deleteConfirmButton: 'Delete product',
      deleteSuccess: 'Product deleted successfully!',
      deleteError: 'An error occurred while deleting the product',
    },
    categoryPage: {
      title: 'Product categories',
      description: 'Manage the categories used to classify platform solutions and products.',
      emptyTitle: 'No product categories yet',
      deleteTitle: 'Delete product category',
      deleteDescription:
        'Are you sure you want to delete the category "{{name}}"? This action cannot be undone.',
      deleteSuccess: 'Product category deleted successfully!',
      deleteError: 'An error occurred while deleting the product category',
    },
  },
} as const;

export default products;
