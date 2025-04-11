<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Header from './_components/header.svelte';
</script>

<main>
	<Header />
	{@render children()}
</main>

