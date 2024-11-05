<!-- from https://github.com/saadeghi/daisyui/blob/9641f709c88a29e0c1f74402439c89f504fad423/src/docs/src/components/ThemeChange.svelte -->
<script lang="ts">
  interface Props {
    decks: string[];
    currentDeck: string;
  }

  let { decks, currentDeck = $bindable() }: Props = $props();
</script>

<div
  title="Change Theme"
  class="dropdown dropdown-end dropdown-top fixed bottom-2 right-2 z-30"
  >
  <div tabindex="0" role="button" class="btn btn-rounded">
    <span class="inline font-normal">Change Deck</span>
    <svg
      width="12px"
      height="12px"
      class="inline-block h-2 w-2 fill-current opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048">
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
    </svg>
  </div>
  <div
    class="dropdown-content bg-base-200 text-base-content rounded-box top-px max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 mt-16">
    <div class="grid grid-cols-1 gap-3 p-3">
      {#each decks as name}
        <button
          class="outline-base-content text-start outline-offset-4"
          data-act-class="[&_svg]:visible"
          onclick={() => { currentDeck = name; }}
          >
          <span
            class="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans">
            <span class="grid grid-cols-5 grid-rows-3">
              <span class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="invisible h-3 w-3 shrink-0">
                  <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z">
                  </path>
                </svg>
                <span class="flex-grow text-sm">{name}</span>
              </span>
            </span>
          </span>
        </button>
      {/each}
    </div>
  </div>
</div>