export interface LixiExpense {
  id: string;
  titleKey: string;
  dateKey: string;
  amount: number;
  noteKey: string;
  descriptionKey: string;
  lineKeys: string[];
}

export const expenseData: LixiExpense[] = [
  {
    id: 'banhChung',
    titleKey: 'expenses.items.banhChung.title',
    dateKey: 'expenses.items.banhChung.date',
    amount: -320000,
    noteKey: 'expenses.items.banhChung.note',
    descriptionKey: 'expenses.items.banhChung.description',
    lineKeys: [
      'expenses.items.banhChung.lines.first',
      'expenses.items.banhChung.lines.second',
      'expenses.items.banhChung.lines.third',
    ],
  },
  {
    id: 'hoaMai',
    titleKey: 'expenses.items.hoaMai.title',
    dateKey: 'expenses.items.hoaMai.date',
    amount: -180000,
    noteKey: 'expenses.items.hoaMai.note',
    descriptionKey: 'expenses.items.hoaMai.description',
    lineKeys: ['expenses.items.hoaMai.lines.first', 'expenses.items.hoaMai.lines.second'],
  },
  {
    id: 'envelopes',
    titleKey: 'expenses.items.envelopes.title',
    dateKey: 'expenses.items.envelopes.date',
    amount: -95000,
    noteKey: 'expenses.items.envelopes.note',
    descriptionKey: 'expenses.items.envelopes.description',
    lineKeys: [
      'expenses.items.envelopes.lines.first',
      'expenses.items.envelopes.lines.second',
      'expenses.items.envelopes.lines.third',
    ],
  },
  {
    id: 'coffee',
    titleKey: 'expenses.items.coffee.title',
    dateKey: 'expenses.items.coffee.date',
    amount: -42000,
    noteKey: 'expenses.items.coffee.note',
    descriptionKey: 'expenses.items.coffee.description',
    lineKeys: ['expenses.items.coffee.lines.first', 'expenses.items.coffee.lines.second'],
  },
  {
    id: 'busTicket',
    titleKey: 'expenses.items.busTicket.title',
    dateKey: 'expenses.items.busTicket.date',
    amount: -420000,
    noteKey: 'expenses.items.busTicket.note',
    descriptionKey: 'expenses.items.busTicket.description',
    lineKeys: [
      'expenses.items.busTicket.lines.first',
      'expenses.items.busTicket.lines.second',
      'expenses.items.busTicket.lines.third',
    ],
  },
];

export const navLinks: Array<{ href: string; labelKey: string; action?: 'feedback' }> = [
  { href: '#hero', labelKey: 'header.nav.home' },
  { href: '#dashboard', labelKey: 'header.nav.dashboard' },
  { href: '#expenses', labelKey: 'header.nav.expenses' },
  { href: '#why', labelKey: 'header.nav.why' },
  { href: '#commit', labelKey: 'header.nav.commitments' },
  // { href: '#compare', labelKey: 'header.nav.compare' },
  { href: '#feedback', labelKey: 'header.nav.feedback', action: 'feedback' },
];

export const kpiData = [
  { id: 'totalReceived', target: 18600000, format: 'currency' as const },
  { id: 'donationCount', target: 142, suffixKey: 'dashboard.kpis.donationCount.suffix' },
  { id: 'incomeToday', target: 720000, format: 'currency' as const, tone: 'positive' as const },
  { id: 'expenseToday', target: 410000, format: 'currency' as const, tone: 'negative' as const },
  { id: 'remaining', target: 11200000, format: 'currency' as const },
] as const;

export const featureData = [
  { id: 'statement', icon: 'statement' },
  { id: 'transparency', icon: 'transparency' },
  { id: 'spending', icon: 'spending' },
  { id: 'tracking', icon: 'tracking' },
] as const;

export const commitData = [
  'onTime',
  'smallAmounts',
  'receipts',
  'unboxing',
  'responses',
  'noBlocking',
  'noMissingMoney',
] as const;

export const compareBad = ['blurryBill', 'delayedStatement', 'missingQr', 'noResponse'] as const;

export const compareGood = ['clearBill', 'approveFirst', 'clearQr', 'responsive'] as const;

export const allocationData = [
  { id: 'food', percent: 32, tone: 'primary' as const },
  { id: 'gifts', percent: 18, tone: 'accent' as const },
  { id: 'travel', percent: 15, tone: 'soft' as const },
  { id: 'clothes', percent: 14, tone: 'gold' as const },
  { id: 'envelopes', percent: 11, tone: 'danger' as const },
  { id: 'reserve', percent: 10, tone: 'muted' as const },
] as const;
