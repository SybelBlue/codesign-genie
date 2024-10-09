<svelte:options immutable/>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { highlightedClass } from '$lib/stores';

  /** warning: immutable! make a new label when a change happens*/
  export let name: string;

  /** warning: immutable! make a new label when a change happens*/
  export let disabled: boolean = false;

  let cardSelectDispatcher = createEventDispatcher<{ selectCard: { name: string } }>();
  const selectCard = () => cardSelectDispatcher('selectCard', { name });
</script>

<span
  on:mouseenter={() => $highlightedClass = !disabled && name }
  on:mouseleave={() => $highlightedClass = false }
  on:focus={selectCard}
  class:enabled={!disabled}
  role="link"
  tabindex=0
  >{name}</span>

<style>
  span {
    font-family: var(--font-mono);
    font-size: inherit;
  }
  span.enabled:hover {
    text-shadow: 0 0 25px rgba(81, 203, 238, 1);
  }
</style>
