<script lang="ts">
  import { clickOutside } from '$lib/actions';
  import type { Card, Deck } from '$lib/types';
  import ThemeChanger from './ThemeChange.svelte';
  import TimelinePanel from './TimelinePanel.svelte';
  import type { Props as TimelinePanelProps } from './TimelinePanel.svelte';
  import { hasDiff } from '$lib/diff';

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
          out[l.name] = (out[l.name] ?? 0) + 1;
    return out;
  });
  const sortFns: Record<Sorter, (a: Card, b: Card) => number> = {
    none: () => 1,
    alpha: (x, y) => x.name.localeCompare(y.name),
    usage: (x, y) => usageDict[x.name] - usageDict[y.name],
  };

  let displayDeck: Deck = $state(currentDeck);
  $inspect(displayDeck, sorter).with(() => { console.log()})

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
      <div class="join rounded-3xl">
        {#snippet radioButton(label: Sorter, checked = false)}
          <input
            class="join-item btn input-bordered"
            type="radio"
            name="sortOptions"
            aria-label={label}
            onclick={() => (sorter = label)}
            {checked}
          />
        {/snippet}
        {#each Object.keys(sortFns) as Sorter[] as s}
          {@render radioButton(s, s === sorter)}
        {/each}
      </div>
    </nav>
  </div>
  <TimelinePanel show={showTimeline} {currentDeck} {setDisplayDeck} {commits} expand />
</header>
