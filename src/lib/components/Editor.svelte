<script lang="ts">
  import { clickOutside } from '$lib/actions';
  import type { SimpleCard } from '$lib/types';
  import Card from './Card.svelte';
  import { undiffWords, type Change } from '$lib/diff';
  import { tick } from 'svelte';
  import { availableClasses } from '$lib/stores';

  interface Props {
    card: SimpleCard;
    readyForCommit: boolean;
    propose?: (card: SimpleCard, message: string) => void;
    rename?: (oldName: string, newName: string) => void;
    close?: () => void;
  }

  let { readyForCommit = $bindable(false), card, propose, rename, close }: Props = $props();

  let lastChange = $derived.by(() => {
    card;
    return Date.now();
  });

  let messageBox: HTMLInputElement;
  let message: string = $state('');
  let validSymbolName = $derived(Boolean(message) && !$availableClasses.includes(message));

  let renameMode = $state(false);

  const startRename = (clickedName: string | Change[]) => {
    if (!card || !rename) return;
    if (Array.isArray(card.name)) return;
    if (card.name !== undiffWords(clickedName)) return;
    messageBox.focus();
    renameMode = true;
  }
  const finishRename = (oldName: string | Change[]) => {
    if (Array.isArray(oldName)) return;
    const newName = message;
    message = '';
    renameMode = false;
    rename?.(oldName, newName);
  }
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
    <Card selectName={startRename} {...card} />
  </div>
  <!-- -->

  <!-- The "propose" area -->
  <form class="flex justify-center w-5/6 mx-auto join">
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
        value={renameMode ? 'rename' : "propose"}
        disabled={renameMode && !validSymbolName}
        id="submitBtn"
        onclick={() => {
          if (!card) {
            console.error('Tried to commit undefined card!');
            return;
          }
          if (renameMode) {
            finishRename(card.name);
          } else {
            propose?.(card, message);
          }
        }}
      />
    {:else}
      <div class="loading loading-ring loading-lg mb-auto"></div>
    {/if}
  </form>
  <!-- -->
</div>

<style lang="postcss">
  input.rename {
    @apply border-primary;
    &.submit-button:enabled {
      @apply bg-primary text-primary-content;
    }
    &.message-box {
      @apply outline-none;
    }
  }
</style>