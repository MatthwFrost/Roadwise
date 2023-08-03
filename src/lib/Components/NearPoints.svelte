<script>
    import { mapbox } from '../mapbox';
    import { onMount, onDestroy } from 'svelte';
	import {  geofirestore, db } from '../firebase';

    let container;
    let map;
    let coords;
    let modal;
    let routeData;
    let popupHTML;
    let title;
    let description;
    let photoUrl;
    export let lat;
    export let lon;
    const zoom = 11;


    function load() {
		map = new mapbox.Map({
			container,
			style: 'mapbox://styles/mapbox/streets-v9',
			center: [lon, lat],
			zoom
		});

        map.addControl(new mapbox.GeolocateControl({
		    positionOptions: {
			    enableHighAccuracy: true
		    },
		    trackUserLocation: true
	    }));
	}

onMount(async () => {
    load();


    console.log(map.getCenter().toArray());

    const geocollection = geofirestore.collection('geolocation');
    const value = await geocollection.get();

    for (const doc of value.docs) {
        const data = doc.data();
        const coordinates = data.coordinates;
        const routeId = data.locationRef;

        const routeDocRef = db.collection('routes').doc(routeId);
        const routeDocSnap = await routeDocRef.get();

        if (routeDocSnap.exists) {
            routeData = routeDocSnap.data();
            coords = routeData.routeCoords;  // Update coords for each route here
        } else {
            console.log("No such document!");
        }
    // Fetch data from another database using routeId

        if (routeData){
            title = routeData['title'];
            description = routeData.desc;
            photoUrl = routeData.photoUrls[0];

            popupHTML = `<h1>${title}</h1><p>${description}</p>`;
        } else {
            popupHTML = `<h1 class="text-[20px] m-3">No data for this route</h1><p> There is not information for this route 🙁</p>`;
        }


        const iconSvg = `<svg fill="#dc2626" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            width="40px" height="40px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
            <g>
                <path d="M50,10.417c-15.581,0-28.201,12.627-28.201,28.201c0,6.327,2.083,12.168,5.602,16.873L45.49,86.823
                    c0.105,0.202,0.21,0.403,0.339,0.588l0.04,0.069l0.011-0.006c0.924,1.278,2.411,2.111,4.135,2.111c1.556,0,2.912-0.708,3.845-1.799
                    l0.047,0.027l0.179-0.31c0.264-0.356,0.498-0.736,0.667-1.155L72.475,55.65c3.592-4.733,5.726-10.632,5.726-17.032
                    C78.201,23.044,65.581,10.417,50,10.417z M49.721,52.915c-7.677,0-13.895-6.221-13.895-13.895c0-7.673,6.218-13.895,13.895-13.895
                    s13.895,6.222,13.895,13.895C63.616,46.693,57.398,52.915,49.721,52.915z"/>
            </g>
            </svg>`;

        let el = document.createElement('div');
        el.innerHTML = iconSvg;

        let popup = new mapbox.Popup({ offset: 25 }).setHTML(popupHTML);

        if (!coordinates){
            console.log("coords don't exist")
        }else{
            let marker = new mapbox.Marker(el ,{offset: [0,-15]})
                .setLngLat([coordinates.longitude, coordinates.latitude])
                .setPopup(popup)
                .addTo(map);

        // Encapsulate the event listener function in an IIFE
        ((marker, coords) => {
            marker.getElement().addEventListener('mouseenter', () => {
                marker.togglePopup();

                if (map.getSource('route')) {
                    map.removeLayer('route');
                    map.removeSource('route');
                }

                let lineCoordinates = coords.map(point => [point.longitude, point.latitude]);
                let lineGeoJSON = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": lineCoordinates
                }
                };

                map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': {
                    'type': 'geojson',
                    'data': lineGeoJSON
                },
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#f48c7a',
                    'line-width': 5,
                    'line-opacity': 1 
                }
                });
            });

            marker.getElement().addEventListener('mouseleave', () => {
                marker.togglePopup();
                if (map.getSource('route')) {
                    map.removeLayer('route');
                    map.removeSource('route');
                }
            });

                // Add click event listener
            marker.getElement().addEventListener('click', () => {
                modal = document.getElementById("myModal");
                myModal.showModal()
            });



        })(marker, coords);
    }
    }
});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css" on:load={load} />
</svelte:head>

<div bind:this={container} class="w-[70vw] h-[80vh] justify-center rounded-md mx-auto border shadow-md ">
	{#if map}
		<slot />
	{/if}
</div>

<div class="flex items-center justify-center my-5">
    <div class="flex w-[40vw] justify-center items-center text-center mx-0">
        <div class="grid card rounded-box place-items-center mx-0">
            <img src="src/static/findLoc.png" alt="find location img" width="30" height="30">
        </div>
        <div class="divider divider-horizontal mx-0"></div>
        <div class="grid card rounded-box place-items-center m-0">
           <h3 class="text-[15px] text-neutral">Find your location.</h3> 
        </div>
    </div>
</div>

<dialog id="myModal" class="modal">
    <form method="dialog" class="modal-box m-11/12 max-w-5xl">
        {#if routeData}
            <h3 class="font-bold text-lg"> {title} </h3>
            <p class="py-4">{description}</p>
        {:else}
            <h3>PLease login to view this route.</h3>
            <a class="btn btn-accent" href="/login">
                Login
            </a>
        {/if}
      <div class="modal-action">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </div>
    </form>
  </dialog>
