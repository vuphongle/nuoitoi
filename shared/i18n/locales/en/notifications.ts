const notifications = {
  title: 'Notifications',
  subtitle: 'Stay updated with the latest activities and alerts.',
  markAllRead: 'Mark all read',
  eyebrow: 'Inbox',
  completion: 'Completion',
  new: 'New',
  cards: {
    all: 'All',
    allDesc: 'Total notifications',
    unread: 'Unread',
    unreadDesc: 'Pending to read',
    read: 'Read',
    readDesc: 'Already viewed',
  },
  tabs: {
    all: 'All',
    unread: 'Unread',
  },
  empty: {
    title: 'All caught up!',
    description: 'You have no unread notifications.',
  },
  actions: {
    markRead: 'Mark as read',
    delete: 'Delete',
  },
} as const;

export default notifications;
