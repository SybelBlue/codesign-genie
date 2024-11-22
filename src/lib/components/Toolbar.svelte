<script lang="ts">
  import { clickOutside } from '$lib/actions';
  import type { Card, Deck } from '$lib/types';
  import ThemeChanger from './ThemeChange.svelte';
  import TimelinePanel from './TimelinePanel.svelte';
  import type { Props as TimelinePanelProps } from './TimelinePanel.svelte';
  import { hasDiff, undiffWords } from '$lib/diff';

  type Props = Omit<TimelinePanelProps, 'show'> & {
    showTimeline?: boolean;
  };

  let { showTimeline = false, currentDeck, setDisplayDeck: setCardBoardDeck, commits }: Props = $props();

  type Sorter = 'none' | 'alpha' | 'usage';

  let sorter: Sorter = $state('none');
  const usageDict: Record<string, number> = $derived.by(() => {
    const out: Record<string, number> = {};
    for (const c of currentDeck)
      for (const r of c.responsibilities)
        for (const l of r.collaborators)
          out[undiffWords(l.name)] = (out[undiffWords(l.name)] ?? 0) + 1;
    return out;
  });
  const sortFns: Record<Sorter, (a: Card, b: Card) => number> = {
    none: () => 1,
    alpha: (x, y) => undiffWords(x.name).localeCompare(undiffWords(y.name)),
    usage: (x, y) => usageDict[undiffWords(y.name)] - usageDict[undiffWords(x.name)],
  };

  let displayDeck: Deck = $state(currentDeck);

  const setDisplayDeck: Props['setDisplayDeck'] = (d) => (displayDeck = d);

  $effect(() => {
    if (!setCardBoardDeck) return;
    const base = sorter === 'none'
      ? displayDeck
      : displayDeck.toSorted(sortFns[sorter]);

    const out: Deck = [], unchanged: Deck = [];
    for (const c of base) {
      (hasDiff(c) ? out : unchanged).push(c);
    }
    setCardBoardDeck([...out, ...unchanged]);
  })

</script>

<header
  class="bg-base-100 w-full shadow-md rounded-b-3xl mb-2 z-50"
  use:clickOutside={() => (showTimeline = false)}
>
  <div class="w-full px-4 py-3 flex items-center justify-between">
    <nav class="flex-1 flex gap-4">
      <button
        class="btn btn-ghost btn-sm input-bordered"
        onclickcapture={() => (showTimeline = !showTimeline)}
      >
        {showTimeline ? 'Hide' : 'Show'} Timeline
      </button>
    </nav>
    <h1 class="text-lg font-mono italic text-accent decoration-primary hover:underline">
      {'{ cara }'}
    </h1>
    <nav class="flex-1 flex flex-row-reverse gap-4">
      <ThemeChanger />
      <div class="join rounded-3xl my-auto">
        {#each Object.keys(sortFns) as Sorter[] as s}
          <input
            class="join-item btn btn-sm"
            type="radio"
            name="sortOptions"
            aria-label={s}
            onclick={() => (sorter = s)}
            checked={sorter === s}
          />
        {/each}
      </div>
    </nav>
  </div>
  <TimelinePanel show={showTimeline} {currentDeck} {setDisplayDeck} {commits} expand />
</header>
