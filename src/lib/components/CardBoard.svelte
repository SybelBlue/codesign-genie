<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte';
  import { flip } from 'svelte/animate';
  import type { Key, Keyed } from '$lib/types';
  import Card from './Card.svelte';
  import { debug, highlightedClass, mousePos } from '$lib/stores';

  export let cards: Keyed<ComponentProps<Card>>[];
  export let animateIn: boolean = !$debug;

  $: if (animateIn) setTimeout(() => animateIn = false, 200);

  let backdrop: HTMLDivElement;

  const liDict: Record<Key, HTMLLIElement> = {};

  const inlineWithMouse = (el: HTMLLIElement) => {
    if (!$mousePos) return false;
    const
      mouseX = $mousePos.x,
      rect = el.getBoundingClientRect(),
      left = rect.left,
      right = left + rect.width,
      inline = left < mouseX && mouseX < right;
    return inline;
  };

  $: inlineDict = (_ =>
    Object.fromEntries(
      Object.entries(liDict).map(([k, el]) => [k, inlineWithMouse(el)])
    )
  )($highlightedClass); // recalc on highlightedClass

  const dispatch = createEventDispatcher<{ cardSelected: { card: ComponentProps<Card> } }>();
  const propagateSelection = (data: CustomEvent<{ name: string }>) => {
    const card = cards.find((card) => card.name == data.detail.name);
    if (card) {
      dispatch("cardSelected", { card })
    } else {
      console.error("Did not find card of name", data.detail.name);
    }
  };
</script>

<div bind:this={backdrop} id="backdrop">
  <ul class="grid-container">
    {#each cards as { id, ...cardProps } (id)}
      {@const surface = cardProps.name === $highlightedClass}
      {@const inline = inlineDict[`${id}`]}
      <li
        bind:this={liDict[`${id}`]}
        class:surface
        class:inline
        class={(liDict[id]?.getBoundingClientRect().left || 0) < 10 ? 'right' : 'left'}
        animate:flip={{ duration: 400 }}
        >
        {#if !animateIn}
          <Card
            on:selectCard={propagateSelection}
            {...cardProps}
            />
        {/if}
      </li>
    {/each}
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

      &.inline {
        &.right {
          @apply translate-x-full;
        }
        &.left {
          @apply -translate-x-full;
        }
      }
    }
  }
</style>