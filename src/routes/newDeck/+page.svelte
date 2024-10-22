<script>
  import { goto } from '$app/navigation';
  import { stringify } from 'postcss';

  let loading = false;
  let description = '';
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
  />

  <div class="flex justify-center ml-auto w-1/3">
    {#if loading}
      <div class="loading loading-ring loading-lg"></div>
    {:else}
      <input
        type="submit"
        value="Generate!"
        class="btn w-full"
        on:click={(event) => {
          loading = true;
          fetch('/api/object', {
            method: 'POST',
            body: JSON.stringify({ description, schema })
          }).then((response) => {
            response.json().then(
              (deck) => {
                console.log(deck);
                let b64payload = btoa(JSON.stringify(deck));
                goto(`/?customDeckInfo=${b64payload}`);
              },
              (reject_reason) => {}
            );
          });
        }}
      />
    {/if}
  </div>
</div>
