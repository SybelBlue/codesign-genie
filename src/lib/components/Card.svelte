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
        <thead>
          <tr>
            <th>responsibilities</th>
            <th>collaborators</th>
          </tr>
        </thead>
        <tbody>
          {#each responsibilities as r (r.id)}
          <tr>
            <td class="w-full"> <input bind:value={r.description} /> </td>
            <td>
              {#each r.collaborators as { name, id } (id)}
                <ClassLabel {selectName} {name} />
              {/each}
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
      <!-- <div class="ps-0 grow">
        <h4>responsibilities</h4>
        <ul>
          {#each responsibilities as r (r.id)}
            <li class="w-full"> <input bind:value={r.text} /> </li>
          {/each}
        </ul>
      </div>
      <div class="pe-2 min-w-fit">
        <h4>collaborators</h4>
        <ul>
          {#each collaborators as { name, id } (id)}
            <li> <ClassLabel {selectName} {name} /> </li>
          {/each}
        </ul>
      </div> -->
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
