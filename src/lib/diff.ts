import type { CardProps as Card, SimpleDeck, Deck, SimpleCard, Key } from '$lib/types';
import { withId } from '$lib/decks';
import { diffWords, type Change } from 'diff';

type Zipped<T, K> =
  | { id: K; type: 'left'; left: T; right: null }
  | { id: K; type: 'right'; left: null; right: T }
  | { id: K; type: 'both'; left: T; right: T };

const mergeKeyed = <T, K>(left: T[], right: T[], key: (_: T) => K): Zipped<T, K>[] => {
  const out: Zipped<T, K>[] = [];
  const lIds = new Set();
  const rightKeyed = right.map((o) => ({ data: o, id: key(o) }));
  for (const l of left) {
    const id = key(l);
    const r = rightKeyed.find((m) => m.id === id);
    lIds.add(id);
    out.push(
      r == null
        ? { id, type: 'left', left: l, right: null }
        : { id, type: 'both', left: l, right: r.data }
    );
  }
  for (const m of rightKeyed) {
    const { data: r, id } = m;
    if (!lIds.has(id)) {
      out.push({ id, type: 'right', left: null, right: r });
    }
  }
  return out;
};

type SimpleResponsibility = SimpleCard['responsibilities'][number];

const diffResponsibilities = (
  prev: SimpleResponsibility[],
  curr: SimpleResponsibility[],
  expandUnchanged: boolean
): Card['responsibilities'] => {
  const change = {
    added: (value: string): Change => ({ removed: false, added: true, value }),
    removed: (value: string): Change => ({ removed: true, added: false, value }),
    none: (value: string): Change => ({ removed: false, added: false, value })
  };
  const diffResponsibility = (
    id: Key,
    resp: SimpleResponsibility,
    changeFn: (_: string) => Change
  ) => ({
    id,
    description: [changeFn(resp.description)],
    collaborators: resp.collaborators.map(({ id, name }) => ({ id, name: [changeFn(name)] })),
    sortKey: -1
  });

  let omitted = false;
  const merged = mergeKeyed(prev, curr, (o) => o.id);
  const out = merged.flatMap((z) => {
    switch (z.type) {
      case 'left':
        return [diffResponsibility(z.id, z.left, change.removed)];
      case 'right':
        return [diffResponsibility(z.id, z.right, change.added)];
      case 'both': {
        const description =
          // check avoids a no-change diff from appearing
          z.left.description === z.right.description
            ? z.left.description
            : diffWords(z.left.description, z.right.description);
        const collaborators = mergeKeyed(
          z.left.collaborators,
          z.right.collaborators,
          (o) => o.name
        ).map(({ type, id: name }) => {
          switch (type) {
            case 'left':
              return withId({ name: [change.removed(name)] });
            case 'right':
              return withId({ name: [change.added(name)] });
            case 'both':
              return withId({ name });
          }
        });
        const changed = !(
          Array.isArray(description) || collaborators.find((c) => Array.isArray(c.name))
        );
        const diffed = { id: z.id, description, collaborators, sortKey: changed ? -1 : 0 };
        const omit = !expandUnchanged && merged.length > 2 && changed;
        omitted ||= omit;
        return omit ? [] : [diffed];
      }
    }
  });
  if (omitted) {
    out.push(withId({ description: '...', collaborators: [], sortKey: 1 }));
  }
  return out;
};

export const diffDecks = (prev: SimpleDeck, curr: SimpleDeck, expandUnchanged: boolean): Deck => {
  const [out, unchanged]: Deck[] = [[], []];
  for (const z of mergeKeyed(prev, curr, (o) => o.id)) {
    const diff = {
      id: z.id,
      name: z.type == 'left' ? z.left.name : z.right.name,
      responsibilities: diffResponsibilities(
        z.left?.responsibilities ?? [],
        z.right?.responsibilities ?? [],
        expandUnchanged
      )
    };
    const target =
      z.type != 'both' ||
      diff.responsibilities.find(
        (r) => Array.isArray(r.description) || r.collaborators.find((c) => Array.isArray(c.name))
      )
        ? out
        : unchanged;
    target.push(diff);
  }
  out.push(...unchanged);
  return out;
};

export { type Change, diffWords };
