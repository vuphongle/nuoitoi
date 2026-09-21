const feedbacks = {
  pageEyebrow: 'Customer care',
  pageTitle: 'Feedbacks',
  pageDescription:
    'Review and manage suggestions, bug reports, and compliments submitted by users.',
  addFeedback: 'Add feedback',
  commandSearchPlaceholder: 'Search feedback by name or title',
  toolbarSearchPlaceholder: 'Search by name, title...',
  searchAriaLabel: 'Search feedback',
  rowActionsTrigger: 'Open actions for {{title}}',
  deleteLabel: 'Delete feedback',
  table: {
    sender: 'Sender',
    type: 'Type',
    title: 'Title',
    createdAt: 'Submitted at',
    actions: 'Actions',
  },
  metrics: {
    total: 'Total feedback',
    totalTrend: 'Based on system data',
    bugs: 'Bug reports',
    featureRequests: 'Feature requests',
    pageTrend: 'On this page',
  },
  listTitle: 'Feedback list',
  listDescription: '{{count}} feedback entries available',
  loadError: 'Unable to load the feedback list.',
  emptyFilteredTitle: 'No feedback found',
  emptyTitle: 'No feedback yet',
  emptyFilteredDescription: 'Try another keyword or clear the search.',
  emptyDescription: 'Feedback submitted by users will show up here.',
  deleteConfirmTitle: 'Delete feedback',
  deleteConfirmDescription:
    'Are you sure you want to delete the feedback "{{title}}"? This action cannot be undone.',
  deleteConfirmButton: 'Delete feedback',
  deleteSuccess: 'Feedback deleted successfully!',
  deleteError: 'An error occurred while deleting the feedback',
} as const;

export default feedbacks;
