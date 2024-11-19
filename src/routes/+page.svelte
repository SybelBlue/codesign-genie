<script lang="ts">
  import { page } from '$app/stores';
  import { availableClasses, debug, deckNames, currentDeck } from '$lib/stores';

  import Editor from '$lib/components/Editor.svelte';
  import { decodeDeck, exampleDecks, withId } from '$lib/decks';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import type { CardProps, Commit, Deck } from '$lib/types';
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
  const mine = false, present = true;
  const [coerceCurr, coercePrev] =
    mine ?
      present ? ['caraMid', 'caraNow'] : ['caraNow', 'caraFuture']
      : ['nelson0', 'nelson1'];
  $effect(() => {
    if ($currentDeck != coerceCurr) $currentDeck = coerceCurr;
  })

  $effect(() => {
    $availableClasses = cards.map((c) => c.name);
  });

  $debug = true;

  let showTimeline = $state(true);

  /// fake data ///
  const randomizedEdits = (deck: Deck) => {
    const out = JSON.parse(JSON.stringify(deck)) as Deck;
    const randomIdx = (list: any[]) => Math.floor(Math.random() * list.length);
    const randomElem = <T>(list: T[]): T => list[randomIdx(list)];
    const changed = [];
    for (let i = 0, n = Math.random() * 4; i < n; i++) {
      const idx = randomIdx(out);
      const card = out[idx];
      const actions = [
        () => card.responsibilities.splice(randomIdx(card.responsibilities), 1),
        () => { let r = randomElem(card.responsibilities); r.description = r.description.replace(/\b\w+$/, '- todo!'); },
        () => { let r = randomElem(card.responsibilities); r.collaborators.splice(randomIdx(r.collaborators), 1); },
        () => { randomElem(card.responsibilities).collaborators.push(withId({ name: randomElem(out).name })) },
      ];
      actions[randomIdx(actions)]();
      changed.push(card);
    }
    return out;
  };

  let lastDeck = cards;
  // const fakeCommits = [
  //   { id: 7, state: (lastDeck = randomizedEdits(lastDeck)), text: 'add C (rand)', date: '11/7/2024' },
  //   { id: 6, state: (lastDeck = randomizedEdits(lastDeck)), text: 'add B (rand)', date: '11/6/2024' },
  //   { id: 5, state: (lastDeck = randomizedEdits(lastDeck)), text: 'add A (rand)', date: '11/5/2024' },
  //   { id: 4, state: [], text: 'removed Dialogue System', date: '11/4/2024' },
  //   { id: 3, state: [], text: 'updated character', date: '11/3/2024' },
  //   { id: 2, state: [], text: 'updated manna', date: '11/2/2024' },
  //   { id: 1, state: [], text: 'initial commit', date: '11/1/2024' },
  // ].toReversed();
  const fakeCommits = [
    // { id: 2, date: '12/XX/2024', text: 'future', state: decks.caraFuture },
    { id: 1, date: '11/10/2024', text: 'now', state: decks[coercePrev] },
  ]
  /// fake data ///
  const commits: Commit[] = fakeCommits;
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
    <TimelinePanel bind:show={showTimeline} currentDeck={cards} {commits}/>
  {/if}
  <CardBoard
    bind:cards={decks[$currentDeck]}
    selectCard={(card) => {
      console.log('Card selected:', card.name);
      selectedCard = card;
    }}
    />
</main>
