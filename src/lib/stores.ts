import { writable } from 'svelte/store';

export const highlightedClass = writable<string | false>(false);
