<script module lang="ts">
  export type Props = {
    currentDeck: SimpleDeck;
    commits: Commit[];
    show?: boolean;
    expand?: boolean;
    setDisplayDeck?: (_: Deck) => void;
  };
</script>
<script lang="ts">
  import { slide } from 'svelte/transition';
  import { clickOutside } from '$lib/actions';
  import type { Commit, SimpleDeck, Deck, Keyed, Key } from '$lib/types';
  import microdiff from 'microdiff';

  import Timeline from './Timeline.svelte';

  import { diffDecks } from '$lib/diff';

  let { show = $bindable(), currentDeck, commits, expand = false, setDisplayDeck }: Props = $props();

  let compareDeck: SimpleDeck | undefined = $state(undefined);
  let highlightedCommitId: number = $state(commits[commits.length - 1].id);

  const setCompareCommit = (c: Commit) => {
    compareDeck = c.state;
    highlightedCommitId = c.id;
  }

  let compareDeckOrDefault = $derived(compareDeck ?? commits[commits.length - 1].state);
  let diffedCards = $derived( diffDecks( currentDeck, compareDeckOrDefault, expand ) );

  $effect(() => {
    setDisplayDeck?.(show ? diffedCards : currentDeck);
  })

  $effect(() => {
    const keysToRecord = <T>(data: Keyed<T>[]): Record<Key, Keyed<T>> => {
      const record: Record<Key, Keyed<T>> = {};
      for (const kt of data) record[kt.id] = kt;
      return record;
    }
    const deckToRecord = (deck: Deck) =>
      keysToRecord(deck.map(c => ({...c, responsibilities: keysToRecord(c.responsibilities)})));
    const [cmp, curr] = [deckToRecord(compareDeckOrDefault), deckToRecord(currentDeck)];
    const diff = microdiff(curr, cmp, { cyclesFix: false });
    console.table(diff.map(d => ({...d, path: d.path.join('/')})))
  })
</script>

{#if show}
  <hr class="border-t-2 border-primary mx-4" />
  <div
    class="bg-base-100 p-4 w-fit rounded-lg"
    transition:slide={{ duration: 300, axis: 'y' }}
    use:clickOutside={(e) => { e.stopPropagation(); show = false; }}
    >
    <Timeline
      useCommit={setCompareCommit}
      highlightCommit={highlightedCommitId}
      {commits}
      />
  </div>
{/if}
