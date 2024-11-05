<script lang="ts">
  import { page } from '$app/stores';
  import { availableClasses, debug } from '$lib/stores';
  import DeckChanger from '$lib/components/DeckChanger.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import { decodeDeck, exampleDecks } from '$lib/decks';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import type { CardProps } from '$lib/types';

  let decks = $state(exampleDecks);
  let deckNames = $derived(Object.keys(decks));

  let selectedCard: CardProps | undefined = $state();
  let currentDeck = $state("rpg");

  let params = $page.url.searchParams;
  let deckInfo = params.get('customDeckInfo');
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

<CardBoard
  bind:cards={decks[currentDeck]}
  selectCard={(card) => {
    console.log("Card selected:", card.name)
    selectedCard = card;
  }}
  />

<Editor
  bind:card={selectedCard}
  onCommit={(commit) => {
    console.log(
      "Commit card",
      commit.message,
      commit.card
    );
    selectedCard = undefined;
  }}
  />

<DeckChanger decks={deckNames} bind:currentDeck />
