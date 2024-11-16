<script lang="ts">
  import { slide } from 'svelte/transition';
  import Timeline from './Timeline.svelte';
  import Card from './Card.svelte';

  let { show }: { show: boolean } = $props();
  let responsibilities: any[] = [];

  const timelineItems = [
    { id: 1, text: 'initial commit', date: '11/14/2024' },
    { id: 2, text: 'updated manna', date: '11/14/2024' },
    { id: 3, text: 'updated character', date: '11/14/2024' },
    { id: 4, text: 'removed Dialogue System', date: '11/14/2024' },
    { id: 5, text: 'add Power up System', date: '11/14/2024' }
  ];
</script>

{#if show}
  <div
    class="fixed left-0 right-0 top-16 bg-base-200 shadow-lg p-4 overflow-y-auto z-50"
    transition:slide={{ duration: 300, axis: 'y' }}
  >
    <div class="container flex">
        <!-- Column 1: Timeline -->
        <div class="flex-1 min-w-fit">
          <Timeline commits={timelineItems} />
        </div>

        <!-- Column 2: Placeholder -->
        <div class="grow bg-base-100 p-4 rounded-lg">
          <h3 class="text-lg font-bold mb-2">Previous State</h3>
          <Card name="Prev" {responsibilities}/>
        </div>

        <!-- Column 3: Placeholder -->
        <div class="grow bg-base-100 p-4 rounded-lg">
          <h3 class="text-lg font-bold mb-2">Current State</h3>
          <Card name="Current" {responsibilities}/>
        </div>
    </div>
  </div>
{/if}
