<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import { libraryJson, rpgJson, hospitalJson } from '$lib/decks';
  import ThemeChanger from '$lib/components/ThemeChange.svelte';
  import { availableClasses, debug } from '$lib/stores';
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
    "hospital": hospitalJson.map(card => withId({
      name: card.name,
      responsibilities: card.responsibilities.map(withId),
      collaborators: card.collaborators.map(withId),
    })),
  };

  $: cards = decks[currentDeck];
  $: $availableClasses = cards.map(c => c.name);

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

<CardBoard {cards} />

<DeckChanger {decks} bind:currentDeck />
