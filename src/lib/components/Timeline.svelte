<script lang="ts">
  import { VersionControl } from '../versionControl';
  import { onMount } from 'svelte';

  const vcs = new VersionControl('src/lib/crc-decks/library.json');
  let commits = [];

  onMount(async () => {
    // Simulate some commits for demonstration
    await vcs.commit('Initial commit');
    await vcs.commit('Update card data');
    await vcs.commit('Fix typo in card description');
    commits = vcs.getCommits();
  });

  let hoveredCommit = null;
</script>

<div class="timeline">
  {#each commits as commit, index}
    <div
      class="timeline-item"
      on:mouseenter={() => (hoveredCommit = commit)}
      on:mouseleave={() => (hoveredCommit = null)}
    >
      <div class="timeline-point"></div>
      <div class="timeline-content">
        <span class="commit-id">{commit.id}</span>
        {#if hoveredCommit === commit}
          <div class="commit-message">{commit.message}</div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline {
    position: relative;
    padding: 20px 0;
  }

  .timeline::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    width: 2px;
    background: #ccc;
  }

  .timeline-item {
    position: relative;
    margin-bottom: 20px;
    padding-left: 40px;
  }

  .timeline-point {
    position: absolute;
    left: 16px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
  }

  .timeline-content {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .commit-id {
    font-weight: bold;
  }

  .commit-message {
    margin-top: 5px;
    font-style: italic;
  }
</style>
