<script lang="ts">
	import type { Keyed } from "$lib/types";

    export let name: string;
    export let responsibilities: Keyed<{text: string}>[];
    export let collaborators: Keyed<{text: string}>[];
</script>

<div style="margin: 5px;">
    <div class='header' style="text-transform: none;">{@html name}</div>
    <div class='col-container'>
        <div>
            <div class='header'>Responsibilities</div>
            <ul>
                {#each responsibilities as r (r.id)}
                    <li class="responsibility">{@html r.text}</li>
                {/each}
            </ul>
        </div>
        <div>
            <div class='header'>Collaborators</div>
            <ul>
                {#each collaborators as c (c.id)}
                    <li class="responsibility">{c.text}</li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
    div {
        flex: 1;
    }

    .header {
        font-style: italic;
        text-transform: lowercase;
        /* font-size: ; */
    }

    .col-container {
        flex-direction: row;
        display: flex;
    }

    ul, li {
        padding: 0px;
    }

    li {
        list-style: none;
    }
</style>