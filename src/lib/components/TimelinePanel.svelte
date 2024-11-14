<script lang="ts">
    import { slide } from 'svelte/transition';
    import Timeline from './Timeline.svelte';
    
    export let show: boolean;
</script>
  
{#if show}
  <div 
    class="fixed left-0 right-0 top-16 bg-base-200 shadow-lg p-4 overflow-y-auto z-50"
    transition:slide={{duration: 300, axis: 'y'}}
  >
    <div class="container mx-auto">
      <div class="grid grid-cols-3 gap-4">
        <!-- Column 1: Timeline -->
        <div class="col-span-1">
          <Timeline />
        </div>
        
        <!-- Column 2: Placeholder -->
        <div class="col-span-1 bg-base-100 p-4 rounded-lg">
          <h3 class="text-lg font-bold mb-2">Previous State</h3>
          <p>Placeholder for previous changed deck</p>
        </div>
        
        <!-- Column 3: Placeholder -->
        <div class="col-span-1 bg-base-100 p-4 rounded-lg">
          <h3 class="text-lg font-bold mb-2">Current State</h3>
          <p>Placeholder for current deck</p>
        </div>
      </div>
    </div>
  </div>
{/if}

  