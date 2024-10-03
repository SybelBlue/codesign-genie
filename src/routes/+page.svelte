<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Keyed } from '$lib/types';
  import CardPanel from './CardPanel.svelte';

  const withId: <T extends object>(o: T) => Keyed<T> = (function() {
    let nextId = 0;
    return (o) => ({ ...o, id: nextId++ });
  })();

  let cards: ComponentProps<CardPanel>['cards'] = [
    withId({
      name: 'Book',
      responsibilities: [
        withId({ text: 'knows its contents' }),
        withId({ text: 'knows its metadata' }),
        withId({ text: 'knows its length' }),
      ],
      collaborators: [withId({ name: 'Page' })]
    }),
    withId({
      name: 'Page',
      responsibilities: [
        withId({ text: 'knows its text' }),
        withId({ text: 'has a number' }),
      ],
      collaborators: []
    })
  ];
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="crc card design game" />
</svelte:head>

<section>
  <CardPanel {cards} />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>
