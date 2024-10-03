import { writable } from 'svelte/store';

export const highlightedClass = writable<string | undefined>();
