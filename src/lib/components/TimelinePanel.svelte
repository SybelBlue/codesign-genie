<script lang="ts">
  import { slide } from 'svelte/transition';
  import { clickOutside } from '$lib/actions';
  import Timeline from './Timeline.svelte';
  import { withId } from '$lib/decks';

  import type { Data as CardData } from './Card.svelte';

  import { diffWords, type Change } from 'diff';
  import CardBoard from './CardBoard.svelte';

  type Props = {
    show: boolean;
    baseCard: CardData<string>;
    verticalTimeline?: boolean;
  };

  let { show = $bindable(), baseCard, verticalTimeline }: Props = $props();

  const timelineItems = [
    { id: 1, text: 'initial commit', date: '11/1/2024' },
    { id: 2, text: 'updated manna', date: '11/2/2024' },
    { id: 3, text: 'updated character', date: '11/3/2024' },
    { id: 4, text: 'removed Dialogue System', date: '11/4/2024' },
    { id: 5, text: 'add A System', date: '11/5/2024' },
    { id: 6, text: 'add B System', date: '11/6/2024' },
    { id: 7, text: 'add C System', date: '11/7/2024' },
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

  let displayCard = $derived.by(() => {
    const out: CardData<string | Change[]> = cardDataClone(newCard);
    const change = {
      added: (value: string): Change => ({ removed: false, added: true, value }),
      removed: (value: string): Change => ({ removed: true, added: false, value }),
      none: (value: string): Change => ({ removed: false, added: false, value }),
    };
    out.responsibilities = [
        ...new Set([
          ...baseCard.responsibilities.map(o => o.id),
          ...newCard.responsibilities.map(o => o.id)
        ])
      ]
      .map(id => {
        const b = baseCard.responsibilities.find(o => o.id === id);
        const n = newCard.responsibilities.find(o => o.id === id);
        if (b && n) {
          const nColNames = n.collaborators.map(c => c.name),
            bColNames = b.collaborators.map(c => c.name);

          return {
            id,
            description: diffWords(b.description, n.description),
            collaborators: [
              ...new Set([...nColNames, ...bColNames])
            ].map(name => {
              const inN = nColNames.includes(name), inB = bColNames.includes(name);
              if (inN && inB) return withId({ name });
              if (inN) return withId({ name: [change.added(name)] });
              if (inB) return withId({ name: [change.removed(name)] });
              throw new Error('impossible! - came from n or b names');
            })
          };
        }
        if (b) {
          return {
            id,
            description: [change.removed(b.description)],
            collaborators: b.collaborators.map(c => ({ id: c.id, name: [change.removed(c.name)]}))
          }
        }
        if (n) {
          return {
            id,
            description: [change.added(n.description)],
            collaborators: n.collaborators.map(c => ({ id: c.id, name: [change.added(c.name)]}))
          }
        }
        throw new Error("impossible! - came from n or b");
      });
    return out;
  });
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
