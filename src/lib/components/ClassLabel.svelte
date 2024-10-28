<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { highlightedClass, availableClasses } from '$lib/stores';

  interface Props {
    name: string;
    disabled?: boolean;
  }

  let { name, disabled = false }: Props = $props();

  let cardSelectDispatcher = createEventDispatcher<{ selectCard: { name: string } }>();
  const selectCard = () => cardSelectDispatcher('selectCard', { name });

  let hasACard = $derived($availableClasses.includes(name));
</script>

<span
  onmouseenter={() => $highlightedClass = disabled ? undefined : name}
  onmouseleave={() => $highlightedClass = undefined}
  onfocus={selectCard}
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
