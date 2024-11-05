<script lang="ts">
  import { page } from '$app/stores';
  import ThemeChanger from '$lib/components/ThemeChange.svelte';
  import { availableClasses, debug } from '$lib/stores';
  import DeckChanger from '$lib/components/DeckChanger.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import { decodeDeck, exampleDecks } from '$lib/decks';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import type { CardProps } from '$lib/types';
  import { goto } from '$app/navigation';

  let decks = $state(exampleDecks);
  let deckNames = $derived(Object.keys(decks));

  let selectedCard: ComponentProps<Card> | undefined = $state();
  let currentDeck = $state("rpg");

  let params = $page.url.searchParams;
  let deckInfo = params.get('customDeckInfo');
  let readyForCommit: boolean = false;
  if (deckInfo != null) {
    decks['custom'] = decodeDeck(deckInfo);
    currentDeck = 'custom';
  }

  $effect(() => {
    $availableClasses = decks[currentDeck].map(c => c.name);
  })

  $debug = false;
</script>

<svelte:head>
  <title>CARA / {currentDeck}</title>
  <meta name="description" content="crc card design game" />

  <!-- patch to delay pageload until theme is ready in deployment -->
  {#if !$debug}
    <script async crossorigin="anonymous">
      var selectedTheme = localStorage.getItem("theme");
      if(selectedTheme) {
          document.documentElement.setAttribute("data-theme", selectedTheme);
      }
    </script>
  {/if}
</svelte:head>

<ThemeChanger />

<CardBoard
  bind:cards={decks[currentDeck]}
  selectCard={(card) => {
    console.log("Card selected:", card.name)
    readyForCommit = true;
    selectedCard = card;
  }}
  />

<Editor
  bind:card={selectedCard}
  {readyForCommit}
  onCommit={async (commit) => {
    console.log(
      "Commit card",
      commit.message,
      commit.card
    );
    readyForCommit = false;
    await fetch("/api/object", {
      method: "POST",
      body: JSON.stringify({ // TODO: currently we're passing in the deck/card with ids. That may reduce quality
        description: `
Consider this deck:
\`\`\`json
{ "cards" : ${JSON.stringify(decks[currentDeck])} }
\`\`\`

Given that we are now upserting the following card, describing the change as "${commit.message}", update the deck to remain consistent. Reproduce all cards, even if they should be unchanged.
\`\`\`json
${JSON.stringify(commit.card)}
\`\`\`
`.trim(),
        schema: "Deck"
      })
    }).then((response) =>
      response.json().then((deck) => {
        let b64payload = btoa(JSON.stringify(deck));
        goto(`/?customDeckInfo=${b64payload}`);
      })
    );
    selectedCard = undefined;
  }}
  />

<DeckChanger decks={deckNames} bind:currentDeck />
