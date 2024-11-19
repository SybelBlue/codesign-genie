<script module lang="ts">
  import type { Change } from 'diff';
  import type { Keyed } from '$lib/types';

  export interface Data<S> {
    name: string;
    responsibilities: Keyed<{
      description: S;
      collaborators: Keyed<{ name: S }>[];
    }>[];
  }

  export interface Props extends Data<string | Change[]> {
    locked?: boolean;
    selectName?: (name: string) => void;
  }
</script>

<script lang="ts">
  import { highlightedClass } from '$lib/stores';
  import ClassLabel from '$lib/components/ClassLabel.svelte';

  let { name = $bindable(), responsibilities = $bindable(), locked, selectName }: Props = $props();

  let highlight = $derived($highlightedClass === name);
</script>

{#snippet changetext(v: string | Change[])}
  {#if Array.isArray(v)}
    {#each v as chg}
      {#if chg.added}
        <span class="text-primary italic">{chg.value}</span>
      {/if}
      {#if chg.removed}
        <span class="text-secondary line-through">{chg.value}</span>
      {/if}
      {#if !chg.added && !chg.removed}
        <span>{chg.value}</span>
      {/if}
    {/each}
  {:else}
    <span>{v}</span>
  {/if}
{/snippet}

{#snippet changelabel(v: string | Change[])}
  {#if Array.isArray(v)}
    <span>todo</span>
  {:else}
    <ClassLabel {selectName} name={v} />
  {/if}
{/snippet}

<div
  onfocus={() => selectName?.(name)}
  class:highlight
  class="tw-grow card dark:card-bordered shadow-xl bg-base-100 hover:z-20"
  role="gridcell"
  tabindex="0"
>
  <section class="card-body">
    <h3 class="card-title m-1 mb-0 italic">
      <ClassLabel disabled {selectName} {name} />
    </h3>
    <hr class="border-primary" />
    <table class="table table-auto table-sm">
      <thead>
        <tr>
          <th>responsibilities</th>
          <th class="text-right">collabs</th>
        </tr>
      </thead>
      <tbody>
        {#each responsibilities as r}
          <tr class="hover break-words">
            <td class="desc">
              {#if locked}
                {@render changetext(r.description)}
              {:else}
                <input bind:value={r.description} />
              {/if}
            </td>
            <td class="text-right">
              {#each r.collaborators as { name, id }, i}
                {#if i}<span> </span>{/if}
                {@render changelabel(name)}
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</div>

<style lang="postcss">
  th {
    @apply m-1 text-base-content text-base italic underline decoration-primary;
  }

  tr {
    @apply border-b border-base-300 align-baseline;

    &:last-child {
      @apply border-b-0;
    }
  }

  .highlight {
    box-shadow: 0 0 25px oklch(var(--a));
  }

  .desc {
    @apply text-ellipsis rounded-lg bg-transparent;

    font-family: var(--font-handwritten);
    font-size: 18pt;
  }

  input {
    @apply desc h-full w-full;

    &:hover {
      @apply text-accent-content bg-accent;
    }
  }
</style>
