<script module lang="ts">
  export type Props = {
    currentDeck: SimpleDeck;
    commits: Commit[];
    show?: boolean;
    expand?: boolean;
    setDisplayDeck?: (d: Keyed<CardProps>[]) => void;
  };
</script>
<script lang="ts">
  import { slide } from 'svelte/transition';
  import { clickOutside } from '$lib/actions';
  import type { CardProps, Commit, SimpleDeck, Keyed } from '$lib/types';
  import { withId } from '$lib/decks';

  import type { Data as CardData } from './Card.svelte';
  import Timeline from './Timeline.svelte';

  import { diffWords, type Change } from 'diff';

  let { show = $bindable(), currentDeck, commits, expand, setDisplayDeck }: Props = $props();

  type Zipped<T, K> =
    | { id: K, type: 'left', left: T, right: null }
    | { id: K, type: 'right', left: null, right: T }
    | { id: K, type: 'both', left: T, right: T };

  const mergeKeyed = <T, K>(left: T[], right: T[], key: (_: T) => K): Zipped<T, K>[] => {
    const out: Zipped<T, K>[] = [];
    const lIds = new Set();
    const rightKeyed = right.map(o => ({ data: o, id: key(o) }));
    for (const l of left) {
      const id = key(l);
      const r = rightKeyed.find(m => m.id === id);
      lIds.add(id);
      out.push(r == null ? { id, type: 'left', left: l, right: null } : { id, type: 'both', left: l, right: r.data });
    }
    for (const m of rightKeyed) {
      const { data: r, id } = m;
      if (!lIds.has(id)) {
        out.push({ id, type: 'right', left: null, right: r });
      }
    }
    return out;
  }

  type SimpleCard = CardData<string>;

  const diffResponsibilities = (prev: SimpleCard['responsibilities'], curr: SimpleCard['responsibilities']): CardProps['responsibilities'] => {
    const change = {
      added: (value: string): Change => ({ removed: false, added: true, value }),
      removed: (value: string): Change => ({ removed: true, added: false, value }),
      none: (value: string): Change => ({ removed: false, added: false, value }),
    };
    let omitted = false;
    const merged = mergeKeyed(prev, curr, o => o.id);
    const out = merged.flatMap(z => {
      switch (z.type) {
        case 'left':
          return [{
            id: z.id,
            description: [change.removed(z.left.description)],
            collaborators: z.left.collaborators.map(c => ({ id: c.id, name: [change.removed(c.name)]})),
            sortKey: -1,
          }]
        case 'right':
          return [{
            id: z.id,
            description: [change.added(z.right.description)],
            collaborators: z.right.collaborators.map(c => ({ id: c.id, name: [change.added(c.name)]})),
            sortKey: -1,
          }]
        case 'both':
          const description = z.left.description === z.right.description ? z.left.description : diffWords(z.left.description, z.right.description);
          const collaborators = mergeKeyed(z.left.collaborators, z.right.collaborators, o => o.name).map(({ type, id: name }) => {
            switch (type) {
              case 'left':
                return withId({ name: [change.removed(name)] });
              case 'right':
                return withId({ name: [change.added(name)] });
              case 'both':
                return withId({ name });
            }
          });
          const changed = !Boolean(Array.isArray(description) || collaborators.find(c => Array.isArray(c.name)));
          const diffed = { id: z.id, description, collaborators, sortKey: changed ? -1 : 0 };
          const omit = !expand && merged.length > 2 && changed;
          omitted ||= omit;
          return omit ? []: [diffed];
      }
    });
    if (omitted) {
      out.push(withId({ description: '...', collaborators: [], sortKey: 1 }))
    }
    return out;
  }

  const diffDecks = (prev: SimpleDeck, curr: SimpleDeck): Keyed<CardProps>[] => {
    const out: Keyed<CardProps>[] = [], unchanged: Keyed<CardProps>[] = [];
    for (const z of mergeKeyed(prev, curr, o => o.id)) {
      const diff = {
        id: z.id,
        name: z.type == 'left' ? z.left.name : z.right.name,
        responsibilities: diffResponsibilities(z.left?.responsibilities ?? [], z.right?.responsibilities ?? []),
      };
      const target = z.type != 'both' || diff.responsibilities.find(r => Array.isArray(r.description) || r.collaborators.find(c => Array.isArray(c.name)))
        ? out
        : unchanged;
      target.push(diff);
    }
    out.push(...unchanged);
    return out;
  };

  let compareDeck: SimpleDeck | undefined = $state(undefined);
  let highlightedCommitId: number = $state(commits[commits.length - 1].id);

  const setCompareCommit = (c: Commit) => {
    compareDeck = c.state;
    highlightedCommitId = c.id;
  }

  let diffedCards = $derived(diffDecks(currentDeck, compareDeck ?? commits[commits.length - 1].state));

  $effect(() => {
    setDisplayDeck?.(show ? diffedCards : currentDeck);
  })
</script>

{#if show}
  <hr class="border-t-2 border-primary mx-4" />
  <div
    class="bg-base-100 p-4 w-fit rounded-lg"
    transition:slide={{ duration: 300, axis: 'y' }}
    use:clickOutside={(e) => { e.stopPropagation(); show = false; }}
    >
    <Timeline
      useCommit={setCompareCommit}
      highlightCommit={highlightedCommitId}
      {commits}
      />
  </div>
{/if}
