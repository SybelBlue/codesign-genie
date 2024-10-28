<script lang="ts">
  import Card, { type Props as CardProps } from "./Card.svelte";
  import { clickOutside } from "$lib/actions";
  import { slide } from "svelte/transition";

  interface Props {
    card?: CardProps;
    onCommit?: (commit: { card: CardProps; message: string }) => void;
  }

  let { card = $bindable(), onCommit }: Props = $props();

  let lastChange = $derived((function(_) {return Date.now();})(card));

  let message: string = $state("");

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
      onclick={() => card = undefined}
      aria-label="Select Theme"
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
      <input class="btn btn-outline w=1/4"
        type="submit" value="propose" id="submitBtn"
        onclick={() => {
          if (card) {
            onCommit?.({ card, message });
          } else {
            console.error("Tried to commit undefined card!");
          }
        }}
        >
    </div>
    <!-- -->
  </div>
</div>
{/if}
