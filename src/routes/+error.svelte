<script>
    import { page } from '$app/stores';
  import Nav from '../lib/Components/Nav.svelte';
</script>

<Nav />
<div class=" flex flex-col justify-center w-full min-h-screen text-center my-[25vh]">
    <div>
        <h1 class="p-5 text-[40px]"><b>{$page.status}</b>: {$page.error.message}</h1>
        <h1>Sorry, we couldn't find what you are looking for...</h1>
        <a href="/" class="bg-error btn btn-success w-[20vw]">Return to the home page?</a>
    </div>
</div>
