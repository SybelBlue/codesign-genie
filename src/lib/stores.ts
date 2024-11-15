import { dev } from '$app/environment';
import { toStore, writable } from 'svelte/store';

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

// WIP: values will be dynamic post-milestone 2: button on Toolbar.svelte is hardcoded and disabled until then
export const deckNames = writable<string[]>([]);
export const currentDeck = writable<string>("rpg");
