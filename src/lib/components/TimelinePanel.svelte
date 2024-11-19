<script lang="ts">
  import { slide } from 'svelte/transition';
  import { clickOutside } from '$lib/actions';
  import type { CardProps, Deck, Keyed } from '$lib/types';
  import { withId } from '$lib/decks';

  import type { Data as CardData } from './Card.svelte';
  import CardBoard from './CardBoard.svelte';
  import Timeline from './Timeline.svelte';

  import { diffWords, type Change } from 'diff';

  type Props = {
    show: boolean;
    baseCard: CardData<string>;
    verticalTimeline?: boolean;
  };

  let { show = $bindable(), baseCard, verticalTimeline }: Props = $props();

  const timelineItems = [
    { id: 1, state: [], text: 'initial commit', date: '11/1/2024' },
    { id: 2, state: [], text: 'updated manna', date: '11/2/2024' },
    { id: 3, state: [], text: 'updated character', date: '11/3/2024' },
    { id: 4, state: [], text: 'removed Dialogue System', date: '11/4/2024' },
    { id: 5, state: [], text: 'add A System', date: '11/5/2024' },
    { id: 6, state: [], text: 'add B System', date: '11/6/2024' },
    { id: 7, state: [], text: 'add C System', date: '11/7/2024' },
  ];

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

  const diffResponsibilities = (prev: CardData<string>['responsibilities'], curr: CardData<string>['responsibilities']): CardProps['responsibilities'] => {
    const change = {
      added: (value: string): Change => ({ removed: false, added: true, value }),
      removed: (value: string): Change => ({ removed: true, added: false, value }),
      none: (value: string): Change => ({ removed: false, added: false, value }),
    };
    return mergeKeyed(prev, curr, o => o.id)
      .map(z => {
        switch (z.type) {
          case 'left':
            return {
              id: z.id,
              description: [change.removed(z.left.description)],
              collaborators: z.left.collaborators.map(c => ({ id: c.id, name: [change.removed(c.name)]}))
            }
          case 'right':
            return {
              id: z.id,
              description: [change.added(z.right.description)],
              collaborators: z.right.collaborators.map(c => ({ id: c.id, name: [change.added(c.name)]}))
            }
          case 'both':
            return {
              id: z.id,
              description: diffWords(z.left.description, z.right.description),
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
        }
      });
  }

  const diffCard = (primary: CardData<string>, secondary: CardData<string> | null, swapOrder=false): CardProps => {
    const [prev, curr] = swapOrder ? [secondary, primary] : [primary, secondary];
    return {
      name: primary.name,
      responsibilities: diffResponsibilities(prev?.responsibilities ?? [], curr?.responsibilities ?? []),
    }
  };

  const diffDecks = (prev: Deck, curr: Deck): Keyed<CardProps>[] => {
    return mergeKeyed(prev, curr, o => o.id)
      .map(z => {
        switch (z.type) {
          case 'left':
            return { id: z.id, ...diffCard(z.left, null)}
          case 'right':
            return { id: z.id, ...diffCard(z.right, null, true)}
          case 'both':
            return { id: z.id, ...diffCard(z.left, z.right)}
        }
      });
  };

const cardDataClone = (c: CardData<string>): CardData<string> =>
  JSON.parse(JSON.stringify(c)) as CardData<string>;

let newCard = $derived.by(() => {
  const c = cardDataClone(baseCard);
  c.name = "Agent";
  const firstResp = c.responsibilities[0];
  firstResp.collaborators.push(withId({ name: 'Enemy' }));
  if (!Array.isArray(firstResp.description)) {
    let old = firstResp.description;
    firstResp.description = old.replace('etc.', 'gold');
  }
  c.responsibilities.splice(2, 1);
  c.responsibilities.push(withId({
    description: 'new responsibility',
    collaborators: [{ name: 'Inventory' }].map(withId),
  }));
  return c;
});

  let displayCard = $derived(diffCard(baseCard, newCard));
</script>

{#if show}
  <div
    class="sticky left-0 top-0 p-4 bg-base-200 shadow-lg overflow-y-auto z-50"
    transition:slide={{ duration: 300, axis: 'y' }}
    use:clickOutside={(e) => { e.stopPropagation(); show = false; }}
    >
    {#if !verticalTimeline}
      <Timeline commits={timelineItems} />
    {/if}
    <div class="flex bg-base-100 w-full rounded-lg p-2">
      {#if verticalTimeline}
        <div class="flex-0 max-h-[40vh]">
          <h3 class="text-lg font-bold mb-2 text-center">Timeline</h3>
          <Timeline vertical commits={timelineItems} />
        </div>
      {/if}
      <CardBoard cards={[displayCard].map(withId)} />
    </div>
  </div>
{/if}
