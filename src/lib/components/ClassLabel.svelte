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
  on:mouseenter={() => $highlightedClass = disabled ? undefined : name }
  on:mouseleave={() => $highlightedClass = undefined }
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

    &.enabled:hover {
      @apply underline;
      text-shadow: 0 0 15px oklch(var(--a));
    }

    &.no-card {
      color: var(--fallback-nc,oklch(var(--nc)/0.8));

      &:hover {
        color: var(--fallback-nc,oklch(var(--nc)/0.3));
      }
    }
  }
</style>
