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

  $: sortedTimeline = timeline.sort((a, b) => b.timestamp - a.timestamp).toReversed();
</script>

<div class="container mx-5 p-4 flex flex-col">
  <button
    class="toggle-btn z-10"
    on:click={toggleExpansion}
  >
    {expanded ? '−' : '+'}
  </button>

  {#if $expansion > 0}
    <ul
      class="timeline timeline-vertical text-base-content min-h-full w-100"
      style="opacity: {$expansion}; transform: scaleY({$expansion});"
      >
      {#each sortedTimeline as commit, index (commit.id)}
        {@const current = currentHead == commit.commitId}
        <li>
          <hr class="connection top"/>
          <button
            class:current
            class:main={currentBranch.includes(commit)}
            class="node timeline-middle"
            on:click={() => setMainLine(commit)}
            >
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
          </button>
          <div class:current class="timeline-end timeline-box">{commit.message}</div>
          {#if index < sortedTimeline.length - 1}
            <hr
              class="connection bottom"
              style="height: {commit.effort * 20}px;"
              />
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <div class="collapsed-timeline" style="opacity: {1 - $expansion};">
      {#each sortedTimeline as commit, index (commit.id)}
        {#if index < 5}
          <div
            class="collapsed-item"
            style="height: {commit.effort * 10}px;"

            role="listitem"
          ></div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  .node {
    @apply cursor-pointer;
  }
  .node.main > svg {
    @apply text-secondary;
  }
  .node.current > svg {
    @apply text-accent;
  }
  .connection {
    @apply bg-primary;
  }
  .collapsed-timeline {
    @apply flex flex-col items-center;
  }
  .collapsed-item {
    @apply hover:bg-accent w-0.5 bg-gray-300 mb-1 cursor-pointer;
  }
  .toggle-btn {
    @apply absolute top-5 left-5 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer;
  }
</style>