<script module lang="ts">
  import type { Props as CardProps } from './Card.svelte';
  import type { Keyed } from '$lib/types';

  export interface Props {
    cards: Keyed<CardProps>[];
    animateIn?: boolean;
    selectCard?: (c: CardProps) => void;
  }
</script>

<script lang="ts">
  import { flip } from 'svelte/animate';
  import { withId } from '$lib/common';
  import { debug, highlightedClass } from '$lib/stores';
  import Card from './Card.svelte';

  let {
    cards = $bindable(),
    animateIn = !$debug,
    selectCard,
  }: Props = $props();

  if (animateIn) setTimeout(() => animateIn = false, 200);

  const propagate = (name: string) => {
    const card = cards.find((card) => card.name == name);
    if (card) {
      selectCard?.(card);
    } else {
      console.error("Did not find card of name", name);
    }
  };

  let newClassCounter = 0;
  const addNewCard = () => {
    const card = withId({
      name: 'NewClass' + newClassCounter++,
      responsibilities: [],
    });
    cards.push(card);
    selectCard?.(card);
  };
</script>

<div id="backdrop">
  <ul class="grid-container">
    {#each cards as { id, ...cardProps } (id)}
      {@const surface = cardProps.name === $highlightedClass}
      <li class:surface animate:flip={{ duration: 400 }}>
        {#if !animateIn}
          <Card locked selectName={propagate} {...cardProps} />
        {/if}
      </li>
    {/each}
    <li>
      <div
        onfocus={addNewCard}
        class="h-full btn btn-ghost tw-grow card dark:card-bordered shadow-xl"
        role="gridcell"
        tabindex=0
        >
        <div class="card-body">
          <div class="btn btn-circle btn-primary btn-outline my-auto"> + </div>
        </div>
      </div>
    </li>
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