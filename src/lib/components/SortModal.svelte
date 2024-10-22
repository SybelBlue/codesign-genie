<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from "svelte";
  import Card from "./Card.svelte";
  import type { Keyed } from "$lib/types";
  import { arrayEq } from "$lib/common";

  type CardProps = Keyed<ComponentProps<Card>>;
  export let cards: CardProps[];

  let options = {
    alpha(a: CardProps, b: CardProps) {
      return a.name < b.name ? -1 : 1;
    },
    original(a: CardProps, b: CardProps) {
      return a.id - b.id;
    },
  };

  const dispatch = createEventDispatcher<{ sorted: { sorted: CardProps[] } }>();

  const sortWith = (func: (a: CardProps, b: CardProps) => number) => cards.toSorted(func);

  $: sorted = Object.entries(options).filter(([_, f]) => arrayEq(sortWith(f), cards)).map(([n, _]) => n);
</script>

<div id="panel" class="fixed aspect-square top-2 left-1/2 -translate-x-1/2 z-30 h-9 flex items-center btn btn-neutral btn-circle mx-auto p-2 sm:w-auto">
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5 visible inline stroke-current fill-current"
    >
    <path d="M21 14C19.3431 14 18 12.6569 18 11C18 9.34315 19.3431 8 21 8C22.6569 8 24 9.34315 24 11C24 12.6569 22.6569 14 21 14ZM21 16C23.419 16 25.4367 14.2822 25.9 12H29C29.5523 12 30 11.5523 30 11C30 10.4477 29.5523 10 29 10H25.9C25.9044 10.0219 25.9087 10.0439 25.9129 10.066C25.4755 7.75093 23.4422 6 21 6C18.581 6 16.5633 7.71776 16.1 10H3C2.44772 10 2 10.4477 2 11C2 11.5523 2.44771 12 3 12H16.1C16.5633 14.2822 18.581 16 21 16ZM11 24C9.34315 24 8 22.6569 8 21C8 19.3431 9.34315 18 11 18C12.6569 18 14 19.3431 14 21C14 22.6569 12.6569 24 11 24ZM11 26C13.419 26 15.4367 24.2822 15.9 22H29C29.5523 22 30 21.5523 30 21C30 20.4477 29.5523 20 29 20H15.9C15.4367 17.7178 13.419 16 11 16C8.58104 16 6.56329 17.7178 6.10002 20H3C2.44772 20 2 20.4477 2 21C2 21.5523 2.44771 22 3 22H6.10002C6.56329 24.2822 8.58104 26 11 26Z"/>
  </svg>

  {#each Object.entries(options) as [opt, func]}
    <button
      class:active={sorted.includes(opt)}
      class="hidden sort-option group items-center justify-center whitespace-nowrap align-middle font-semibold disabled:cursor-not-allowed stroke-current min-w-[32px] gap-1.5 text-xs hover:stroke-accent hover:text-accent-content hover:bg-accent text-neutral-content h-full w-full rounded-lg bg-transparent px-3 drop-shadow sm:w-auto"
      on:focus={() => dispatch('sorted', { sorted: sortWith(func) })}
      >{opt}</button>
  {/each}
</div>

<style lang="postcss">
  #panel:hover {
    @apply aspect-auto;
    & > svg {
      @apply hidden;
    }
    & > .sort-option {
      @apply inline-flex;
    }
  }
  .sort-option.active {
    @apply rounded-lg btn-ghost btn-outline;
  }
</style>