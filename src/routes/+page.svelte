<script lang="ts">
  import { page } from '$app/stores';
  import { availableClasses, debug, deckNames, currentDeck } from '$lib/stores';

  import Editor from '$lib/components/Editor.svelte';
  import { decodeDeck, exampleDecks } from '$lib/decks';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import type { CardProps } from '$lib/types';
  import Toolbar from '$lib/components/Toolbar.svelte';
  import TimelinePanel from '$lib/components/TimelinePanel.svelte';

  let decks = $state(exampleDecks);

  // Update store when decks change
  $effect(() => {
    $deckNames = Object.keys(decks);
  });

  let selectedCard: CardProps | undefined = $state();

  let params = $page.url.searchParams;
  let deckInfo = params.get('customDeckInfo');
  if (deckInfo != null) {
    decks['custom'] = decodeDeck(deckInfo);
    $currentDeck = 'custom';
  }

  let cards = $derived(decks[$currentDeck]);

  $effect(() => {
    $availableClasses = cards.map((c) => c.name);
  });

  $debug = true;

  let showTimeline = $state($debug);
</script>

<svelte:head>
  <title>CARA / {$currentDeck}</title>
  <meta name="description" content="crc card design game" />

  <!-- patch to delay page load until theme is ready in deployment -->
  {#if !$debug}
    <script async crossorigin="anonymous">
      var selectedTheme = localStorage.getItem('theme');
      if (selectedTheme) {
        document.documentElement.setAttribute('data-theme', selectedTheme);
      }
    </script>
  {/if}
</svelte:head>

<Toolbar bind:showTimeline={showTimeline} />

<main class="overflow-scroll snap-y">
  <!-- sets the sizing for Editor -->
  <div class="absolute w-full h-full">
    <Editor
      bind:card={selectedCard}
      onCommit={(commit) => {
        console.log('Commit card', commit.message, commit.card);
        selectedCard = undefined;
      }}
      />
  </div>
  {#if cards}
    <TimelinePanel bind:show={showTimeline} baseCard={cards[0]}/>
  {/if}
  <CardBoard
    bind:cards={decks[$currentDeck]}
    selectCard={(card) => {
      console.log('Card selected:', card.name);
      selectedCard = card;
    }}
    />
</main>
