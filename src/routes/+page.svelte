<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import type { Deck, Commit, SimpleDeck, SimpleCard } from '$lib/types';
  import { debug, currentDeckInit, availableClasses, highlightedClass } from '$lib/stores';
  import { deckWithIds, exampleDecks, withId } from '$lib/decks';

  import Editor from '$lib/components/Editor.svelte';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import Toolbar from '$lib/components/Toolbar.svelte';
  import { slide } from 'svelte/transition';

  let selectedCard: SimpleCard | undefined = $state();
  let readyForCommit: boolean = $state(false);

  const rawDeckInfo = $page.url.searchParams.get('deckInfo');
  let cards: SimpleDeck = $state(rawDeckInfo ? JSON.parse(atob(rawDeckInfo)) as SimpleDeck : exampleDecks.rpg);

  let deckName = $page.url.searchParams.get('deckName');
  if (deckName && deckName in exampleDecks) {
    // svelte-ignore state_referenced_locally
      console.log('loading by name:', deckName, cards.length, exampleDecks[deckName].length);
    // todo - this doesn't actually set cards?
    cards = exampleDecks[deckName];
  }

  let displayDeck: Deck | undefined = $state();

  const setDisplayDeck = (d: Deck) => {
    displayDeck = d;
  };

  // changes to cards overwrites the display deck
  $effect(() => setDisplayDeck(cards));

  $effect(() => {
    // note: prevents all other changes to $availableClasses!
    $availableClasses = cards.map((c) => c.name);
  });

  highlightedClass.subscribe(console.log)

  $debug = true;

  /// fake data ///
  const randomizedEdits = (deck: SimpleDeck) => {
    const out = JSON.parse(JSON.stringify(deck)) as SimpleDeck;
    const randomIdx = (list: any[]) => Math.floor(Math.random() * list.length);
    const randomElem = <T,>(list: T[]): T => list[randomIdx(list)];
    const changed = [];
    for (let i = 0, n = Math.random() * 4; i < n; i++) {
      const idx = randomIdx(out);
      const card = out[idx];
      const actions = [
        () => card.responsibilities.splice(randomIdx(card.responsibilities), 1),
        () => {
          let r = randomElem(card.responsibilities);
          r.description = r.description.replace(/\b\w+$/, '- todo!');
        },
        () => {
          let r = randomElem(card.responsibilities);
          r.collaborators.splice(randomIdx(r.collaborators), 1);
        },
        () => {
          randomElem(card.responsibilities).collaborators.push(
            withId({ name: randomElem(out).name })
          );
        }
      ];
      actions[randomIdx(actions)]();
      changed.push(card);
    }
    return out;
  };

  // svelte-ignore state_referenced_locally
  const fakeCommits = (() => {
    if (!cards) return [];
    let lastDeck = cards;
    return [
      {
        id: 7,
        state: (lastDeck = randomizedEdits(lastDeck)),
        text: 'add C (rand)',
        date: '11/7/2024'
      },
      {
        id: 6,
        state: (lastDeck = randomizedEdits(lastDeck)),
        text: 'add B (rand)',
        date: '11/6/2024'
      },
      {
        id: 5,
        state: (lastDeck = randomizedEdits(lastDeck)),
        text: 'add A (rand)',
        date: '11/5/2024'
      },
      { id: 4, state: [], text: 'removed Dialogue System', date: '11/4/2024' },
      { id: 3, state: [], text: 'updated character', date: '11/3/2024' },
      { id: 2, state: [], text: 'updated manna', date: '11/2/2024' },
      { id: 1, state: [], text: 'initial commit', date: '11/1/2024' }
    ].toReversed();
  })();
  /// fake data ///
  const commits: Commit[] = $state(fakeCommits);

  const onProposeEdit = async (card: SimpleCard, message: string) => {
    console.log('Propose card', message, card);
    readyForCommit = false;
    const response = await fetch('/api/object', {
      method: 'POST',
      body: JSON.stringify({
        // TODO: currently we're passing in the deck/card with ids. That may reduce quality
        description: `Consider this deck:\n\`\`\`json\n{ "cards" : ${JSON.stringify(cards)} }\n\`\`\`\n\nGiven that we are now upserting the following card, describing the change as "${message}", update both the collaborators on this card and the whole deck to remain consistent. This may involve removing or adding responsibilities, their respective lists of collaborators, or even adding or removing whole cards. Make sure to reproduce all unchanged cards.\n\`\`\`json\n${JSON.stringify(card)}\n\`\`\``,
        schema: 'Deck'
      })
    });
    selectedCard = undefined;
    const { response: deck } = await response.json();
    console.log(deck);
    let deckInfo = btoa(JSON.stringify(deckWithIds(deck)));
    goto(`/?deckInfo=${deckInfo}`);
  };
  const onRename = (oldName: string, newName: string) => {
    const newDeck = JSON.parse(JSON.stringify(cards).replaceAll(new RegExp('\\b' + oldName + '\\b', 'g'), newName)) as SimpleDeck;
    commits.push(withId({
      date: new Date().toLocaleDateString(),
      text: `Rename \`${oldName}\``,
      state: newDeck,
    }))
    console.log(newDeck);
    cards = newDeck;
    selectedCard = cards.find(c => c.name === newName);
  };
  const onSelectCard = (card: Deck[number]) => {
    console.log('Card selected:', card.name);
    readyForCommit = true;
    selectedCard = cards.find((c) => c.id === card.id);
  };
</script>

<svelte:head>
  <title>CARA</title>
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

<Toolbar currentDeck={cards} {setDisplayDeck} {commits} />

<main class="flex w-screen max-h-full overflow-hidden">
  <div class:split={selectedCard} class="transition-all min-h-full max-h-full">
    {#if selectedCard}
      <Editor
        card={selectedCard}
        propose={onProposeEdit}
        close={() => (selectedCard = undefined)}
        {readyForCommit}
      />
    {/if}
  </div>
  <div class="static split">
    <CardBoard cards={displayDeck ?? cards} selectCard={onSelectCard}/>
  </div>
</main>

<style lang="postcss">
  .split {
    @apply flex-1;
  }
</style>
