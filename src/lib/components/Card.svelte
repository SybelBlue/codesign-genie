<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Keyed } from '$lib/types';
  import { highlightedClass } from '$lib/stores';
  import ClassLabel from '$lib/components/ClassLabel.svelte';

  export let name: string;
  export let responsibilities: Keyed<{ text: string }>[];
  export let collaborators: Keyed<{ name: string }>[];

  let div: HTMLDivElement;

  let dispatcher = createEventDispatcher();
  const selectCard = () => dispatcher('selectCard', { name });

  $: highlight = $highlightedClass == name;
</script>


<div
  bind:this={div}
  on:focus={selectCard}
  class:highlight
  class="tw-grow card dark:card-bordered shadow-xl bg-base-100 hover:z-20"
  role="gridcell"
  tabindex=0
  >
  <div class="card-body">
    <h3 class="card-title m-1 mb-0 italic"><ClassLabel disabled {name} /></h3>
    <hr class="border-primary">
    <div class="flex flex-row">
      <div class="ps-0 grow">
        <h4>responsibilities</h4>
        <ul>
          {#each responsibilities as { text: value, id } (id)}
            <li class="w-full"> <input bind:value /> </li>
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
  h4 {
    @apply text-base-content italic m-1 underline;
    text-decoration-color: oklch(var(--p));
  }

  input {
    @apply text-ellipsis rounded-lg bg-transparent;

    width: 95%;

    font-family: var(--font-handwritten);
    font-size: 18pt;

    padding-left: 4px;
    padding-right: 4px;

    &:hover {
      @apply text-accent-content bg-accent;
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
