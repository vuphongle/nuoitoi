const campaigns = {
  // Page titles
  campaigns: 'Campaigns',
  manageYourCampaigns: 'Manage and monitor your advertising campaigns',

  // Actions
  createCampaign: 'Create Campaign',
  editCampaign: 'Edit Campaign',
  deleteCampaign: 'Delete Campaign',
  view: 'View Details',
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
  save: 'Save',
  refresh: 'Refresh',
  export: 'Export',
  pause: 'Pause',
  resume: 'Resume',
  clearFilters: 'Clear filters',

  // Table headers
  campaign: 'Campaign',
  status: 'Status',
  budget: 'Budget',
  spent: 'Spent',
  impressions: 'Impressions',
  clicks: 'Clicks',
  startDate: 'Start Date',
  endDate: 'End Date',
  actions: 'Actions',

  // Status
  status_active: 'Active',
  status_pending: 'Pending',
  status_completed: 'Completed',
  status_paused: 'Paused',
  status_draft: 'Draft',

  // Type
  type: 'Type',
  allTypes: 'All Types',
  type_awareness: 'Awareness',
  type_engagement: 'Engagement',
  type_conversion: 'Conversion',
  type_retention: 'Retention',

  // Filters
  searchCampaigns: 'Search campaigns...',
  allStatus: 'All Status',
  filterByStatus: 'Filter by status',
  filterByType: 'Filter by type',
  allBrands: 'All Brands',
  allAgencies: 'All Agencies',
  filterByBrand: 'Filter by brand',
  filterByAgency: 'Filter by agency',

  // Stats
  activeCampaigns: 'Active',
  totalBudget: 'Total Budget',
  totalImpressions: 'Total Impressions',
  allTime: 'all time',
  averageCtr: 'Average CTR',
  acrossAllCampaigns: 'across all campaigns',
  active: 'Active',

  // Empty state
  noCampaignsFound: 'No campaigns found',
  getStartedByCreating: 'Get started by creating your first campaign',

  // Dialogs
  deleteConfirmation:
    "Are you sure you want to delete the campaign '{name}'? This action cannot be undone.",

  // Messages
  campaignCreated: 'Campaign created successfully',
  campaignUpdated: 'Campaign updated successfully',
  campaignDeleted: 'Campaign deleted successfully',
  campaignPaused: 'Campaign paused',
  campaignResumed: 'Campaign resumed',
} as const;

export default campaigns;
