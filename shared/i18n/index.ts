import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vi_common from './locales/vi/common';
import en_common from './locales/en/common';
import vi_dashboard from './locales/vi/dashboard';
import en_dashboard from './locales/en/dashboard';
import vi_campaigns from './locales/vi/campaigns';
import en_campaigns from './locales/en/campaigns';
import vi_brands from './locales/vi/brands';
import en_brands from './locales/en/brands';
import vi_campaignDetail from './locales/vi/campaignDetail';
import en_campaignDetail from './locales/en/campaignDetail';
import vi_home from './locales/vi/home';
import en_home from './locales/en/home';
import vi_about from './locales/vi/about';
import en_about from './locales/en/about';
import vi_contact from './locales/vi/contact';
import en_contact from './locales/en/contact';
import vi_products from './locales/vi/products';
import en_products from './locales/en/products';
import vi_blogs from './locales/vi/blogs';
import en_blogs from './locales/en/blogs';
import vi_privacy from './locales/vi/privacy';
import en_privacy from './locales/en/privacy';
import vi_support from './locales/vi/support';
import en_support from './locales/en/support';
import vi_terms from './locales/vi/terms';
import en_terms from './locales/en/terms';
import vi_users from './locales/vi/users';
import en_users from './locales/en/users';
import vi_analytics from './locales/vi/analytics';
import en_analytics from './locales/en/analytics';
import vi_documents from './locales/vi/documents';
import en_documents from './locales/en/documents';
import vi_notifications from './locales/vi/notifications';
import en_notifications from './locales/en/notifications';
import vi_settings from './locales/vi/settings';
import en_settings from './locales/en/settings';
import vi_lixiSessions from './locales/vi/lixiSessions';
import en_lixiSessions from './locales/en/lixiSessions';
import vi_feedbacks from './locales/vi/feedbacks';
import en_feedbacks from './locales/en/feedbacks';
import vi_lixi from './locales/vi/lixi';
import en_lixi from './locales/en/lixi';

const resources = {
  vi: {
    common: vi_common,
    dashboard: vi_dashboard,
    campaigns: vi_campaigns,
    brands: vi_brands,
    campaignDetail: vi_campaignDetail,
    home: vi_home,
    about: vi_about,
    contact: vi_contact,
    products: vi_products,
    blogs: vi_blogs,
    privacy: vi_privacy,
    support: vi_support,
    terms: vi_terms,
    users: vi_users,
    analytics: vi_analytics,
    documents: vi_documents,
    notifications: vi_notifications,
    settings: vi_settings,
    lixiSessions: vi_lixiSessions,
    feedbacks: vi_feedbacks,
    lixi: vi_lixi,
  },
  en: {
    common: en_common,
    dashboard: en_dashboard,
    campaigns: en_campaigns,
    brands: en_brands,
    campaignDetail: en_campaignDetail,
    home: en_home,
    about: en_about,
    contact: en_contact,
    products: en_products,
    blogs: en_blogs,
    privacy: en_privacy,
    support: en_support,
    terms: en_terms,
    users: en_users,
    analytics: en_analytics,
    documents: en_documents,
    notifications: en_notifications,
    settings: en_settings,
    lixiSessions: en_lixiSessions,
    feedbacks: en_feedbacks,
    lixi: en_lixi,
  },
};

const isClient = typeof window !== 'undefined';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next);
  if (isClient) {
    // Only attach detector in browser to avoid SSR/localStorage issues
    i18n.use(LanguageDetector);
  }

  i18n
    .init({
      resources,
      fallbackLng: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'vi',
      debug: false,
      interpolation: { escapeValue: false },
      ns: [
        'common',
        'dashboard',
        'campaigns',
        'brands',
        'campaignDetail',
        'home',
        'about',
        'contact',
        'products',
        'blogs',
        'privacy',
        'support',
        'terms',
        'users',
        'analytics',
        'documents',
        'notifications',
        'settings',
        'lixiSessions',
        'feedbacks',
        'lixi',
      ],
      defaultNS: 'common',
      detection: isClient
        ? {
            order: ['cookie', 'localStorage', 'htmlTag'],
            caches: ['cookie', 'localStorage'],
            lookupCookie: 'i18nextLng',
            lookupLocalStorage: 'i18nextLng',
            convertDetectedLanguage: (lng: string) =>
              lng ? lng.split(/[-_]/)[0].toLowerCase() : lng,
          }
        : undefined,
    })
    .then(() => {
      // Post processor (after init)
      i18n.use({
        type: 'postProcessor',
        name: 'envReplace',
        process(value: string) {
          return value
            .replace(/\{\{appname\}\}/g, process.env.NEXT_PUBLIC_APP_NAME || 'Zalo Apps')
            .replace(/\{\{count\}\}/g, '1000');
        },
      });
    });
} else {
  // Sync updated resources into existing i18n singleton during HMR / hot reload
  Object.entries(resources).forEach(([lng, nsObj]) => {
    Object.entries(nsObj).forEach(([ns, bundle]) => {
      i18n.addResourceBundle(lng, ns, bundle, true, true);
    });
  });
}

export default i18n;
