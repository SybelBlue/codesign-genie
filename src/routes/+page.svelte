<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import { libraryJson } from '$lib/decks';
  import ThemeChange from '$lib/components/ThemeChange.svelte';
  import Timeline from '$lib/components/Timeline.svelte';

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

  let {timeline, currentHead}: ComponentProps<Timeline> = {
    timeline: [
      { commitId: 1, timestamp: 1, message: "Initial commit", effort: 1 },
      { commitId: 2, timestamp: 2, message: "Add feature A", effort: 2, parent: 1 },
      { commitId: 3, timestamp: 3, message: "Fix bug in feature A", effort: 1, parent: 2 },
      { commitId: 4, timestamp: 4, message: "Add feature B", effort: 3, parent: 2 },
    ].map(withId),
    currentHead: 3,
  };
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="crc card design game" />
</svelte:head>

<Timeline {timeline} {currentHead} />

<ThemeChange />

<!-- <CardBoard {cards} /> -->
