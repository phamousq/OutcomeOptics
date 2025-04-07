import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/utils/authServer';
import { authClient } from '$lib/client/utils/auth-client';

export const load: LayoutServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	// console.log(request.headers);
	/**
	 * If the user is not authenticated, redirect to the login page.
	 */
	if (!session) {
		throw redirect(302, '/auth');
	}
	// console.log(session);

	/**
	 * If the user is authenticated, let them through, and add the user to the page data.
	 */
	return {
		user: session.user
	};
};
