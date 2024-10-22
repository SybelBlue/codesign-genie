<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { page } from '$app/stores';
  import type { Keyed } from '$lib/types';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import { libraryJson, rpgJson, hospitalJson } from '$lib/decks';
  import ThemeChanger from '$lib/components/ThemeChange.svelte';
  import { availableClasses, debug } from '$lib/stores';
  import DeckChanger from '$lib/components/DeckChange.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import Card from '$lib/components/Card.svelte';
  import { goto } from '$app/navigation';

  const withId: <T extends object>(o: T) => Keyed<T> = (function() {
    let nextId = 0;
    return (o) => ({ ...o, id: nextId++ });
  })();

  let selectedCard: ComponentProps<Card> | undefined = undefined;
  let currentDeck = "rpg";
  let decks: Record<string, ComponentProps<CardBoard>['cards']> = {
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
  };

  let params = $page.url.searchParams;
  let deckInfo = params.get('customDeckInfo');
  let readyForCommit: boolean = false;
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

  $: cards = decks[currentDeck];
  $: $availableClasses = cards.map(c => c.name);

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
  bind:cards
  on:cardSelected={(data) => {
    console.log("Card selected:", data.detail)
    readyForCommit = true;
    selectedCard = data.detail.card;
  }}
  />

<Editor
  card={selectedCard}
  on:commit={async data => {
    console.log(
      "Commit card",
      data.detail.message,
      data.detail.card
    );
    readyForCommit = false;
    await fetch("/api/object", {
      method: "POST",
      body: JSON.stringify({ // TODO: currently we're passing in the deck/card with ids. That may reduce quality
        description: `
Consider this deck:
\`\`\`json
{ "cards" : ${JSON.stringify(cards)} }
\`\`\`

Given that we are now upserting the following card, describing the change as "${data.detail.message}", update the deck to remain consistent. Reproduce all cards, even if they should be unchanged.
\`\`\`json
${JSON.stringify(data.detail.card)}
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

<DeckChanger {decks} bind:currentDeck />
