'use client';

import { useI18n } from '@/hooks/useI18n';

export function SkipLink() {
  const { t } = useI18n('lixi');

  return (
    <a className="lixi-skip-link" href="#lixi-main">
      {t('common.skipToContent')}
    </a>
  );
}
