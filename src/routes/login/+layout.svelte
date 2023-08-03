<script>
    import { page } from "$app/stores";
    import AnimatedRoute from "$lib/Components/AnimatedRoute.svelte";
    import Nav from "$lib/Components/Nav.svelte";
    import { userData } from "$lib/firebase";
    import Footer from '$lib/Components/Footer.svelte'

    // check if the logged in user has a username or not, render the rest if they dont.
</script>

<Nav />


{#if $userData?.username}
    <div>You are signed in</div>
  {:else}
  <nav class="flex justify-center my-6">
    <ul class="steps">
      <a href="/login" class="step step-primary">Sign In</a>
      <a
        href="/login/username"
        class="step"
        class:step-primary={$page.route.id?.match(/username|photo/g)}>
        Choose Username
      </a>
      <a
        href="/login/photo"
        class="step"
        class:step-primary={$page.route.id?.includes("photo")}>
        Upload Photo
      </a>
    </ul>
  </nav>
{/if}

<AnimatedRoute>
  <main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
      <div class="card-body items-center text-center">
      <slot />
      </div>
  </main>
</AnimatedRoute>
<Footer />