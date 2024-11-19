import { dev } from '$app/environment';
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


export const currentDeckInit = ((starting_value = "[]") => {
  
  let deckInfo: string = starting_value;
  return toStore<Keyed<CardProps>[]>(
    () => {
      const obj = JSON.parse(deckInfo);
      return obj;
    },
    (cards) => {
      deckInfo = JSON.stringify(cards);
    }
  )
});
