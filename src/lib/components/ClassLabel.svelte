<svelte:options immutable/>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { availableClasses } from '$lib/stores';

  /** warning: immutable! make a new label when a change happens*/
  export let name: string;

  /** warning: immutable! make a new label when a change happens*/
  export let disabled: boolean = false;

  let dispatcher = createEventDispatcher();
  const hoverName = (mode: 'starting' | 'ending') => dispatcher('hoverName', { name, mode });

  $: hasCard = $availableClasses.includes(name);
</script>

<span
  on:mouseenter={() => hoverName('starting')}
  on:mouseleave={() => hoverName('ending')}
  on:focus={() => dispatcher('selectName', { name })}
  class:disabled
  class:hasCard
  class="text-accent"
  role="link"
  tabindex=0
  >{name}</span>

<style lang="postcss">
  span {
    font-family: var(--font-mono);

    &.hasCard:not(.disabled):hover {
      @apply underline;
      text-shadow: 0 0 15px oklch(var(--a));
    }

    &:not(.hasCard) {
      color: var(--fallback-nc,oklch(var(--nc)/0.8));

      &:hover {
        color: var(--fallback-nc,oklch(var(--nc)/0.3));
      }
    }
  }
</style>
