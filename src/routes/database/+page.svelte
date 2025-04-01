<script>
	export let data;
</script>

<h1>Database Values</h1>
{#each data.values as value}
	<p>{value.name}: {value.value}</p>
{/each}
