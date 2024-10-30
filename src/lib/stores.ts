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
