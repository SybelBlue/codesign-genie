<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte';
  import { flip } from 'svelte/animate';
  import type { Keyed } from '$lib/types';
  import Card from './Card.svelte';
  import { withId } from '$lib/common';
  import { debug, highlightedClass } from '$lib/stores';

  export let cards: Keyed<ComponentProps<Card>>[];
  export let animateIn: boolean = !$debug;

  $: if (animateIn) setTimeout(() => animateIn = false, 200);

  const dispatch = createEventDispatcher<{ cardSelected: { card: ComponentProps<Card> } }>();
  const selectCard = (card: ComponentProps<Card>) => dispatch("cardSelected", { card });
  const propagateSelection = (data: CustomEvent<{ name: string }>) => {
    const card = cards.find((card) => card.name == data.detail.name);
    if (card) {
      selectCard(card);
    } else {
      console.error("Did not find card of name", data.detail.name);
    }
  };

  const newCard = (name: string) => withId({
    name,
    responsibilities: [],
    collaborators: [],
  });

  let newClassCounter = 0;
  const addNewCard = () => {
    const card = newCard('NewClass' + newClassCounter++);
    cards = [...cards, card];
    selectCard(card);
  };
</script>

<div id="backdrop">
  <ul class="grid-container">
    {#each cards as { id, name, responsibilities, collaborators } (id)}
      {@const surface = name === $highlightedClass}
      <li class:surface animate:flip={{ duration: 400 }}>
        {#if !animateIn}
          <Card
            on:selectCard={propagateSelection}
            locked
            bind:name
            bind:responsibilities
            bind:collaborators
            />
        {/if}
      </li>
    {/each}
    <div
      on:focus={addNewCard}
      class="h-full btn btn-ghost tw-grow card dark:card-bordered shadow-xl"
      role="gridcell"
      tabindex=0
      >
      {#if !animateIn}
        <div class="card-body">
          <div class="btn btn-circle btn-primary btn-outline my-auto"> + </div>
        </div>
      {/if}
    </div>
  </ul>
</div>

<style lang="postcss">
  #backdrop {
    @apply absolute top-0 left-0 w-full h-full bg-base-100 overflow-auto overscroll-auto;
  }

  .grid-container {
    @apply grid p-1 gap-2;
    /* responsive sizing */
    @apply xl:grid-cols-3 md:grid-cols-2 grid-cols-1;
  }

  /* Create stacking context for each sticky element */
  li {
    @apply relative;
    z-index: 1;

    &.surface {
      @apply sticky top-0 bottom-0 isolate pointer-events-none;
      z-index: 2;
    }
  }
</style>