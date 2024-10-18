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
  on:selectCard
  class:highlight
  class="tw-grow card dark:card-bordered shadow-xl"
  role="gridcell"
  tabindex=0
  >
  <div class="card-body">
    <h3 class="card-title"><ClassLabel disabled {name} /></h3>
    <hr>
    <div class="flex flex-row">
      <div class="ps-0 grow">
        <h4>responsibilities</h4>
        <ul>
          {#each responsibilities as { text: value, id } (id)}
            <li class="w-full"> <input bind:value class="text-ellipsis" /> </li>
          {/each}
        </ul>
      </div>
      <div class="pe-2 min-w-fit">
        <h4>collaborators</h4>
        <ul>
          {#each collaborators as { name, id } (id)}
            <li> <ClassLabel on:selectCard {name} /> </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  hr {
    @apply border-primary;
    margin-bottom: 5px;
  }

  h3 {
    font-style: italic;
    margin: 4px;
    margin-bottom: 0px !important;
  }

  h4 {
    @apply text-base-content;
    font-style: italic;
    margin: 4px;
    text-decoration: underline;
    text-decoration-color: oklch(var(--p));
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

    &:hover {
      @apply text-accent-content bg-accent;
      outline: 3px lightcyan;
      text-overflow: visible;
    }
  }

  ul,
  li {
    padding: 0px;
    list-style: none;
  }

  .highlight {
    box-shadow: 0 0 25px oklch(var(--a));
  }
</style>
