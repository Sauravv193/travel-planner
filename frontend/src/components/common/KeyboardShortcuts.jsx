import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * Maps key combinations to actions
 */
const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handler = (e) => {
      // Don't trigger shortcuts when typing in inputs
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
        return;
      }

      for (const shortcut of shortcuts) {
        const {
          key,
          ctrl = false,
          meta = false,
          shift = false,
          alt = false,
          action,
          preventDefault = true,
        } = shortcut;

        const ctrlOrMeta = ctrl || meta;

        const matches =
          e.key.toLowerCase() === key.toLowerCase() &&
          (e.ctrlKey === ctrl || !ctrlOrMeta) &&
          (e.metaKey === meta || !ctrlOrMeta) &&
          e.shiftKey === shift &&
          e.altKey === alt;

        if (matches) {
          if (preventDefault) e.preventDefault();
          action(e);
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
};

export default useKeyboardShortcuts;
