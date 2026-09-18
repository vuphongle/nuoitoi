'use client';

import * as React from 'react';

interface UseToggleOptions {
  onTrue?: () => void;
  onFalse?: () => void;
  onToggle?: (value: boolean) => void;
}

export function useToggle(
  initialValue = false,
  options: UseToggleOptions = {}
): [boolean, () => void, (value: boolean) => void] {
  const { onTrue, onFalse, onToggle } = options;
  const [value, setValue] = React.useState(initialValue);

  const toggle = React.useCallback(() => {
    setValue((prev) => {
      const next = !prev;
      if (next && onTrue) onTrue();
      if (!next && onFalse) onFalse();
      onToggle?.(next);
      return next;
    });
  }, [onTrue, onFalse, onToggle]);

  return [value, toggle, setValue];
}
