<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import { libraryJson } from '$lib/decks';
  import ThemeChange from '$lib/components/ThemeChange.svelte';
  import Editor from '$lib/components/Editor.svelte';

  const withId: <T extends object>(o: T) => Keyed<T> = (function() {
    let nextId = 0;
    return (o) => ({ ...o, id: nextId++ });
  })();

  let selectedCard: ComponentProps<Card> | false = false;
  let cards: ComponentProps<CardBoard>['cards'] =
    libraryJson.map(card => withId({
      name: card.name,
      responsibilities: card.responsibilities.map(withId),
      collaborators: card.collaborators.map(withId),
    })
  );
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="crc card design game" />
</svelte:head>

<ThemeChange />

<CardBoard 
  {cards}
  on:cardSelected={(data) => {
    console.log("Card selected:", data.detail)
    selectedCard = data.detail.card;
  }}
  />

<Editor
  {selectedCard}
  />
