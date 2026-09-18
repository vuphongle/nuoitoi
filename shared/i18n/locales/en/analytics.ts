const analytics = {
  title: 'Analytics',
  subtitle: 'Track your website performance and user engagement.',
  stats: {
    totalViews: 'Total Views',
    uniqueVisitors: 'Unique Visitors',
    avgSession: 'Avg. Session',
    bounceRate: 'Bounce Rate',
    fromLastMonth: 'from last month',
  },
  tabs: {
    overview: 'Overview',
    topPages: 'Top Pages',
    trafficSources: 'Traffic Sources',
  },
  weeklyTrends: 'Weekly Trends',
  weeklyTrendsDesc: 'Views and visitors over the past week',
  trafficSourcesTitle: 'Traffic Sources',
  trafficSourcesDesc: 'Where your visitors come from',
  topPagesTitle: 'Top Pages',
  topPagesDesc: 'Most visited pages on your website',
  trafficBreakdown: 'Traffic Breakdown',
  trafficBreakdownDesc: 'Detailed breakdown of traffic sources',
  visitors: 'visitors',
  bounce: 'bounce',
  days: {
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
    Sun: 'Sun',
  },
  sources: {
    Direct: 'Direct',
    Search: 'Search',
    Social: 'Social',
    Referral: 'Referral',
  },
} as const;

export default analytics;
