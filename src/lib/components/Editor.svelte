<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Card from "./Card.svelte";

  export let selectedCard: ComponentProps<Card> | boolean;
</script>

<div class="drawer lg:drawer-open">
  {#if selectedCard}
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" checked/>
  {:else}
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle"/>
  {/if}
  <div class="drawer-content flex flex-col items-center justify-center">
    <!-- Page content here -->
    <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
      Open drawer
    </label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <!-- -- >
    <ul class="menu bg-base-200 text-base-content min-h-full w-30 p-4">
      <!-- Sidebar content here -- >
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
    <!-- -->

    {#if selectedCard}
    <section>
      <!-- The Card area -->
      <Card 
        {...selectedCard}
        />
    </section>
    {/if}
  </div>

  

  <section>
    <!-- The "commit" area -->
    <input type="text" name="commitMessage" id="commitMessageInput">
    <input type="submit" value="commit" id="commitSubmitBtn">
  </section>
</div>
