<script lang="ts">
  import type { SimpleDeck } from '$lib/types';
  import { deckWithIds } from '$lib/decks';
  import { exampleDecks } from '$lib/decks';

  type Props = {
    loadDeck: (deck: SimpleDeck) => any;
  };

  let loading: boolean = $state(false);
  let description: string = $state('');
  let deckName: undefined | keyof typeof exampleDecks = $state();
  const schema = 'Deck';

  let { loadDeck }: Props = $props();
</script>

<div class="w-1/2 h-full grid grid-cols-1 mx-auto">
  <div
    class="mx-auto"
    >
    <label for="deckSelector">
      Load a premade deck:
    </label>
    <select
      name="deckSelector"
      class="select select-bordered ml-auto"
      bind:value={deckName}
      >
      <option disabled>Select a deck</option>
      {#each Object.keys(exampleDecks) as name}
      <option>{name}</option>
      {/each}
    </select>
    <input
      type="submit"
      value="Load"
      class="btn"
      aria-label="Load this deck"
      onclick={() => {
        if (deckName) 
          loadDeck(exampleDecks[deckName]);
      }}
      />
  </div>
  <div class="divider">OR</div>
  <div
    class="w-2/3 mx-auto"
    >
    <label for="userDescription" class="mr-auto">
      Generate one from an application description:
    </label>
    <textarea
      bind:value={description}
      name="userDescription"
      id="descriptionInput"
      class="w-full input input-bordered my-2"
    ></textarea>
    <div class="flex justify-center ml-auto w-1/3">
      {#if loading}
        <div class="loading loading-ring loading-lg"></div>
      {:else}
        <input
          type="submit"
          value="Generate"
          class="btn w-full"
          onclick={async () => {
            loading = true;
            const response = await fetch('/api/object', {
              method: 'POST',
              body: JSON.stringify({ description, schema })
            });
            const {response: deck} = await response.json();
            console.log(deck);
            loadDeck(deckWithIds(deck));
          }}
        />
      {/if}
    </div>
  </div>
</div>
