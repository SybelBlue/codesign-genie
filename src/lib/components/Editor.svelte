<script lang="ts">
  import { clickOutside } from '$lib/actions';
  import type { SimpleCard } from '$lib/types';
  import { availableClasses } from '$lib/stores';
  import Card from './Card.svelte';

  interface Props {
    card: SimpleCard;
    readyForCommit: boolean;
    propose?: (card: SimpleCard, message: string) => void;
    rename?: (oldName: string, newName: string) => void;
    close?: () => void;
  }

  let { readyForCommit = $bindable(false), card, propose, rename, close }: Props = $props();

  let lastChange = $derived.by(() => {
    card && renameMode;
    return Date.now();
  });

  let messageBox: HTMLInputElement;
  let message: string = $state('');
  let validSymbolName = $derived(Boolean(message) && !$availableClasses.includes(message));

  let renameMode = $state(false);

  const startRename = (clickedName: string) => {
    if (!rename) return;
    if (clickedName !== card.name) return;
    messageBox.focus();
    renameMode = true;
  };
  const finishRename = () => {
    const newName = message;
    message = '';
    renameMode = false;
    rename?.(card.name, newName);
  };
</script>

<div
  use:clickOutside={() => {
    if (card && Date.now() - lastChange > 200) close?.();
  }}
  class="relative min-h-full w-full z-50 bg-base-100 grid grid-cols-1 shadow-xl"
>
  <!-- "X" button in top right -->
  <button
    class="btn btn-circle btn-outline ml-auto mr-2 mt-2"
    onclick={() => close?.()}
    aria-label="Select Theme"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
  <!-- -->

  <!-- The Card area -->
  <div class="mx-auto w-4/5">
    <Card selectName={startRename} enableTitleLabel={Boolean(rename)} {...card} />
  </div>
  <!-- -->

  <!-- The "propose" area -->
  <form
    class="propose-form flex justify-center w-5/6 mx-auto join"
    use:clickOutside={() => {
      if (renameMode && Date.now() - lastChange > 200) {
        renameMode = false;
        message = '';
      }
    }}
    >
    <input
      class:rename={renameMode}
      class="message-box input input-bordered w-3/4 border-r-0 join-item"
      type="text"
      name="commitMessage"
      id="commitMessageInput"
      bind:this={messageBox}
      bind:value={message}
    />
    {#if readyForCommit}
      <input
        class:rename={renameMode}
        class="submit-button btn btn-outline w-1/4 join-item"
        type="submit"
        value={renameMode ? 'rename' : 'propose'}
        disabled={renameMode && !validSymbolName}
        id="submitBtn"
        onclick={(e) => {
          if (!card) {
            console.error('Tried to commit undefined card!');
            return;
          }
          if (renameMode) {
            finishRename();
          } else {
            propose?.(card, message);
          }
        }}
      />
    {:else}
      <div class="btn btn-disabled btn-outline loading loading-ring loading-lg mb-auto"></div>
    {/if}
  </form>
  <!-- -->
</div>

<style lang="postcss">
  input.rename {
    @apply border-primary transition-all;
    &.submit-button:enabled {
      @apply bg-primary text-primary-content;
    }
    &.message-box {
      @apply outline-none;
    }
  }
</style>
