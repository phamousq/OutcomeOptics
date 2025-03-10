<script lang="ts">
	import { onMount } from 'svelte';

	let routes: string[] = [];
	onMount(async () => {
		const response = await fetch('/api/routes');
		routes = await response.json();
	});
</script>
<main>
    <div class="p-[5px]">
        <ol>
            {#each routes as route}
                <li>
                    <a href="/{route}">{route}</a>
                </li>
            {/each}
        </ol>
    </div>
</main>

<style>
	ol li {
		list-style: decimal;
		list-style-position: inside;
	}
</style>
