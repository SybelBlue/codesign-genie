<script lang="ts">
  import ThemeChanger from './ThemeChange.svelte';
  import TimelinePanel from './TimelinePanel.svelte';
  import type {Props as TimelinePanelProps} from './TimelinePanel.svelte';
  // import DeckChanger from './DeckChanger.svelte';
  // import { deckNames } from '$lib/stores';

  type Props = {
      [Property in keyof TimelinePanelProps as Exclude<Property, "show">]: TimelinePanelProps[Property];
  } & {
    showTimeline?: boolean;
  };

  let {
    showTimeline = false,
    currentDeck,
    setDisplayDeck,
    commits,
  }: Props = $props();

  let showDeck = $state(false);
</script>

<header class="bg-base-100 w-full shadow-md rounded-b-3xl mb-2 z-50">
  <div class="w-full px-4 py-3 flex items-center justify-between">
    <nav class="flex-1 flex items-center gap-4">
      <button class="btn btn-ghost btn-sm" onclickcapture={() => (showTimeline = !showTimeline)}>
        {showTimeline ? 'Hide' : 'Show'} Timeline
      </button>
    </nav>
    <h1 class="text-lg font-mono italic text-accent decoration-primary hover:underline">
      {'{ cara }'}
    </h1>
    <nav class="flex-1 flex items-center gap-4">
      <div class="join rounded-3xl">
        <input class="join-item btn" type="radio" name="options" aria-label="None" />
        <input class="join-item btn" type="radio" name="options" aria-label="Alpha" />
        <input class="join-item btn" type="radio" name="options" aria-label="Recent" />
      </div>
      <ThemeChanger />
    </nav>
  </div>
  <TimelinePanel
    bind:show={showTimeline}
    {currentDeck}
    {setDisplayDeck}
    {commits}
    expand
    />
</header>
