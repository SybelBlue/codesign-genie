<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import { exampleDecks } from '$lib/decks';
  import { currentDeck } from '$lib/stores';

  if (!browser) {
    console.error("Don't try to start with a deck outside of a browser!");
  }

  let deckName = $page.url.searchParams.get('name');
  deckName = deckName ?? 'rpg';

  currentDeck.set(exampleDecks[deckName]);
  goto('/');
</script>
