<script lang="ts">
  import type { Keyed } from '$lib/types';
  import { highlightedClass } from '$lib/stores';
  import ClassLabel from '$lib/components/ClassLabel.svelte';

  export let name: string;
  export let responsibilities: Keyed<{ text: string }>[];
  export let collaborators: Keyed<{ name: string }>[];

  $: highlight = $highlightedClass == name;
</script>


<div class:highlight class="flashcard">
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

<style lang="scss">
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

  .flashcard {
    display: flex;
    align-items: left;
    justify-content: left;
    font-size: 18px;
    // Set a minimum height and use aspect-ratio for scaling
    min-height: 2in;
    max-width: 50vw;
    aspect-ratio: 2 / 1; // Width to height ratio (adjust as needed)

    // Use padding for responsive text sizing
    padding: 4px;
    box-sizing: border-box;

    margin: 4px;
    border: 2px solid #eee;
    border-radius: 5px;

    background-color: var(--color-bg-2);

    flex-direction: column;

    // Responsive font size
    @media (max-width: 400px) {
      font-size: 16px;
    }

    @media (min-width: 401px) and (max-width: 600px) {
      font-size: 18px;
    }

    @media (min-width: 601px) {
      font-size: 20px;
    }
  }

  .col-container {
    flex-direction: row;
    display: flex;
  }

  .highlight {
    box-shadow: 0 0 25px rgba(81, 203, 238, 1);
  }
</style>
