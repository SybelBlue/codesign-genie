<script lang="ts">
    import { slide } from 'svelte/transition';
    import Timeline from './Timeline.svelte';
    
let { show }: { show: boolean } = $props();
  </script>
  
  {#if show}
    <div 
      class="fixed left-0 right-0 top-16 bg-base-200 shadow-lg p-4 overflow-y-auto z-50"
      transition:slide={{duration: 300, axis: 'y'}}
    >
      <Timeline />
    </div>
  {/if}

  