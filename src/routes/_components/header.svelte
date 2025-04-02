<script lang="ts">
	import { authClient } from '$lib/client/utils/auth-client';
	import { goto } from '$app/navigation';
	const session = authClient.useSession();
</script>

<nav>
	<h1 class="flex w-full items-center justify-between bg-gray-100 p-4">
		<div class="text-left">
			<a href="/">OutcomeOptics</a>
		</div>
		{#if $session.data}
			<div class="text-right">
				<button
					onclick={async () => {
						await authClient.signOut();
						goto('/auth');
					}}
				>
					{$session?.data?.user.name}
					Log out</button
				>
			</div>
		{/if}
	</h1>
</nav>

<style>
	nav {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		font-size: 1.5rem;
	}
</style>
