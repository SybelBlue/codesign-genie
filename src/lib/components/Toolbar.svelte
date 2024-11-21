<script lang="ts">
  import { clickOutside } from '$lib/actions';
  import ThemeChanger from './ThemeChange.svelte';
  import TimelinePanel from './TimelinePanel.svelte';
  import type { Props as TimelinePanelProps } from './TimelinePanel.svelte';

  type Props = {
    [Property in keyof TimelinePanelProps as Exclude<
      Property,
      'show'
    >]: TimelinePanelProps[Property];
  } & {
    showTimeline?: boolean;
  };

  let { showTimeline = false, currentDeck, setDisplayDeck, commits }: Props = $props();
</script>

<header
  class="bg-base-100 w-full shadow-md rounded-b-3xl mb-2 z-50"
  use:clickOutside={() => (showTimeline = false)}
>
  <div class="w-full px-4 py-3 flex items-center justify-between">
    <nav class="flex-1 flex gap-4">
      {#if currentDeck.length > 0 && commits.length > 0}
      <button
        class="btn btn-ghost btn-sm input-bordered"
        onclickcapture={() => (showTimeline = !showTimeline)}
      >
        {showTimeline ? 'Hide' : 'Show'} Timeline
      </button>
      {/if}
    </nav>
    <h1 class="text-lg font-mono italic text-accent decoration-primary hover:underline">
      {'{ cara }'}
    </h1>
    <nav class="flex-1 flex flex-row-reverse gap-4">
      <ThemeChanger />
      <div class="join rounded-3xl">
        {#snippet radioButton(label: string, checked = false)}
          <input
            class="join-item btn input-bordered"
            type="radio"
            name="sortOptions"
            aria-label={label}
            disabled={!checked}
            {checked}
          />
        {/snippet}
        {@render radioButton('none', true)}
        {@render radioButton('alpha')}
        {@render radioButton('recent')}
      </div>
    </nav>
  </div>
  {#if currentDeck.length > 0 && commits.length > 0}
  <TimelinePanel show={showTimeline} {currentDeck} {setDisplayDeck} {commits} expand />
  {/if}
</header>
