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

<div class="viewport" bind:this={viewport}>
  <div class="grid">
    {#each cards as c (c.id)}
      <Card
        on:selectCard={(data) => console.debug('selectCard', data)}
        {...c}
        />
    {/each}
  </div>
</div>

<style>
  .viewport {
    width: 100%;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
  }

  .grid {
    display: grid;
    grid-template-rows: auto;
    /* grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); */
    gap: 1rem;
    padding: 1rem;
  }

  .grid-item {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 1rem;
    text-align: center;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
