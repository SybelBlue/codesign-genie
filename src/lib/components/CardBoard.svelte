<script lang="ts">
  import { createEventDispatcher, onMount, type ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import Card from './Card.svelte';
  import { fullscreen } from '$lib/actions';
  import { highlightedClass } from '$lib/stores';

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

  let viewport: HTMLDivElement;
  let indicators = {
    left: false,
    right: false,
    top: false,
    bottom: false
  };

  const clearIndicators = () => {
    indicators = {
      left: false,
      right: false,
      top: false,
      bottom: false
    };
  }

  const updateIndicators = (element: HTMLDivElement) => {
    const containerRect = viewport.getBoundingClientRect();
    const highlightRect = element.getBoundingClientRect();

    indicators = {
      left: highlightRect.right < containerRect.left,
      right: highlightRect.left > containerRect.right,
      top: highlightRect.bottom < containerRect.top,
      bottom: highlightRect.top > containerRect.bottom
    };
  };

  $: if(!$highlightedClass) clearIndicators();

  // Compute the indicator classes based on which sides have offscreen items
  $: indicatorClasses = [
    indicators.left ? 'glow-left' : '',
    indicators.right ? 'glow-right' : '',
    indicators.top ? 'glow-top' : '',
    indicators.bottom ? 'glow-bottom' : ''
  ].filter(Boolean).join(' ');
</script>

<div
  bind:this={viewport}
  use:fullscreen
  class="viewport bg-base-100 {indicatorClasses}"
  >
  <div class="grid p-1 gap-2 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 overscroll-auto">
    {#each cards as { id, ...cardProps } (id)}
      <div> <!-- having this div allows cards to auto-size themselves -->
        <Card
          on:selectCard={propagateSelection}
          on:highlightCard={(e) => updateIndicators(e.detail.element)}
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

  .glow-left {
    box-shadow: inset 12px 0 10px -8px oklch(var(--a));
  }

  .glow-right {
    box-shadow: inset -12px 0 10px -8px oklch(var(--a));
  }

  .glow-top {
    box-shadow: inset 0 12px 10px -8px oklch(var(--a));
  }

  .glow-bottom {
    box-shadow: inset 0 -12px 10px -8px oklch(var(--a));
  }

  /* Combine multiple glows when needed */
  .glow-left.glow-right {
    box-shadow:
      inset 12px 0 10px -8px oklch(var(--a)),
      inset -12px 0 10px -8px oklch(var(--a));
  }

  .glow-top.glow-bottom {
    box-shadow:
      inset 0 12px 10px -8px oklch(var(--a)),
      inset 0 -12px 10px -8px oklch(var(--a));
  }

  .glow-left.glow-top {
    box-shadow:
      inset 12px 0 10px -8px oklch(var(--a)),
      inset 0 12px 10px -8px oklch(var(--a));
  }

  .glow-right.glow-top {
    box-shadow:
      inset -12px 0 10px -8px oklch(var(--a)),
      inset 0 12px 10px -8px oklch(var(--a));
  }

  .glow-left.glow-bottom {
    box-shadow:
      inset 12px 0 10px -8px oklch(var(--a)),
      inset 0 -12px 10px -8px oklch(var(--a));
  }

  .glow-right.glow-bottom {
    box-shadow:
      inset -12px 0 10px -8px oklch(var(--a)),
      inset 0 -12px 10px -8px oklch(var(--a));
  }

  /* Three-sided combinations */
  .glow-left.glow-right.glow-top {
    box-shadow:
      inset 12px 0 10px -8px oklch(var(--a)),
      inset -12px 0 10px -8px oklch(var(--a)),
      inset 0 12px 10px -8px oklch(var(--a));
  }

  .glow-left.glow-right.glow-bottom {
    box-shadow:
      inset 12px 0 10px -8px oklch(var(--a)),
      inset -12px 0 10px -8px oklch(var(--a)),
      inset 0 -12px 10px -8px oklch(var(--a));
  }

  /* All sides */
  .glow-left.glow-right.glow-top.glow-bottom {
    box-shadow:
      inset 12px 0 10px -8px oklch(var(--a)),
      inset -12px 0 10px -8px oklch(var(--a)),
      inset 0 12px 10px -8px oklch(var(--a)),
      inset 0 -12px 10px -8px oklch(var(--a));
  }
</style>
