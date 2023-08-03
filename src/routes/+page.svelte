<script>
    import { onMount } from 'svelte';
    import CardContainer from '$lib/Components/CardContainer.svelte';
    import Nav from "$lib/Components/Nav.svelte";
    import RateTable from '$lib/Components/RateTable.svelte';
    import { userLoc } from '$lib/store';
    import NearPoints from '$lib/Components/NearPoints.svelte';
    import Footer from '$lib/Components/Footer.svelte'
  import HomeButtonGroup from '../lib/Components/HomeButtonGroup.svelte';

  let lat;
  let lng;

  onMount(() => {
  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude; 
          userLoc.set({lat, lng}); 
      }, function(error) {
          console.log("Error occurred. Error code: " + error.code);
      });
  } else {
      console.log("Geolocation is not supported by this browser.");
  }
    
  })
</script>

<Nav />
<CardContainer />
<HomeButtonGroup />
<NearPoints lat={lat ? lat : 51.5072} lon={lng ? lng : 0.1276} />
<RateTable />
<Footer />
