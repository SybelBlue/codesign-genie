<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import { libraryJson } from '$lib/decks';

  const withId: <T extends object>(o: T) => Keyed<T> = (function() {
    let nextId = 0;
    return (o) => ({ ...o, id: nextId++ });
  })();


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

<CardBoard {cards} />
