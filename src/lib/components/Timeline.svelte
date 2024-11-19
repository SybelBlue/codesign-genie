<script module lang="ts">
  import type { Commit } from "$lib/types";

  export type Props = {
    commits: Commit[];
    vertical?: boolean;
  };
</script>
<script lang="ts">
  let {
    commits: timelineItems,
    vertical
  }: Props = $props();
</script>
<ul class="timeline timeline-compact max-h-full overflow-scroll" class:vertical={vertical}>
  {#each timelineItems.toReversed() as item, index}
    <li>
      <hr />
      <div class="timeline-middle">
        <!-- checkmark icon -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="timeline-end timeline-box snap-start">
        <div class="font-bold">{item.text}</div>
        <div class="text-sm opacity-70">{item.date}</div>
      </div>
      {#if index !== timelineItems.length - 1}<hr />{/if}
    </li>
  {/each}
</ul>

<style lang="postcss">
  ul {
    &.vertical {
      @apply timeline-vertical snap-y;
    }
    &:not(.vertical) {
      @apply timeline-horizontal snap-x;
    }
  }
</style>