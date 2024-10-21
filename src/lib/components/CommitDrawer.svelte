<script lang="ts">
  import { slide } from 'svelte/transition';
  import { VersionControl } from '../versionControl';
  import Timeline from './Timeline.svelte';

  export let isOpen = false;
  export let commitHistory = 4;
  export let vcs: VersionControl;

  let commits = [];

  $: {
    if (isOpen) {
      commits = vcs.getCommits();
    }
  }

  function toggleDrawer() {
    isOpen = !isOpen;
  }
</script>

<div class="fixed top-0 left-0 h-screen z-50">
  <button
    class="absolute top-4 left-4 w-12 h-12 bg-primary text-primary-content rounded-full cursor-pointer flex items-center justify-center opacity-30"
    title="Commit History"
    on:click={toggleDrawer}
  >
    <div class="commit-indicator" style="height: {commitHistory}px;"></div>
  </button>

  {#if isOpen}
    <div
      class="drawer fixed top-0 left-0 w-80 h-screen bg-base-200 bg-opacity-95 shadow-lg p-6 overflow-y-auto"
      transition:slide={{ duration: 300 }}
    >
      <button
        class="absolute top-4 right-4 text-2xl font-bold text-base-content hover:text-primary"
        on:click={toggleDrawer}
      >
        &times;
      </button>
      <h2 class="text-xl font-bold mb-4 text-base-content">Commit History</h2>
      <Timeline />
    </div>
  {/if}
</div>

<style>
  .commit-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    background: currentColor;
    transition: height 0.3s ease;
    opacity: 20%;
  }
</style>
