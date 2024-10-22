<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Keyed } from '$lib/types';
  import { highlightedClass } from '$lib/stores';
  import ClassLabel from '$lib/components/ClassLabel.svelte';
  import { withId } from '$lib/common';

  export let name: string;
  export let responsibilities: Keyed<{ text: string }>[];
  export let collaborators: Keyed<{ name: string }>[];

  export let locked: boolean = false;

  let dispatcher = createEventDispatcher();
  const selectCard = () => dispatcher('selectCard', { name });

  const addResponsibility = () => {
    responsibilities = [...responsibilities, withId({ text: 'new responsibility'})]
  };

  $: highlight = $highlightedClass === name;
</script>


<div
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
            <li class="w-full"> <input disabled={locked} bind:value /> </li>
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
    {#if !locked}
      <button
        on:focus={addResponsibility}
        class="w-full h-2 btn btn-ghost btn-outline tw-grow mx-auto"
        role="gridcell"
        tabindex=0
        >
        +
      </button>
    {/if}
  </div>
</div>

<style lang="postcss">
  h4 {
    @apply relative text-base-content italic m-1 underline;
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
      &:disabled {
        @apply text-neutral-content bg-neutral;
      }
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
