<script>
    import { getContext } from 'svelte';
    import { mapbox, key } from '../mapbox.js';
    import { coordsStore, coordsInit } from '../store.js';
 
    const { getMap } = getContext(key);
    const map = getMap();
    let draw;
    let submitErr;
    let finalCoords = [];
    let initial = [];    

    function scrollToBottom() {
        window.scrollTo({ top: 500, behavior: 'smooth' });
    }

    function userEnd(){
        updateRoute();
        removeDrawControl();
        alert("Your road has been submit for viewing")
        setInitMarker(finalCoords);
        setPoints(finalCoords.coordinates);
        scrollToBottom();
    }

    function setPoints(coords) {
        coordsStore.set(coords);
    }

    function setInitMarker(coords){
        initial = coords.coordinates[0];
        coordsInit.set(initial);
    }

    // If the user clicks the delete draw button, remove the layer if it exists
    function removeRoute() {
        if (!map.getSource('route')) return;
        map.removeLayer('route');
        map.removeSource('route');
    }

    function updateRoute() {
        // Overwrite any existing layers
        removeRoute(); 
            
        // Set the profile
        const profile = 'driving'; 
            
        // Get the coordinates
        const data = draw.getAll();
        const lastFeature = data.features.length - 1;
        const coords = data.features[lastFeature].geometry.coordinates;

        // Format the coordinates
        const newCoords = coords.join(';');
        // Set the radius for each coordinate pair to 25 meters
        const radius = coords.map(() => 10);
        getMatch(newCoords, radius, profile);
    }

    // Make a Map Matching request
    async function getMatch(coordinates, radius, profile) {
    // Separate the radiuses with semicolons
    const radiuses = radius.join(';');
    // Create the query
    const query = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&tidy=true&access_token=${mapbox.accessToken}`,
        { method: 'GET' }
    );
    const response = await query.json();
    // Handle errors
    if (response.code !== 'Ok') {
        submitErr = true;
        return;
        }
        const coords = response.matchings[0].geometry;
        finalCoords = coords;
        // Draw the route on the map
        addRoute(coords);
    }
    // Draw the Map Matching route as a new layer on the map
    function addRoute(coords) {
    // If a route is already loaded, remove it
    if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
    } else {
        map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': {
        'type': 'geojson',
        'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': coords
        }
    },
    'layout': {
    'line-join': 'round',
    'line-cap': 'round'
    },
    'paint': {
    'line-color': '#6D9DC5',
    // Adjust with height
    'line-width': 10,
    'line-opacity': 1 
    }
    });
    }
    }

    function removeDrawControl() {
        if (map && draw) {
            draw.deleteAll(); // Remove all the drawn features from the map
            map.off('draw.create', updateRoute);
            map.off('draw.update', updateRoute);
            map.removeControl(draw);
            draw = null; // Reset the draw variable to null to indicate it's been removed
        }
    }



    function Edit(){
        removeDrawControl();
        removeRoute();


        // @ts-ignore
        draw = new MapboxDraw({
        // Instead of showing all the draw tools, show only the line string and delete tools.
        displayControlsDefault: false,
        controls: {
            line_string: true,
            trash: true
        },
        // Set the draw mode to draw LineStrings by default.
        defaultMode: 'draw_line_string',
        styles: [
            // Set the line style for the user-input coordinates.
            {
            id: 'gl-draw-line',
            type: 'line',
            filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#438EE4',
                'line-dasharray': [0.2, 2],
                'line-width': 4,
                'line-opacity': 0.7
            }
            },
            // Style the vertex point halos.
            {
            id: 'gl-draw-polygon-and-line-vertex-halo-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            paint: {
                'circle-radius': 12,
                'circle-color': '#FFF'
            }
            },
            // Style the vertex points.
            {
            id: 'gl-draw-polygon-and-line-vertex-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            paint: {
                'circle-radius': 8,
                'circle-color': '#438EE4'
            }
            }
        ]
        });

        // Add the draw tool to the map.
        map.addControl(draw);

        // Add create, update, or delete actions
        map.on('draw.create', updateRoute);
        map.on('draw.update', updateRoute);
        map.on('draw.delete', removeRoute);
    }

    
</script>

<div class="absolute top-10 right-0 mx-[0.8vw] my-2">
    <button onclick="my_modal_1.showModal()" class="tooltip tooltip-left" data-tip="Need help?">
        <dialog id="my_modal_1" class="modal ">
            <form method="dialog" class="modal-box m-11/12 max-w-5xl">
              <h3 class="font-bold text-lg">Need help?</h3>
              <p class="py-4"></p>
              <div class="overflow-x-auto">
                <table class="table">
                  <!-- head -->
                  <tbody>
                    <!-- row 1 -->
                    <tr>
                      <th>Draw route</th>
                      <td class="overflow-auto break-words whitespace-normal">
                        <div class="text-sm breadcrumbs">
                            <ul>
                              <li>Click create</li> 
                              <li>Add route</li> 
                              <li>Zoom to the road you want to draw and trace the road. Points can have a healthy space between them.</li>
                            </ul>
                          </div>
                      </td>
                    </tr>
                    <!-- row 2 -->
                    <tr>
                      <th>Route not filling in?</th>
                      <td>If your route isn't filling in, check the spacing between points and if the points are on a road.</td>
                    </tr>
                    <!-- row 3 -->
                    <tr>
                      <th>More help?</th>
                      <td> Please contact us, and describe your problem.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="modal-action">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
              </div>
            </form>
          </dialog>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="25px" height="25px" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
    </button>
</div>

<div class="absolute bottom-10 right-0 p-4">
    <div class="dropdown dropdown-top dropdown-end ">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn- m-1 w-[20vw] border-none bg-accent hover:bg-blue-500 text-base-100">Create</label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-[20vw] flex flex-col items-center">
        <li>
          <button class="btn btn-success m-1 w-[15vw]" on:click={Edit}>
            <!-- Adding the 'text-center' class to center the text horizontally -->
            <span class="text-center md:translate-y-1/2">Add route</span>
          </button>
        </li>
        <li>
          <button class="btn btn-error m-1 w-[15vw]" on:click={userEnd}>
            <!-- Adding the 'text-center' class to center the text horizontally -->
            <span class="text-center md:translate-y-1/2">End route</span>
          </button>
        </li>
      </ul>
    </div>
  </div>