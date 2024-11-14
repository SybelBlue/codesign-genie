<script lang="ts">
  import { page } from '$app/stores';

  import { debug } from '$lib/stores';
  import type { CardProps, Deck } from '$lib/types';

  import ThemeChanger from '$lib/components/ThemeChange.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import CardBoard from '$lib/components/CardBoard.svelte';

  import { currentDeck } from '$lib/stores';
  import { deckWithIds, exampleDecks } from '$lib/decks';

  let selectedCard: CardProps | undefined = $state();
  let readyForCommit: boolean = $state(false);

  let deckName = $page.url.searchParams.get('deck');
  if (deckName) {
    currentDeck.set(exampleDecks[deckName]);
  }

  let clearDeck = $page.url.searchParams.get('clearDeck');
  if (clearDeck) {
    currentDeck.set([]);
  }

  $debug = false;
</script>

<svelte:head>
  <title>CARA</title>
  <meta name="description" content="crc card design game" />

  <!-- patch to delay pageload until theme is ready in deployment -->
  {#if !$debug}
    <script async crossorigin="anonymous">
      var selectedTheme = localStorage.getItem('theme');
      if (selectedTheme) {
        document.documentElement.setAttribute('data-theme', selectedTheme);
      }
    </script>
  {/if}
</svelte:head>

<ThemeChanger />

<CardBoard
  bind:cards={$currentDeck}
  selectCard={(card) => {
    console.log('Card selected:', card.name);
    readyForCommit = true;
    selectedCard = card;
  }}
/>

<Editor
  bind:card={selectedCard}
  {readyForCommit}
  onCommit={async (commit) => {
    console.log('Commit card', commit.message, commit.card);
    readyForCommit = false;
    await fetch('/api/object', {
      method: 'POST',
      body: JSON.stringify({
        // TODO: currently we're passing in the deck/card with ids. That may reduce quality
        description: `
Consider this deck:
\`\`\`json
{ "cards" : ${JSON.stringify(currentDeck)} }
\`\`\`

Given that we are now upserting the following card, describing the change as "${commit.message}", update the deck to remain consistent. Reproduce all cards, even if they should be unchanged.
\`\`\`json
${JSON.stringify(commit.card)}
\`\`\`
`.trim(),
        schema: 'Deck'
      })
    }).then((response) =>
      response.json().then((deck: Deck) => {
        currentDeck.set(deckWithIds(deck));
      })
    );
    selectedCard = undefined;
  }}
/>
