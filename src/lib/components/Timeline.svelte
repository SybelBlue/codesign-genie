<script lang="ts">
    type TimelineItem {
        id: number;
        text: string;
        date: string;
    }
    // hardcoded for until data is pulled from diff
    const timelineItems: TimelineItem[] = [
      { id: 1, text: "initial commit", date: "11/14/2024" },
      { id: 2, text: "updated manna", date: "11/14/2024" },
      { id: 3, text: "updated character", date: "11/14/2024" },
      { id: 4, text: "removed Dialogue System", date: "11/14/2024" },
      { id: 5, text: "add Power up System", date: "11/14/2024" }
    ];
  
  </script>
  {#snippet checkmarkIcon()}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="h-5 w-5">
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clip-rule="evenodd" />
    </svg>
  {/snippet}
  <!-- use {@render checkmarkIcon()} instead of {@html checkmarkIcon} -->
  <ul class="timeline timeline-vertical">
    {#each timelineItems as item, index}
      <li>
        {#if index !== 0}<hr />{/if}
        <div class="timeline-middle">
          {@render checkmarkIcon()}
        </div>
        <div class="timeline-end timeline-box">
          <div class="font-bold">{item.text}</div>
          <div class="text-sm opacity-70">{item.date}</div>
        </div>
        {#if index !== timelineItems.length - 1}<hr />{/if}
      </li>
    {/each}
  </ul>