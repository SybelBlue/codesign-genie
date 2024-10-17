<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';
  import type { CommitId, CommitNode, Keyed } from '$lib/types';

  export let timeline: Keyed<CommitNode>[];
  export let currentHead: CommitId;

  let expanded = true;
  const dispatch = createEventDispatcher();

  const expansion = tweened(1, {
    duration: 300,
    easing: cubicOut
  });

  function toggleExpansion() {
    expanded = !expanded;
    expansion.set(expanded ? 1 : 0);
  }

  function setMainLine(node: CommitNode) {
    currentHead = node.commitId;
    dispatch('changeHead', { currentHead });
  }

  function findPathToRoot(node: Keyed<CommitNode> | undefined) {
    const path = [];
    while (node?.parent) {
      path.unshift(node);
      node = timeline.find(n => n.commitId === node?.parent);
    }
    if (node) { path.unshift(node); }
    return path;
  }

  $: currentHeadNode = timeline.find(n => n.commitId === currentHead) ||
    (() => { throw new Error(`CommitId ${currentHead} doesn't exist!`); })();

  $: currentBranch = findPathToRoot(currentHeadNode);

  $: sortedTimeline = timeline.sort((a, b) => b.timestamp - a.timestamp);
</script>

<div class="container mx-auto p-4">
  <button
    class="absolute toggle-btn left-5"
    on:click={toggleExpansion}
  >
    {expanded ? '−' : '+'}
  </button>
  <div class="relative">
    {#if $expansion > 0}
      <div class="timeline" style="opacity: {$expansion}; transform: scaleY({$expansion});">
        {#each sortedTimeline as commit, index (commit.id)}
          <div class="timeline-item" class:current={currentHead == commit.commitId}>
            <div
              class="node"
              on:click={() => setMainLine(commit)}
              class:main={currentBranch.includes(commit)}
              />
            <div class="content">
              <p class="message">{commit.message}</p>
            </div>
            {#if index < sortedTimeline.length - 1}
              <div
                class="connection"
                style="height: {commit.effort * 20}px;"
              ></div>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <div class="collapsed-timeline" style="opacity: {1 - $expansion};">
        {#each sortedTimeline as commit, index (commit.id)}
          {#if index < 5}
            <div
              class="collapsed-item"
              style="height: {commit.effort * 10}px;"
              on:mouseenter={() => dispatch('showMessage', { message: commit.message })}
              on:mouseleave={() => dispatch('hideMessage')}
            ></div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .timeline {
    @apply relative pl-4;
  }
  .timeline-item {
    @apply relative mb-4;
  }
  .node {
    @apply absolute left-0 w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
  }
  .node.main {
    @apply bg-green-500;
  }
  .content {
    @apply ml-6;
  }
  .message {
    @apply font-bold;
  }
  .branch {
    @apply text-sm text-gray-600;
  }
  .connection {
    @apply absolute left-2 w-0.5 bg-gray-300;
    transform: translateX(-50%);
  }
  .collapsed-timeline {
    @apply flex flex-col items-center;
  }
  .collapsed-item {
    @apply w-0.5 bg-gray-300 mb-1 cursor-pointer;
  }
  .toggle-btn {
    @apply absolute top-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer;
  }
</style>