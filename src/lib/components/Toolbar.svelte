<script lang="ts">
  import ThemeChanger from './ThemeChange.svelte';
  import DeckChanger from './DeckChanger.svelte';
  import { deckNames } from '$lib/stores';
</script>

<header class="shadow-md rounded-b-3xl mb-2">
  <div class="container mx-auto px-4 py-3 flex items-center justify-between">
    <h1 class="text-lg font-mono italic text-accent decoration-primary hover:underline">
      {"{ cara }"}
    </h1>
    <nav class="flex items-center gap-4">
      <a href="/" class="px-2 py-1 hover:underline">Sort</a>
      <DeckChanger decks={$deckNames} />
      <DeckChanger decks={$deckNames} />
      <ThemeChanger />
    </nav>
  </div>
</header>
