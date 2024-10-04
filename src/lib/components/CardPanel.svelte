<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import Card from './Card.svelte';

  export let cards: Keyed<ComponentProps<Card>>[];
</script>

<section class="scrollable-container">
  {#each cards as c (c.id)}
    <Card
      on:selectCard={(data) => console.debug('selectCard', data)}
      {...c}
      />
  {/each}
</section>

<style lang="scss">
  .scrollable-container {
    border: 1px solid #ccc;
    width: 95vw;
    max-width: 100vw;

    // max-width: 78%; // Maximum width of the container
    overflow: auto;
    margin: 0 auto; // Center the container
  }
</style>
