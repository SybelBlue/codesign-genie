<svelte:options immutable/>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { highlightedClass, availableClasses } from '$lib/stores';

  /** warning: immutable! make a new label when a change happens*/
  export let name: string;

  /** warning: immutable! make a new label when a change happens*/
  export let disabled: boolean = false;

  let cardSelectDispatcher = createEventDispatcher<{ selectCard: { name: string } }>();
  const selectCard = () => cardSelectDispatcher('selectCard', { name });

  $: hasACard = $availableClasses.includes(name);
</script>

<span
  on:mouseenter={() => $highlightedClass = !disabled && name }
  on:mouseleave={() => $highlightedClass = false }
  on:focus={selectCard}
  class:enabled={!disabled && hasACard}
  class:no-card={!hasACard}
  class="text-accent"
  role="link"
  tabindex=0
  >{name}</span>

<style lang="postcss">
  span {
    font-family: var(--font-mono);
    font-size: inherit;

    &.enabled:hover {
      text-shadow: 0 0 25px oklch(var(--a));
      text-decoration: underline;
    }

    &.no-card {
      color: var(--fallback-nc,oklch(var(--nc)/0.8));

      &:hover {
        color: var(--fallback-nc,oklch(var(--nc)/0.3));
        text-shadow: 0 0 25px var(--fallback-nc,oklch(var(--nc)/0.8));
      }
    }
  }
</style>
