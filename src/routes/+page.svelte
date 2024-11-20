<script lang="ts">
  import { page } from '$app/stores';
  import { debug } from '$lib/stores';

  import Editor from '$lib/components/Editor.svelte';
  import { deckWithIds, exampleDecks } from '$lib/decks';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import type { CardProps } from '$lib/types';
  import Toolbar from '$lib/components/Toolbar.svelte';
  import DeckDialog from '$lib/components/DeckDialog.svelte';
  

  let selectedCard: CardProps | undefined = $state();
  let readyForCommit: boolean = $state(false);

  const deckInfo = $page.url.searchParams.get("deckInfo") ?? btoa("[]");
  const deckName = $page.url.searchParams.get('deckName');
  const deckInit = deckName ? exampleDecks[deckName] : JSON.parse(atob(deckInfo));

  console.log(deckInit);
  let currentDeck = $state(deckInit);

  $debug = false;
</script>

<svelte:head>
  <title>CARA</title>
  <meta name="description" content="crc card design game" />

  <!-- patch to delay page load until theme is ready in deployment -->
  {#if !$debug}
    <script async crossorigin="anonymous">
      var selectedTheme = localStorage.getItem('theme');
      if (selectedTheme) {
        document.documentElement.setAttribute('data-theme', selectedTheme);
      }
    </script>
  {/if}
</svelte:head>

<Toolbar />

<main class="relative grow overflow-visible">
  {#if currentDeck.length == 0}
  <DeckDialog
    loadDeck={(keyedDeck) => {
      currentDeck = keyedDeck;
    }}
    />
  {/if}

  <CardBoard
    bind:cards={currentDeck}
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

Given that we are now upserting the following card, describing the change as "${commit.message}", update both the collaborators on this card and the whole deck to remain consistent. This may involve removing or adding responsibilities, their respective lists of collaborators, or even adding or removing whole cards. Make sure to reproduce all unchanged cards.
\`\`\`json
${JSON.stringify(commit.card)}
\`\`\`
`.trim(),
          schema: 'Deck'
        })
      }).then((response) =>
        response.json().then(({response: deck}) => {
          console.log(deck);
          let keyedDeck = deckWithIds(deck);
          currentDeck = keyedDeck;
        })
      );
      selectedCard = undefined;
    }}
  />
</main>
