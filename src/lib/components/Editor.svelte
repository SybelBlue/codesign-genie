<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from "svelte";
  import Card from "./Card.svelte";
  import { clickOutside } from "$lib/actions";
  import { slide } from "svelte/transition";

  export let card: ComponentProps<Card> | undefined;
  export let readyForCommit: boolean;

  $: lastChange = (function(_) {return Date.now();})(card);

  let message: string = "";
  let dispatch = createEventDispatcher<{
      commit: {
        card: ComponentProps<Card>,
        message: string
      }
    }>();
</script>

{#if card}
<div
  use:clickOutside={() => { if (Date.now() - lastChange > 200) card = undefined; }}
  transition:slide
  class="absolute left-0 w-1/2 h-screen z-50"
  >
  <div class="bg-base-100 h-screen grid grid-cols-1 shadow-xl">
    <!-- "X" button in top right -->
    <button
      class="btn btn-circle btn-outline ml-auto mr-2 mt-2"
      on:click={() => card = undefined}
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <!-- -->

    <!-- The Card area -->
    <div class="mx-auto w-4/5">
      <Card {...card} />
    </div>
    <!-- -->

    <!-- The "propose" area -->
    <div class="flex justify-center w-4/5 mx-auto">
      <input class="input input-bordered mr-2 w-3/4"
        type="text" name="commitMessage" id="commitMessageInput"
        bind:value={message}
        >
      {#if readyForCommit}
      <input class="btn btn-outline w=1/4"
        type="submit" value="propose" id="submitBtn"
        on:click={() => {
          if (card) {
            dispatch('commit', { card, message });
          } else {
            console.error("Tried to commit undefined card!");
          }
        }}
        >
      {:else}
        <div class="loading loading-ring loading-lg mb-auto"></div>
      {/if}
    </div>
    <!-- -->
  </div>
</div>
{/if}
