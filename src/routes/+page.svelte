<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import { libraryJson, rpgJson } from '$lib/decks';
  import ThemeChange from '$lib/components/ThemeChange.svelte';
  import { availableClasses } from '$lib/stores';

  const withId: <T extends object>(o: T) => Keyed<T> = (function() {
    let nextId = 0;
    return (o) => ({ ...o, id: nextId++ });
  })();

  let cards: ComponentProps<CardBoard>['cards'] =
    rpgJson.map(card => withId({
      name: card.name,
      responsibilities: card.responsibilities.map(withId),
      collaborators: card.collaborators.map(withId),
    })
  );

  $availableClasses = cards.map(c => c.name);
</script>

<svelte:head>
  <title>CRC Designer</title>
  <meta name="description" content="crc card design game" />
</svelte:head>

<ThemeChange />

<CardBoard {cards} />
