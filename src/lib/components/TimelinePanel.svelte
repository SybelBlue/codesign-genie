<script lang="ts">
  import { slide } from 'svelte/transition';
  import { clickOutside } from '$lib/actions';
  import type { CardProps, Commit, Deck, Keyed } from '$lib/types';
  import { withId } from '$lib/decks';

  import type { Data as CardData } from './Card.svelte';
  import CardBoard from './CardBoard.svelte';
  import Timeline from './Timeline.svelte';

  import { diffWords, type Change } from 'diff';

  type Props = {
    show: boolean;
    currentDeck: Deck;
    commits: Commit[];
    verticalTimeline?: boolean;
  };

  let { show = $bindable(), currentDeck, commits: timelineItems, verticalTimeline }: Props = $props();

  type Zipped<T, K> =
    | { id: K, type: 'left', left: T }
    | { id: K, type: 'right', right: T }
    | { id: K, type: 'both', left: T, right: T };

  const mergeKeyed = <T, K>(left: T[], right: T[], key: (_: T) => K): Zipped<T, K>[] => {
    const out: Zipped<T, K>[] = [];
    const lIds = new Set();
    const rightKeyed = right.map(o => ({ data: o, id: key(o) }));
    for (const l of left) {
      const id = key(l);
      const r = rightKeyed.find(m => m.id === id);
      lIds.add(id);
      out.push(r === undefined ? { id, type: 'left', left: l } : { id, type: 'both', left: l, right: r.data });
    }
    for (const m of rightKeyed) {
      const { data: r, id } = m;
      if (!lIds.has(id)) {
        out.push({ id, type: 'right', right: r });
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
              collaborators: z.left.collaborators.map(c => ({ id: c.id, name: [change.removed(c.name)]}))
            }]
          case 'right':
            return [{
              id: z.id,
              description: [change.added(z.right.description)],
              collaborators: z.right.collaborators.map(c => ({ id: c.id, name: [change.added(c.name)]}))
            }]
          case 'both':
            const diffed = {
              id: z.id,
              description: z.left.description === z.right.description ? z.left.description : diffWords(z.left.description, z.right.description),
              collaborators: mergeKeyed(z.left.collaborators, z.right.collaborators, o => o.name).map(({ type, id: name }) => {
              switch (type) {
                  case 'left':
                    return withId({ name: [change.removed(name)] });
                  case 'right':
                    return withId({ name: [change.added(name)] });
                  case 'both':
                    return withId({ name });
                }
              })
            };
            const omit = merged.length > 2 && !Boolean(Array.isArray(diffed.description) || diffed.collaborators.find(c => Array.isArray(c.name)));
            omitted ||= omit;
            return omit ? []: [diffed];
        }
      });
      if (omitted) {
        out.push(withId({ description: '...', collaborators: []}))
      }
      return out;
  }

  const diffCard = (primary: SimpleCard, secondary: SimpleCard | null, swapOrder=false): CardProps => {
    const [prev, curr] = !swapOrder ? [secondary, primary] : [primary, secondary];
    return {
      name: primary.name,
      responsibilities: diffResponsibilities(prev?.responsibilities ?? [], curr?.responsibilities ?? []),
    }
  };

  const diffDecks = (prev: Deck, curr: Deck): Keyed<CardProps>[] => {
    return mergeKeyed(prev, curr, o => o.id)
      .flatMap(z => {
        switch (z.type) {
          case 'left':
            return [{ id: z.id, ...diffCard(z.left, null)}]
          case 'right':
            return [{ id: z.id, ...diffCard(z.right, null, true)}]
          case 'both':
            const diff = diffCard(z.left, z.right);
            if (diff.responsibilities.find(r => Array.isArray(r.description) || r.collaborators.find(c => Array.isArray(c.name))))
              return [{ id: z.id, ...diff}];
            return [];
        }
      });
  };

  let compareDeck: Deck | undefined = $state(undefined);
  let diffedCards = $derived(diffDecks(compareDeck ?? timelineItems[timelineItems.length - 1].state, currentDeck));
</script>

{#if show}
  <div
    class="sticky left-0 top-0 p-4 bg-base-200 shadow-lg overflow-y-auto z-50"
    transition:slide={{ duration: 300, axis: 'y' }}
    use:clickOutside={(e) => { e.stopPropagation(); show = false; }}
    >
    {#if !verticalTimeline}
      <Timeline commits={timelineItems} useCommit={(c) => (compareDeck = c.state)} />
    {/if}
    <div class="flex bg-base-100 w-full rounded-lg p-2">
      {#if verticalTimeline}
        <div class="flex-0 max-h-[40vh]">
          <h3 class="text-lg font-bold mb-2 text-center">Timeline</h3>
          <Timeline vertical commits={timelineItems} useCommit={(c) => (compareDeck = c.state)} />
        </div>
      {/if}
      <CardBoard cards={diffedCards} />
    </div>
  </div>
{/if}
