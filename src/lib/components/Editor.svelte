<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Card from "./Card.svelte";

  export let selectedCard: ComponentProps<Card> | undefined;
</script>

{#if selectedCard}
<div class="absolute fixed left-0 w-1/2 h-screen">
  <div class="bg-base-100 h-screen grid grid-cols-1">
    <!-- "X" button in top right -->
    <button
      class="btn btn-circle btn-outline"
      on:click={(_) => {
        selectedCard = undefined;
      }}
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
      <Card
        {...selectedCard}
        />
    </div>
    <!-- -->

    <!-- The "commit" area -->
    <div class="flex justify-center w-4/5 mx-auto mb-4">
      <input class="input input-bordered mr-2 w-3/4"
        type="text" name="commitMessage" id="commitMessageInput">
      <input class="btn btn-outline w=1/4"
        type="submit" value="commit" id="commitSubmitBtn">
    </div>
    <!-- -->
  </div>
</div>
{/if}

