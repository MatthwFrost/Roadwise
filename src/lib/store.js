import { writable } from 'svelte/store';

// Create a writable store to hold the coords
export const coordsStore = writable([]);
export const coordsInit = writable({latitude: 0, longitude: 0});

export const userLoc = writable({latitude: 0, longitude: 0})