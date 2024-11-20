<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { debug, currentDeckInit, availableClasses } from '$lib/stores';

  import Editor from '$lib/components/Editor.svelte';
  import { deckWithIds, exampleDecks, withId } from '$lib/decks';
  import CardBoard from '$lib/components/CardBoard.svelte';
  import type { Deck, CardProps, Commit, SimpleDeck } from '$lib/types';
  import Toolbar from '$lib/components/Toolbar.svelte';

  let selectedCard: CardProps | undefined = $state();
  let readyForCommit: boolean = $state(false);

  const rawDeckInfo = $page.url.searchParams.get("deckInfo");
  let cards = currentDeckInit(rawDeckInfo ? atob(rawDeckInfo) : JSON.stringify(exampleDecks.rpg));

  let deckName = $page.url.searchParams.get('deckName');
  if (deckName) {
    console.log(deckName, $cards.length)
    $cards = exampleDecks[deckName];
    console.log($cards.length)
  }

  let displayDeck: Deck | undefined = $state();

  const setDisplayDeck = (d: Deck) => { displayDeck = d; };

  $effect(() => setDisplayDeck($cards))

  $effect(() => {
    // note: prevents all changes!
    $availableClasses = $cards.map((c) => c.name);
  });

  $debug = true;

  /// fake data ///
  const randomizedEdits = (deck: SimpleDeck) => {
    const out = JSON.parse(JSON.stringify(deck)) as SimpleDeck;
    const randomIdx = (list: any[]) => Math.floor(Math.random() * list.length);
    const randomElem = <T>(list: T[]): T => list[randomIdx(list)];
    const changed = [];
    for (let i = 0, n = Math.random() * 4 + 2; i < n; i++) {
      const idx = randomIdx(out);
      const card = out[idx];
      const actions = [
        () => card.responsibilities.splice(randomIdx(card.responsibilities), 1),
        () => card.responsibilities.push(withId({ description: 'todo', collaborators: []})),
        () => { let r = randomElem(card.responsibilities); r.description = r.description.replace(/\b\w+$/, '- todo!'); },
        () => { let r = randomElem(card.responsibilities); r.collaborators.splice(randomIdx(r.collaborators), 1); },
        () => { randomElem(card.responsibilities).collaborators.push(withId({ name: randomElem(out).name })) },
      ];
      actions[randomIdx(actions)]();
      changed.push(card);
    }
    return out;
  };

  // svelte-ignore state_referenced_locally
  const fakeCommits = $derived.by(() => {
    if (!$cards) return [];
    let lastDeck = $cards;
    return [
      { id: 7, state: (lastDeck = randomizedEdits(lastDeck)), text: 'add C (rand)', date: '11/7/2024' },
      { id: 6, state: (lastDeck = randomizedEdits(lastDeck)), text: 'add B (rand)', date: '11/6/2024' },
      { id: 5, state: (lastDeck = randomizedEdits(lastDeck)), text: 'add A (rand)', date: '11/5/2024' },
      { id: 4, state: [], text: 'removed Dialogue System', date: '11/4/2024' },
      { id: 3, state: [], text: 'updated character', date: '11/3/2024' },
      { id: 2, state: [], text: 'updated manna', date: '11/2/2024' },
      { id: 1, state: [], text: 'initial commit', date: '11/1/2024' },
    ].toReversed();
  });
  /// fake data ///
  const commits: Commit[] = $derived(fakeCommits);
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

<Toolbar currentDeck={$cards} {setDisplayDeck} {commits} />
<main class="overflow-scroll snap-y">
  <!-- sets the sizing for Editor -->
  <div class="absolute w-full h-full">
    <Editor
      bind:card={selectedCard}
      {readyForCommit}
      onCommit={async (commit) => {
        console.log('Commit card', commit.message, commit.card);
        readyForCommit = false;
        await fetch('/api/object', {
          method: 'POST',
          body: JSON.stringify({
            // TODO: currently we're passing in the deck/card with ids. That may reduce quality
            description: `
  Consider this deck:
  \`\`\`json
  { "cards" : ${JSON.stringify($cards)} }
  \`\`\`

  Given that we are now upserting the following card, describing the change as "${commit.message}", update both the collaborators on this card and the whole deck to remain consistent. This may involve removing or adding responsibilities, their respective lists of collaborators, or even adding or removing whole cards. Make sure to reproduce all unchanged cards.
  \`\`\`json
  ${JSON.stringify(commit.card)}
  \`\`\`
  `.trim(),
            schema: 'Deck'
          })
        }).then((response) =>
          response.json().then(({response: deck}) => {
            console.log(deck);
            let deckInfo = btoa(JSON.stringify(deckWithIds(deck)));
            goto(`/?deckInfo=${deckInfo}`)
          })
        );
        selectedCard = undefined;
      }}
      />
  </div>
  <CardBoard
    cards={displayDeck ?? $cards}
    selectCard={(card) => {
      console.log('Card selected:', card.name);
      readyForCommit = true;
      selectedCard = card;
    }}
    />
</main>
