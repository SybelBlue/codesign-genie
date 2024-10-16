<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Card from "./Card.svelte";

  export let selectedCard: ComponentProps<Card> | boolean;

  $: checked = Boolean(selectedCard);
</script>


<div on:blur={(_) => { selectCard = false; }} class="drawer">
  <input id="editor-drawer" type="checkbox" class="drawer-toggle" bind:checked/>

  <div class="drawer-side">
    <label for="editor-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    
    <section>
      <!-- The Card area -->
      <Card 
        {...selectedCard}
        />
    </section>
  </div>


  <section>
    <!-- The "commit" area -->
    <input type="text" name="commitMessage" id="commitMessageInput">
    <input type="submit" value="commit" id="commitSubmitBtn">
  </section>
</div>
