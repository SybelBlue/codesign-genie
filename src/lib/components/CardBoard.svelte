<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import Card from './Card.svelte';
  import { fullscreen } from '$lib/actions';

  export let cards: Keyed<ComponentProps<Card>>[];

  const dispatch = createEventDispatcher<{ cardSelected: { card: ComponentProps<Card> } }>();
  const propagateSelection = (data: CustomEvent<{ name: string }>) => {
    const card = cards.find((card) => card.name == data.detail.name)
    if (card) {
      dispatch("cardSelected", { card })
    } else {
      console.error("Did not find card of name", data.detail.name);
    }
  };
</script>

<div
  use:fullscreen
  class="viewport bg-base-100"
  >
  <div class="grid gap-2 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 overscroll-auto">
    {#each cards as { id, ...cardProps } (id)}
      <div> <!-- having this div allows cards to auto-size themselves -->
        <Card
          on:selectCard={propagateSelection}
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
