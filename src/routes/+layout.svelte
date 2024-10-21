<script>
  import '../app.css';
  import Timeline from '$lib/components/Timeline.svelte';
  import CommitDrawer from '$lib/components/CommitDrawer.svelte';
  import { VersionControl } from '$lib/versionControl';

  const vcs = new VersionControl('src/lib/crc-decks/library.json');
  let commitHistory = 0;
  let isDrawerOpen = false;
</script>

<CommitDrawer {isDrawerOpen} {commitHistory} {vcs} />

<div class="app">
  <div class="cards-container">
    <slot />
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    gap: 2rem;
    padding: 1rem;
    box-sizing: border-box;
  }

  .cards-container {
    flex: 1;
    overflow-y: auto;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
</style>
