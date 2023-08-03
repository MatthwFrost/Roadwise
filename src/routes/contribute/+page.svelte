<script>
    import Map from "../../lib/Components/Map.svelte";
    import EditMap from "../../lib/Components/EditMap.svelte";
    import Nav from "$lib/Components/Nav.svelte";
    import RouteSubmition from "../../lib/Components/RouteSubmition.svelte";
    import { userLoc } from "../../lib/store";
    import Footer from '$lib/Components/Footer.svelte'


  let lat = null;
  let lng = null;
  const defLat = 51.5072;
  const defLng = 0.1276;
  let coords;

  $: {
    coords = $userLoc; 
  }
  console.log(coords);

</script>


<Nav />
<!-- solution but very slow -->
<!-- <Map lat={lat ? lat : defLat} lon={lng ? lng : defLng} zoom={11}>
    <EditMap />
</Map>
<div class="flex items-center justify-center my-5">
  <div class="flex w-[40vw] justify-center items-center text-center mx-0">
      <div class="grid card rounded-box place-items-center mx-0">
          <img src="src/static/findLoc.png" alt="Find my location" width="30" height="30">
      </div>
      <div class="divider divider-horizontal mx-0"></div>
      <div class="grid card rounded-box place-items-center m-0">
         <h3 class="text-[15px] text-neutral">Find your location.</h3> 
      </div>
  </div>
</div>

<RouteSubmition /> -->

<div class="stats shadow ">
  <div class="stat w-[35vw]">
    <RouteSubmition />
  </div>
  
  <div class="stat justify-start">
    <Map lat={lat ? lat : defLat} lon={lng ? lng : defLng} zoom={11}>
      <EditMap />
    </Map>
  </div>
</div>

<Footer />

