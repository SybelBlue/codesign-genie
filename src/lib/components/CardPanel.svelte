<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import Card from './Card.svelte';

  export let cards: Keyed<ComponentProps<Card>>[];
  
  const dispatch = createEventDispatcher<{ cardSelected: { card: ComponentProps<Card> } }>();
</script>

<section class="scrollable-container">
  {#each cards as c (c.id)}
    <Card
      on:selectCard={(data) => {
        console.debug('selectCard', data)
        let matching_card = cards.find((card) => card.name == data.detail.name)
        if (matching_card)
          dispatch("cardSelected", {card: {...matching_card}})
        else
          console.error("Did not find card of name", data.detail.name);
      }}
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
