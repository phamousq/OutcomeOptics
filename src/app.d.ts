// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: {
				id: string;
				userId: string;
				createdAt: Date;
				updatedAt: Date;
				expiresAt: Date;
				token: string;
				ipAddress: string;
				userAgent: string;
			};
			user?: {
				id: string;
				email: string;
				name?: string;
				// Add other user properties as needed
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
