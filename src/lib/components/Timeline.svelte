<script module lang="ts">
  export type Commit = {
    id: number;
    text: string;
    date: string;
  };

  export type Props = {
    commits: Commit[];
  };
</script>
<script lang="ts">
  let {
    commits: timelineItems
  }: Props = $props();
</script>

<ul class="timeline timeline-compact timeline-vertical">
  {#each timelineItems as item, index}
    <li>
      {#if index !== 0}<hr />{/if}
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
      <div class="timeline-end timeline-box">
        <div class="font-bold">{item.text}</div>
        <div class="text-sm opacity-70">{item.date}</div>
      </div>
      {#if index !== timelineItems.length - 1}<hr />{/if}
    </li>
  {/each}
</ul>
