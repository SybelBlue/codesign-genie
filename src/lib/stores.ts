import { writable } from 'svelte/store';

export const highlightedClass = writable<string | undefined>();
export const availableClasses = writable<string[]>([]);
export const debug = writable<boolean>(false);
export const mousePos = writable<{ x: number; y: number }>({ x: 0, y: 0 });
