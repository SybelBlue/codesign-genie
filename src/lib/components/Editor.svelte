<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Card from "./Card.svelte";

  export let selectedCard: ComponentProps<Card> | undefined;

  $: checked = Boolean(selectedCard);
</script>

{#if selectedCard}
  <div on:blur={(_) => { selectedCard = undefined; }} class="drawer">
    <input id="editor-drawer" type="checkbox" class="drawer-toggle" bind:checked/>

    <div class="drawer-side w-1/2 bg-slate-100">
      <label for="editor-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

      <!-- The Card area -->
      <div class="w-full place-content-center">
          <Card
            {...selectedCard}
            />
      </div>
      <!-- The "commit" area -->
      <input type="text" name="commitMessage" id="commitMessageInput">
      <input type="submit" value="commit" id="commitSubmitBtn">
    </div>
  </div>
{/if}

