<script lang="ts">
	import { authClient } from '$lib/client/utils/auth-client';
	import { redirect } from '@sveltejs/kit';
	const session = authClient.useSession();
	let email = $state('');
	let password = $state('password1234');
	let name = $state('Test');
</script>

<div class="p-6">
	{#if $session.data}
		<div>
			<button
				onclick={async () => {
					await authClient.signOut();
				}}
			>
				Sign Out
			</button>
			<p>
				{$session?.data?.user.name}
			</p>
		</div>
	{:else}
		<div>
			<input type="email" bind:value={email} />
			<button
				onclick={async () => {
					await authClient.signIn.email({
						email,
						password,
						callbackURL: '/'
					});
				}}
			>
				Login
			</button>
		</div>
		<!-- <div>
			<input type="email" bind:value={email} />
			<input type="password" bind:value={password} />
			<button
				onclick={async () => {
					await authClient.signUp.email({
						email,
						password,
						name
					});
				}}
			>
				Sign up
			</button>
		</div> -->
	{/if}
</div>
