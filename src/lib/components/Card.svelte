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
  <div class="col-container">
    <div>
      <h4>responsibilities</h4>
      <ul>
        {#each responsibilities as { text: value, id } (id)}
          <li class="responsibility">
            <input bind:value />
          </li>
        {/each}
      </ul>
    </div>
    <div>
      <h4>collaborators</h4>
      <ul>
        {#each collaborators as { name, id } (id)}
          <li class="collaborator">
            <ClassLabel on:selectCard {name} />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style lang="scss">
  div {
    flex: 1;
  }

  h3,
  h4 {
    font-style: italic;
  }

  .flashcard {
    display: flex;
    align-items: left;
    justify-content: left;
    border-bottom: 1px solid #eee;
    font-size: 18px;
    width: 100%;
    // Set a minimum height and use aspect-ratio for scaling
    min-height: 80px;
    aspect-ratio: 2.33 / 1; // Width to height ratio (adjust as needed)

    // Use padding for responsive text sizing
    padding: 5%;
    box-sizing: border-box;

    margin: 4px;

    flex-direction: column;

    &:last-child {
      border-bottom: none;
    }

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

  .class-name {
    font-family: var(--font-mono);
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
</style>
