<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet<[]>;
  }

  let { children }: Props = $props();
</script>

<div id="app">
  {@render children?.()}
</div>

<style lang="postcss">
  #app {
    @apply flex flex-col p-0 m-auto min-h-[100vh] min-w-[100vw] box-border;
  }
</style>
