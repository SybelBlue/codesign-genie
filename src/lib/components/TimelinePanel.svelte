<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { CardProps } from '$lib/types';
  import { clickOutside } from '$lib/actions';
  import Timeline from './Timeline.svelte';
  import Card from './Card.svelte';
  import { withId } from '$lib/decks';

  import type { Data as CardData } from './Card.svelte';

  import { diffWords } from 'diff';

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

  const getPath = (obj: any, path: string | number | (string | number)[]) => {
    if (!Array.isArray(path)) return obj[path];
    return path.reduce((out, p) => out[p], obj);
  }

  const setPath = (obj: any, path: string | number | (string | number)[], value: any) => {
    if (!Array.isArray(path)) return obj[path] = value;
    let out = obj;
    const last = path.length - 1;;
    path.forEach((p, idx) => {
      if (idx !== last) {
        out = out[p];
      } else {
        out[p] = value;
      }
    })
    return out;
  }

  const cardDataClone = (c: CardData<string>): CardData<string> =>
    JSON.parse(JSON.stringify(c)) as CardData<string>;

  let newCard = $derived.by(() => {
    const c = cardDataClone(baseCard)
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

  let diffCard = $derived.by(() => {
    const out: CardProps = cardDataClone(baseCard);
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
          return {
            id,
            description: diffWords(b.description, n.description),
            collaborators: n.collaborators // todo fix this!
          };
        }
        if (b) {
          return {
            id,
            description: [{ removed: true, added: false, value: b.description }],
            collaborators: b.collaborators.map(c => ({ id: c.id, name: [{ removed: true, added: false, value: c.name }]}))
          }
        }
        if (n) {
          return {
            id,
            description: [{ removed: false, added: true, value: n.description }],
            collaborators: n.collaborators.map(c => ({ id: c.id, name: [{ removed: false, added: true, value: c.name }]}))
          }
        }
        throw new Error("impossible!");
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
      <!-- Column 1?: Placeholder -->
      <div class="flex-0 max-h-[40vh]">
        <h3 class="text-lg font-bold mb-2 text-center">Timeline</h3>
        <Timeline vertical commits={timelineItems} />
      </div>
    {/if}
      <!-- Column 2: Placeholder -->
      <div class="grow py-4">
        <h3 class="text-lg font-bold mb-2 text-center">Previous State</h3>
        <Card locked {...baseCard}/>
      </div>
      <div class="divider divider-horizontal"></div>
      <!-- Column 3: Placeholder -->
      <div class="grow py-4 text-center">
        <h3 class="text-lg font-bold mb-2">Current State</h3>
        <Card locked {...diffCard}/>
      </div>
  </div>
  </div>
{/if}
