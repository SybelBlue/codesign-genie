import { writable } from 'svelte/store';

export const highlightedClass = writable<string | false>(false);
export const availableClasses = writable<string[]>([]);
export const debug = writable<boolean>(true);
