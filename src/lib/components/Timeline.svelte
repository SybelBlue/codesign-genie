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

<div class="timeline relative pl-6 flex flex-col items-start h-full overflow-y-auto">
  {#each commits as commit, index}
    <div
      class="timeline-item relative flex items-center mb-5 w-full z-10"
      on:mouseenter={() => (hoveredCommit = commit)}
      on:mouseleave={() => (hoveredCommit = null)}
    >
      <div class="timeline-point w-3 h-3 rounded-full bg-primary absolute -left-[21px]"></div>
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
  .timeline::before {
    content: '';
    position: absolute;
    top: 10px;
    bottom: 375px; /* top/bottom hardcoded to fit 4 commits */
    left: 5px;
    width: 2px;
    @apply bg-primary;
    z-index: 1;
  }

  /* Ensure the timeline container has enough height for all commits */
  .timeline {
    min-height: 300px; /* Adjust this value based on your needs */
  }
</style>
