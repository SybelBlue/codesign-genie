<script>
  import ThemeChanger from './ThemeChange.svelte';
  import DeckChanger from './DeckChanger.svelte';
  import { deckNames } from '$lib/stores';
</script>

<header class="bg-primary text-primary-content shadow-md">
  <div class="container mx-auto px-4 py-5 flex items-center justify-between">
    <h1 class="text-xl font-bold">Cara: Your Codesign Genie</h1>
    <nav class="flex items-center gap-4">
      <a href="/" class="px-2 py-1 hover:underline">Sort</a>
      <DeckChanger decks={$deckNames} />
      <ThemeChanger />
    </nav>
  </div>
</header>
