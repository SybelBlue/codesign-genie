<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import { libraryJson, rpgJson } from '$lib/decks';
  import ThemeChanger from '$lib/components/ThemeChange.svelte';
  import { availableClasses } from '$lib/stores';
  import DeckChanger from '$lib/components/DeckChange.svelte';

  const withId: <T extends object>(o: T) => Keyed<T> = (function() {
    let nextId = 0;
    return (o) => ({ ...o, id: nextId++ });
  })();

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
  };

  $: cards = decks[currentDeck];
  $: $availableClasses = cards.map(c => c.name);
</script>

<svelte:head>
  <title>CARA / {currentDeck}</title>
  <meta name="description" content="crc card design game" />
</svelte:head>

<ThemeChanger />

<CardBoard {cards} />

<DeckChanger {decks} bind:currentDeck />
