import { browser, dev } from '$app/environment';
import { toStore, writable } from 'svelte/store';

import type { CardProps, Keyed } from '$lib/types';

export const highlightedClass = writable<string | undefined>();
export const availableClasses = writable<string[]>([]);
/** a store that is only writable if in development, else false */
export const debug = (() => {
  let _debug = dev;
  return toStore(
    () => _debug,
    (v) => (_debug = dev && v)
  );
})();

export const currentDeck = toStore<Keyed<CardProps>[]>(
  () => {
    if (!browser || !localStorage.getItem('customDeckInfo')) {
      return null;
    }

    const b64string = localStorage.getItem('customDeckInfo') as string;
    const obj = JSON.parse(atob(b64string));
    return obj;
  },
  (cards) => {
    if (!browser) {
      return null;
    }

    if (!cards) {
      localStorage.removeItem('customDeckInfo');
      return;
    }

    let b64payload = btoa(JSON.stringify(cards));
    localStorage.setItem('customDeckInfo', b64payload);
  }
);
