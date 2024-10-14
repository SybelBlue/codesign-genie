<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Card from "./Card.svelte";

  export let selectedCard: ComponentProps<Card>;
</script>

<section>
  <!-- The Card area -->
  <Card 
    {...selectedCard}
    />
</section>

<section>
  <!-- The "commit" area -->
  <input type="text" name="commitMessage" id="commitMessageInput">
  <input type="submit" value="commit" id="commitSubmitBtn">
</section>
