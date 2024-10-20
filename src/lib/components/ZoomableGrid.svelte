<script>
  import CardPanel from './CardPanel.svelte';
  import { writable } from 'svelte/store';

  // Array of card data
  let cards = [
    {
      id: 1,
      title: '',
      responsibilities: [''],
      collaborators: [''],
    },
    {
      id: 2,
      title: '',
      responsibilities: [''],
      collaborators: [''],
    },
    {
      id: 3,
      title: '',
      responsibilities: [''],
      collaborators: [''],
    },
    {
      id: 4,
      title: '',
      responsibilities: [''],
      collaborators: [''],
    },
    // Add more cards as needed
  ];

  // Zoom scale
  export let scale = writable(1);

  // Zoom controls
  function zoomIn() {
    scale.update((n) => n + 0.1);
  }

  function zoomOut() {
    scale.update((n) => Math.max(n - 0.1, 0.1));
  }
</script>

<!-- Zoom Controls -->
<div class="flex justify-end space-x-2 mb-4">
  <button class="btn btn-primary" on:click={zoomIn}>
    Zoom In
  </button>
  <button class="btn btn-secondary" on:click={zoomOut}>
    Zoom Out
  </button>
</div>

<!-- Card Panel -->
<CardPanel {cards} scale={$scale} />