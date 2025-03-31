import { writable, get } from 'svelte/store'
export const assemblyResponse = writable('');
export const geminiResponse = writable('');
export const transcriptionText = writable('');
export const transcriptUtterances = writable([]);
export const structuredChapters = writable([]);
export const bookmarks = writable([]);  