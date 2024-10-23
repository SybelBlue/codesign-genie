import type { Keyed } from './types';

export const withId: <T extends object>(o: T) => Keyed<T> = (function () {
  let nextId = 0;
  return (o) => ({ ...o, id: nextId++ });
})();
