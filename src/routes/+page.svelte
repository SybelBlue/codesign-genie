<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import CardPanel from './CardPanel.svelte';

	let _id = 0;

	function genId() { return _id++; }

	let cards: ComponentProps<CardPanel>['cards'] = [
		{
			id: genId(),
			name: 'Book',
			responsibilities: [
				{
					id: genId(),
					text: 'knows its contents'
				},
				{
					id: genId(),
					text: 'knows its metadata'
				},
				{
					id: genId(),
					text: 'knows its length'
				},
			],
			collaborators: [
				{
					id: genId(),
					text: 'Page'
				},
			],
		},
		{
			id: genId(),
			name: 'Library',
			responsibilities: [
				{
					id: genId(),
					text: 'knows its contents'
				},
				{
					id: genId(),
					text: 'knows its metadata'
				},
				{
					id: genId(),
				 	text: 'knows its lenders'
				},
			],
			collaborators: [
				{
					id: genId(),
					text: 'Book'
				},
			],
		},
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
