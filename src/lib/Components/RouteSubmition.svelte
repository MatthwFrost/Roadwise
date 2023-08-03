<script>
    import AuthCheck from "./AuthCheck.svelte";
    import { coordsInit, coordsStore } from '../store.js'; // Import the coordsStore
    import { user, storage, db, geofirestore } from "$lib/firebase";
    import { doc, updateDoc ,writeBatch, GeoPoint, setDoc, collection} from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes} from "firebase/storage";
    import firebase from 'firebase/compat/app';
	import 'firebase/compat/firestore';
    import confetti from 'canvas-confetti';

    let index = 0; 
    let title = null;
    let desc = null;
    let previewURL = null;
    let uploading = false;
    let previewArr = [];
    let photoUrls = [];
    let hash = "96js49901"
    let routeCoords;
    let rating = 25;

    

    // Create a reactive statement to access the current value of coords
    let initMarker;
    let lng;
    let lat;
    let CoordsList;
    let initMarkerGeoPoint
    let initGeoPoint
    let initCoords;
    let uid;



    $: {
        routeCoords = $coordsStore;
    } 

    function generateUID() {
        // I generate the UID from two parts here 
        // to ensure the random number provide enough bits.
        let firstPart = (Math.random() * 46656) | 0;
        let secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        uid = firstPart + secondPart;
    }


    function celebrate() {
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0 }
        });
    }

    function data(){
        CoordsList = routeCoords.map(
            coords => new GeoPoint(coords[1], coords[0])
        );

        initMarker = routeCoords[0];
        initCoords = new GeoPoint(initMarker[1], initMarker[0]);
    }

    generateUID();
    async function upload(e) {
        const maxSize = 1e+9;

        index = index + 1;
        uploading = true;
        const file = e.target.files[0];

        // check file size
        if (file.size > maxSize) {
            alert('File is too large. Please select a file smaller than 5 MB.');
            uploading = false;
            return;
        }

        previewURL = URL.createObjectURL(file);

        const storageRef = ref(storage, `routeImages/${uid}/Image_${index}.png`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);

        uploading = false;

        photoUrls = [...photoUrls, url]
        previewArr = [...previewArr, previewURL];
    }

    async function uploadRoute() {
        data();

        let finalrating = rating / 10;
        const routes = collection(db, 'routes');
        const routeDoc = doc(routes);

        setDoc(routeDoc, {
            title: title,
            desc: desc,
            photoUrls: [
                ...photoUrls
            ],
            routeCoords: CoordsList,
            rating: finalrating,
            userId: $user.uid,
        })
        .then(() => {
            const geocollection = geofirestore.collection('geolocation');
            return geocollection.add({
                locationRef: routeDoc.id,
                name: title,
                score: 100,
                // The coordinates field must be a GeoPoint!
                coordinates: initCoords
            });
        })
        .then(() => {
            celebrate();
        })
        .catch(error => {
            console.log("Error writing documents: ", error);
        });
    }

</script>


<AuthCheck>
<div class="flex flex-col items-center justify-center rounded-xl border mx-auto w-[25vw] p-5">
<h1>Route Details</h1>
<div class="flex flex-col items-center w-[20vw]">
    <div>
        <div class="form-control">
            <label class="label" for='title'>
                <span class="label-text text-[15px] text-neutral">Name your route</span>
            </label>
            <input type="text" id='title' name='title' placeholder="Type here" class="input input-bordered w-full bg-gray-300 text-neutral" bind:value={title}/>
        </div>
        <div class="divider"></div>
        <div class="form-control">
            <label class="label" for="desc">
                <span class="label-text text-[15px] ">Description</span>
            </label>
            <textarea id="desc" name="desc" class="textarea textarea-bordered h-24 w-full bg-gray-300 text-neutral" placeholder="Describe your route" bind:value={desc}></textarea>
        </div>
        <div class="divider"></div>
        <label for="Rating" class="label">Rate your drive</label>
        <input id='Rating' name="Rating" type="range" step="none" min="0" max="50" bind:value={rating} on:change={() => console.log(rating / 10)} class="range range-accent" />
        <p class="text-center text-[20px] {rating> 25 ? 'text-success' : 'text-secondary'} ">{rating / 10} ⭐️</p>
        <div class="divider"></div>
        <div class="form-control text-center">
            <label for="photoURL" class="label" alt="photoUrl">
                <span class="label-text">Upload your pictures</span>
            </label>
            <input
            on:change={upload}
            name="photoURL"
            type="file"
            class="file-input file-input-bordered w-full max-w-xs "
            accept="image/png, image/jpeg, image/gif, image/webp"
            />
        </div>
        <div class="carousel rounded-box p-10 w-full snap-none">
            <div class="divider divider-horizontal"></div>
            {#if previewArr.length > 0}
                {#each previewArr as purl}
                    <div class="carousel-item m-1 ">
                        <img
                            src={purl}
                            alt="photoURL"
                            class="mx-auto "
                        />
                    </div>
                {/each}
            {:else}
                <p class=" ">No images uploaded yet.</p>
            {/if}
            <div class="divider divider-horizontal"></div>
        </div>
    </div>
    {#if title && desc && rating && previewArr}
        <button on:click={uploadRoute} class="btn btn-primary w-[20vw]" onclick="successModal.showModal()">Submit</button>
        <dialog id="successModal"class="modal">
        <form method="dialog" class="modal-box">
            <h3 class="font-bold text-lg">Your route has been submited!</h3>
            <p class="py-4">Press ESC key or click the button below to close</p>
            <div class="modal-action">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
            </div>
        </form>
        </dialog>
    {:else}
        <button class="btn btn-disabled w-[20vw]" tabindex="-1" aria-disabled="true">Submit</button>

    {/if}
</div>
</AuthCheck>
