<script module lang="ts">
  import type { Keyed } from '$lib/types';

  interface Data {
    name: string;
    responsibilities: Keyed<{ 
      description: string;
      collaborators: Keyed<{ name: string }>[];
    }>[];
  }

  export interface Props extends Data {
    selectName?: (name: string) => void;
  }
</script>

<script lang="ts">
  import { highlightedClass } from '$lib/stores';
  import ClassLabel from '$lib/components/ClassLabel.svelte';

  let {
    name = $bindable(),
    responsibilities = $bindable(),
    selectName,
  }: Props = $props();

  let highlight = $derived($highlightedClass === name);
</script>


<div
  onfocus={() => selectName?.(name)}
  class:highlight
  class="tw-grow card dark:card-bordered shadow-xl bg-base-100 hover:z-20"
  role="gridcell"
  tabindex=0
  >
  <div class="card-body">
    <h3 class="card-title m-1 mb-0 italic"><ClassLabel disabled {name} /></h3>
    <hr class="border-primary">
    <div class="flex flex-row">
      <table>
        <colgroup>
          <col class="ps-0 grow">
          <col class="pe-2 min-w-fit">
        </colgroup>
        <thead>
          <tr>
            <th>responsibilities</th>
            <th>collaborators</th>
          </tr>
        </thead>
        <tbody>
          {#each responsibilities as r (r.id)}
          <tr>
            <td> <input bind:value={r.description} /> </td>
            <td>
              {#each r.collaborators as { name, id }, i (id)}
                {#if i != 0} , &nbsp; {/if}
                <ClassLabel {selectName} {name} />
              {/each}
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style lang="postcss">
  h4 {
    @apply text-base-content italic m-1 underline;
    text-decoration-color: oklch(var(--p));
  }

  input {
    @apply text-ellipsis rounded-lg bg-transparent;

    width: 95%;

    font-family: var(--font-handwritten);
    font-size: 18pt;

    padding-left: 4px;
    padding-right: 4px;

    &:hover {
      @apply text-accent-content bg-accent;
    }
  }

  ul,
  li {
    padding: 0px;
    list-style: none;
  }

  .highlight {
    box-shadow: 0 0 25px oklch(var(--a));
  }
</style>
