<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import CardPanel from './CardPanel.svelte';
	import type { Keyed } from '$lib/types';

	let _id = 0;
	function withId<T extends object>(o: T): Keyed<T> {
		return { ...o, id: _id++ };
	}

	let cards: ComponentProps<CardPanel>['cards'] = [
		withId({
			name: 'Book',
			responsibilities: [
				withId({ text: 'knows its contents' }),
				withId({ text: 'knows its metadata' }),
				withId({ text: 'knows its length' }),
			],
			collaborators: [
				withId({ text: 'Page' }),
			],
		}),
		withId({
			name: 'Library',
			responsibilities: [
				withId({ text: 'knows its contents' }),
				withId({ text: 'knows its metadata' }),
				withId({ text: 'knows its lenders' }),
			],
			collaborators: [
				withId({ text: 'Book' }),
			],
		}),
	];
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
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
