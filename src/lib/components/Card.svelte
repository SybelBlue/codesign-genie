<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Keyed } from '$lib/types';
  import { highlightedClass } from '$lib/stores';

  export let name: string;
  export let responsibilities: Keyed<{ text: string }>[];
  export let collaborators: Keyed<{ name: string }>[];

  $: highlight = $highlightedClass == name;

  const dispatch = createEventDispatcher();
</script>

<div class:highlight class="flashcard" >
  <h3 class="header class-name">{name}</h3>
  <div class="col-container">
    <div>
      <h4 class="header">responsibilities</h4>
      <ul>
        {#each responsibilities as r (r.id)}
          <input
            bind:value={r.text}
            class="responsibility"
            />
        {/each}
      </ul>
    </div>
    <div>
      <h4 class="header">collaborators</h4>
      <ul>
        {#each collaborators as c (c.id)}
          <li class="collaborator">
            <span
              on:mouseenter={() => $highlightedClass = c.name }
              on:mouseleave={() => $highlightedClass = undefined}
              on:focus={() => dispatch('selectCard', { 'name': c.name })}
              class="class-name"
              role="link"
              tabindex=0
              >{c.name}</span></li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style lang="scss">
  div {
    flex: 1;
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

  .header {
    font-style: italic;
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
