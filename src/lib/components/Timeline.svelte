<script lang="ts">
  import { VersionControl } from '../versionControl';
  import { onMount } from 'svelte';
  // import { onMount, afterUpdate } from 'svelte';

  const vcs = new VersionControl('src/lib/crc-decks/library.json');
  let commits = [];

  onMount(async () => {
    // Simulate some commits for demonstration
    await vcs.commit('Initial commit');
    await vcs.commit('Update Book responsibilities');
    await vcs.commit('Add Member collaborator to Report Class');
    await vcs.commit('Add Book to Catalog collaborators');
    commits = vcs.getCommits();
  });

  let hoveredCommit = null;
</script>

<div class="timeline relative pl-10 flex flex-col items-start h-full overflow-y-auto">
  <div class="timeline-line"></div>
  {#each commits as commit, index}
    <div
      class="timeline-item relative flex items-center mb-5 w-full z-10"
      on:mouseenter={() => (hoveredCommit = commit)}
      on:mouseleave={() => (hoveredCommit = null)}
    >
      <div class="timeline-point w-4 h-4 rounded-full bg-primary absolute -left-[12px]"></div>
      <div class="timeline-content bg-base-300 rounded p-2 flex-grow">
        <span class="commit-id font-bold text-xs block text-base-content">{commit.id}</span>
        {#if hoveredCommit === commit}
          <div class="commit-message mt-1 italic text-xs text-base-content">{commit.message}</div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline {
    position: relative;
    min-height: 300px; /* Ensure minimum height */
  }

  .timeline-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 13px;
    width: 2px;
    background-color: hsl(var(--p));
    color: currentColor;
    z-index: 1;
  }

  .timeline-point {
    transform: translateX(-50%); /* Center the dot on the line */
  }

  .timeline-item {
    position: relative;
  }
</style>
