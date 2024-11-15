<script lang="ts">
  import ThemeChanger from './ThemeChange.svelte';
  // import DeckChanger from './DeckChanger.svelte';
  import TimelinePanel from './TimelinePanel.svelte';
  // import { deckNames } from '$lib/stores';

  let showTimeline = $state(false);
  let showDeck = $state(false);
</script>

<header class="sticky top-0 w-full shadow-md rounded-b-3xl mb-2 z-50">
  <div class="w-full px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <nav class="flex items-center gap-4">
        <button class="btn btn-ghost btn-sm" onclick={() => (showTimeline = !showTimeline)}>
          {showTimeline ? 'Hide' : 'Show'} Timeline
        </button>
      </nav>
    </div>
    <h1 class="text-lg font-mono italic text-accent decoration-primary hover:underline">
      {'{ cara }'}
    </h1>
    <nav class="flex items-center gap-4">
      <a href="/" class="px-2 py-1 hover:underline">Sort</a>

      <!-- button disabled for now until milestone 2: 11/2
      <DeckChanger decks={$deckNames} />
      -->
      <button class="btn btn-ghost btn-sm" onclick={() => (showDeck = !showDeck)}>
        {showDeck ? 'library' : 'rpg'}
      </button>
      <ThemeChanger />
    </nav>
  </div>
</header>

<TimelinePanel show={showTimeline} />
