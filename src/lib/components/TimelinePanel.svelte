<script lang="ts">
  import { slide } from 'svelte/transition';
  import { clickOutside } from '$lib/actions';
  import Timeline from './Timeline.svelte';
  import { withId } from '$lib/decks';

  import type { Data as CardData } from './Card.svelte';

  import { diffWords, type Change } from 'diff';
  import CardBoard from './CardBoard.svelte';
  import type { CardProps } from '$lib/types';

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

  const diffResponsibilities = (prev: CardData<string>['responsibilities'], curr: CardData<string>['responsibilities']): CardProps['responsibilities'] => {
    const change = {
      added: (value: string): Change => ({ removed: false, added: true, value }),
      removed: (value: string): Change => ({ removed: true, added: false, value }),
      none: (value: string): Change => ({ removed: false, added: false, value }),
    };
    const allIds = [...new Set([...prev.map(o => o.id),...curr.map(o => o.id) ])];
    return allIds
      .map(id => {
        const p = prev.find(o => o.id === id);
        const c = curr.find(o => o.id === id);
        if (p && c) {
          const cColNames = c.collaborators.map(c => c.name),
            pColNames = p.collaborators.map(c => c.name);

          return {
            id,
            description: diffWords(p.description, c.description),
            collaborators: [
              ...new Set([...cColNames, ...pColNames])
            ].map(name => {
              const inN = cColNames.includes(name), inB = pColNames.includes(name);
              if (inN && inB) return withId({ name });
              if (inN) return withId({ name: [change.added(name)] });
              if (inB) return withId({ name: [change.removed(name)] });
              throw new Error('impossible! - came from n or b names');
            })
          };
        }
        if (p) {
          return {
            id,
            description: [change.removed(p.description)],
            collaborators: p.collaborators.map(c => ({ id: c.id, name: [change.removed(c.name)]}))
          }
        }
        if (c) {
          return {
            id,
            description: [change.added(c.description)],
            collaborators: c.collaborators.map(c => ({ id: c.id, name: [change.added(c.name)]}))
          }
        }
        throw new Error("impossible! - came from n or b");
      });
  }

  const diffCard = (primary: CardData<string>, secondary: CardData<string> | null, reversed=false): CardProps => {
    const [prev, curr] = reversed ? [secondary, primary] : [primary, secondary];
    return {
      name: primary.name,
      responsibilities: diffResponsibilities(prev?.responsibilities ?? [], curr?.responsibilities ?? []),
    }
  };

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
