<svelte:options immutable/>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { highlightedClass } from '$lib/stores';

  /** warning: immutable! make a new label when a change happens*/
  export let name: string;

  /** warning: immutable! make a new label when a change happens*/
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{ selectCard: { name: string } }>();
</script>

<span
  on:mouseenter={() => $highlightedClass = !disabled && name }
  on:mouseleave={() => $highlightedClass = false }
  on:focus={() => dispatch('selectCard', { name })}
  role="link"
  tabindex=0
  >{name}</span>

<style>
  span {
    font-family: var(--font-mono);
    font-size: inherit;
  }
</style>
