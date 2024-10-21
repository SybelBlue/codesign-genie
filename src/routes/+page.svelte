<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import { libraryJson } from '$lib/decks';
  import ThemeChange from '$lib/components/ThemeChange.svelte';

  const withId: <T extends object>(o: T) => Keyed<T> = (function () {
    let nextId = 0;
    return (o) => ({ ...o, id: nextId++ });
  })();

  let cards: ComponentProps<CardBoard>['cards'] = libraryJson.map((card) =>
    withId({
      name: card.name,
      responsibilities: card.responsibilities.map(withId),
      collaborators: card.collaborators.map(withId)
    })
  );

  let commitCost = 0;

  function handleCardEdit(event) {
    // Update the commitCost based on the edit
    commitCost += 1; // You can implement a more sophisticated cost calculation here
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="crc card design game" />
</svelte:head>

<ThemeChange />

<h1>Welcome to the Codesign Genie</h1>

<CardBoard {cards} on:cardEdit={handleCardEdit} />

<style>
  h1 {
    margin-bottom: 1rem;
  }
</style>
