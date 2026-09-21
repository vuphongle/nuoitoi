const contact = {
  hero: {
    badge: 'Connect',
    titlePrefix: 'Start A',
    titleHighlight: 'Project',
  },
  form: {
    title: 'Send a signal',
    nameLabel: 'Full Name',
    namePlaceholder: 'Jane Doe',
    emailLabel: 'Email',
    emailPlaceholder: 'jane@company.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us about your goals.',
    submit: 'Submit Request',
    submitting: 'Submitting...',
    successTitle: 'Success',
    successMessage:
      'Your contact message has been sent successfully. We will get back to you within 24 hours.',
    success:
      'Your contact message has been sent successfully. We will get back to you within 24 hours.',
    errorTitle: 'Error',
    errorMessage: 'An error occurred while sending your message. Please try again later.',
    error: 'An error occurred while sending your message. Please try again later.',
  },

  offices: {
    globalHq: 'Global HQ',
    globalAddress: 'District Binh Thanh, Ho Chi Minh City, Vietnam',
    mapPlaceholder: 'Map Placeholder',
    singapore: 'Singapore',
    singaporeAddress: 'Marina Bay',
    singaporeNote: 'APAC partnerships',
    amsterdam: 'Amsterdam',
    amsterdamAddress: 'Canal District',
    amsterdamNote: 'EU product studio',
  },
  inquiries: {
    title: 'Inquiries',
    sales: 'Sales',
    help: 'Help',
  },
  status: {
    new: 'New',
    in_review: 'In Review',
    replied: 'Replied',
    spam: 'Spam',
  },
} as const;

export default contact;
