<script lang="ts">
  import ThemeChanger from './ThemeChange.svelte';
  import DeckChanger from './DeckChanger.svelte';
  import { deckNames } from '$lib/stores';

  let showTimeline = $state(false);
</script>

<header class="shadow-md rounded-b-3xl mb-2">
  <div class="container mx-auto px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-4">
        <nav class="flex items-center gap-4"> 
          <button 
            class="btn btn-ghost btn-sm" 
            on:click={() => showTimeline = !showTimeline}
          >
            {showTimeline ? 'Hide' : 'Show'} Timeline
          </button>
      </nav>
    </div>
    <h1 class="text-lg font-mono italic text-accent decoration-primary hover:underline">
      {"{ cara }"}
    </h1>
    <nav class="flex items-center gap-4">
      <a href="/" class="px-2 py-1 hover:underline">Sort</a>
      <DeckChanger decks={$deckNames} />
      <ThemeChanger />
    </nav>
</header>

