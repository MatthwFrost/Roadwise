<script>
	import { onDestroy, onMount, setContext } from 'svelte';
	import { mapbox, key } from '../mapbox.js';
    import { auth, user } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup} from "firebase/auth";
	import LoginPopup from './LoginPopup.svelte';
  import AuthCheck from './AuthCheck.svelte';

	setContext(key, {
		getMap: () => map
	});

	export let lat;
	export let lon;
	export let zoom;

	let container;
	let map;

	function load() {
		map = new mapbox.Map({
			container,
			style: 'mapbox://styles/mapbox/streets-v9',
			center: [lon, lat],
			zoom
		});
		try {

		map.addControl(new mapbox.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true
		},
		trackUserLocation: true
		}));
		}catch(error){
			// Make a modal out of this to be more clear
			alert(error);
		}
	}
    // Call the function to initialize the map after the component is mounted on the client-side
	onMount(() => {
		load();
	});

	onDestroy(() => {
		if (map) map.remove();
	});

	async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        user = await signInWithPopup(auth, provider);
    }
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css" on:load={load} />
</svelte:head>

<!-- {#if $user} -->
<div bind:this={container} class="w-[60vw] h-[100vh] justify-center rounded-md mx-auto">
	{#if map}
		<slot />
	{/if}
</div>
<!-- {:else}
	<div class="content-center w-[90vw] h-[80vh] justify-center rounded-md mx-auto text-center bg-neutral">
		<button class="" on:click={signInWithGoogle}>Login</button>
	</div>
{/if} -->