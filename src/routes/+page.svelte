<script lang="ts">
  import { page } from '$app/stores';
  import type { Keyed } from '$lib/types';
  import CardBoard, { type Props as CardBoardProps } from '$lib/components/CardBoard.svelte';
  import { libraryJson, rpgJson, hospitalJson } from '$lib/decks';
  import ThemeChanger from '$lib/components/ThemeChange.svelte';
  import { availableClasses, debug } from '$lib/stores';
  import DeckChanger from '$lib/components/DeckChange.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import type { Props as CardProps } from '$lib/components/Card.svelte';

  const withId: <T extends object>(o: T) => Keyed<T> = (function() {
    let nextId = 0;
    return (o) => ({ ...o, id: nextId++ });
  })();

  let selectedCard: CardProps | undefined = $state();
  let currentDeck = $state("rpg");
  let decks: Record<string, CardBoardProps['cards']> = $state({
    "rpg": rpgJson.map(card => withId({
      name: card.name,
      responsibilities: card.responsibilities.map(withId),
      collaborators: card.collaborators.map(withId),
    })),
    "library": libraryJson.map(card => withId({
      name: card.name,
      responsibilities: card.responsibilities.map(withId),
      collaborators: card.collaborators.map(withId),
    })),
    "hospital": hospitalJson.map(card => withId({
      name: card.name,
      responsibilities: card.responsibilities.map(withId),
      collaborators: card.collaborators.map(withId),
    })),
  });
  let deckNames = $derived(Object.keys(decks));

  let params = $page.url.searchParams;
  let deckInfo = params.get('customDeckInfo');
  if (deckInfo != null) {
    let json_string = atob(deckInfo);
    let deck = JSON.parse(json_string).response.cards;
    decks['custom'] = deck.map((card: { name: string, responsibilities: string[], collaborators: string[] }) =>
      withId({
        name: card.name,
        responsibilities: card.responsibilities.map((responsibility) => withId({
          text: responsibility
        })),
        collaborators: card.collaborators.map((collaborator) => withId({
          name: collaborator
        }))
      })
    );
    currentDeck = 'custom';
  }

  $effect(() => {
    $availableClasses = decks[currentDeck].map(c => c.name);
  })

  // $debug = true;
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
