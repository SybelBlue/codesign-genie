<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Card from './Card.svelte';
  import type { Keyed } from '$lib/types';

  export let cards: Keyed<ComponentProps<Card>>[];
</script>

<div class="scrollable-container">
  {#each cards as c (c.id)}
    <div class="item"><Card {...c} /></div>
  {/each}
</div>

<style lang="scss">
  .scrollable-container {
    border: 1px solid #ccc;
    width: 100%;
    max-width: 78%; // Maximum width of the container
    overflow-y: scroll;
    margin: 0 auto; // Center the container
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #eee;
    font-size: 18px;
    width: 100%;
    // Set a minimum height and use aspect-ratio for scaling
    min-height: 80px;
    aspect-ratio: 2.33 / 1; // Width to height ratio (adjust as needed)

    // Use padding for responsive text sizing
    padding: 5%;
    box-sizing: border-box;

    &:last-child {
      border-bottom: none;
    }

    // Responsive font size
    @media (max-width: 400px) {
      font-size: 16px;
    }

    @media (min-width: 401px) and (max-width: 600px) {
      font-size: 18px;
    }

    @media (min-width: 601px) {
      font-size: 20px;
    }
  }
</style>
