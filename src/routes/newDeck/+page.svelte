<script lang="ts">
  import { goto } from '$app/navigation';

  let loading = $state(false);
  let description = $state('');
  const schema = 'Deck';
</script>

<div class="grid grid-cols-1 my-auto">
  <label for="userDescription" class="ml-4 mr-auto">
    Enter a description of an application to generate CRC cards for:
  </label>
  <textarea
    bind:value={description}
    name="userDescription"
    id="descriptionInput"
    class="input input-bordered m-2"
  ></textarea>

  <div class="flex justify-center ml-auto w-1/3">
    {#if loading}
      <div class="loading loading-ring loading-lg"></div>
    {:else}
      <input
        type="submit"
        value="Generate!"
        class="btn w-full"
        onclick={async () => {
          loading = true;
          const response = await fetch('/api/object', {
            method: 'POST',
            body: JSON.stringify({ description, schema })
          });
          const deck = await response.json();
          console.log(deck);
          const b64payload = btoa(JSON.stringify(deck));
          goto(`/?customDeckInfo=${b64payload}`);
        }}
      />
    {/if}
  </div>
</div>
