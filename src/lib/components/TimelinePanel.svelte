<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { CardProps } from '$lib/types';
  import { clickOutside } from '$lib/actions';
  import Timeline from './Timeline.svelte';
  import Card from './Card.svelte';

  import microdiff from 'microdiff';
  import { withId } from '$lib/decks';


  type Props = {
    show: boolean;
    baseCard: CardProps;
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

  let newCard = $derived.by(() => {
    const c = JSON.parse(JSON.stringify(baseCard)) as CardProps;
    const firstResp = c.responsibilities[0];
    firstResp.collaborators.push(withId({ name: 'Enemy' }));
    firstResp.description = firstResp.description.replace('etc.)', 'gold, etc.)');
    c.responsibilities.push(withId({
      description: 'new responsibility',
      collaborators: [{ name: 'Inventory' }].map(withId),
    }));
    return c;
  });

  $inspect(newCard).with(() => {
    console.table(microdiff(baseCard, newCard));
  })
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
      <!-- Column 2: Placeholder -->
      <div class="grow py-4">
        <h3 class="text-lg font-bold mb-2 text-center">Previous State</h3>
        <Card locked {...baseCard}/>
      </div>
      <div class="divider divider-horizontal"></div>
      <!-- Column 3: Placeholder -->
      <div class="grow py-4 text-center">
        <h3 class="text-lg font-bold mb-2">Current State</h3>
        <Card locked {...newCard}/>
      </div>
  </div>
  </div>
{/if}
