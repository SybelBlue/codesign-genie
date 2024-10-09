<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Keyed } from '$lib/types';
  import { highlightedClass } from '$lib/stores';
  import ClassLabel from '$lib/components/ClassLabel.svelte';

  export let name: string;
  export let responsibilities: Keyed<{ text: string }>[];
  export let collaborators: Keyed<{ name: string }>[];

  let cardSelectDispatcher = createEventDispatcher<{ selectCard: { name: string } }>();
  const selectCard = () => cardSelectDispatcher('selectCard', { name });

  $: highlight = $highlightedClass == name;
</script>


<div
  on:focus={selectCard}
  class:highlight
  class="card base-300 rounded-box"
  role="gridcell"
  tabindex=0
  >
  <h3><ClassLabel disabled {name} /></h3>
  <hr>
  <div class="col-container">
    <div>
      <h4>responsibilities</h4>
      <ul>
        {#each responsibilities as { text: value, id } (id)}
          <li> <input bind:value /> </li>
        {/each}
      </ul>
    </div>
    <div>
      <h4>collaborators</h4>
      <ul>
        {#each collaborators as { name, id } (id)}
          <li> <ClassLabel on:selectCard {name} /> </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style lang="postcss">
  div {
    flex: 1;
  }

  hr {
    margin: 3px;
  }

  h3,
  h4 {
    font-style: italic;
    margin: 4px;
  }

  input {
    background-color: transparent;
    border: 3px transparent;

    width: 95%;

    font-family: var(--font-handwritten);
    font-size: 18pt;

    border-radius: 5px;
    padding-left: 4px;
    padding-right: 4px;
  }

  input:hover {
    outline: 3px lightcyan;
    background: rgba(0.2, 0.2, 0.2, 0.2);
  }

  ul,
  li {
    padding: 0px;
  }

  li {
    list-style: none;
  }

  .col-container {
    flex-direction: row;
    display: flex;
  }

  .highlight {
    box-shadow: 0 0 25px rgba(81, 203, 238, 1);
  }
</style>
