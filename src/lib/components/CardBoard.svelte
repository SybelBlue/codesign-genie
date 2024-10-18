<script lang="ts">
  import { onMount, type ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import Card from './Card.svelte';

  export let cards: Keyed<ComponentProps<Card>>[];

  let viewport: HTMLDivElement;

  onMount(() => {
    const resizeViewport = () => {
      viewport.style.height = `${window.innerHeight}px`;
    };

    resizeViewport();
    window.addEventListener('resize', resizeViewport);

    return () => {
      window.removeEventListener('resize', resizeViewport);
    };
  });
</script>

<div
  class="viewport bg-base-100"
  bind:this={viewport}
  >
  <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
    {#each cards as { id, ...cardProps } (id)}
      <div>
        <Card
          on:selectCard={(data) => console.debug('selectCard', data)}
          {...cardProps}
          />
      </div>
    {/each}
  </div>
</div>

<style>
  .viewport {
    width: 100%;
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
