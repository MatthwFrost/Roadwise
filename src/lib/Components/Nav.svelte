<script>
    import { user, auth } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { userData } from "$lib/firebase";
</script>


<div class="navbar bg-background z-auto align-middle">
  <div class="navbar-start ">

      <a class="normal-case text-[40px]  px-1 font-lato font-bold flex py-auto" href="/">
          <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="my-auto">
          <path d="M8.57385 20.3523L11.9553 13.5894C11.9737 13.5526 12.0263 13.5526 12.0447 13.5894L15.4261 20.3523C15.4483 20.3965 15.3996 20.4426 15.3566 20.4181L12.0248 18.5142C12.0094 18.5054 11.9906 18.5054 11.9752 18.5142L8.64338 20.4181C8.60043 20.4426 8.55173 20.3965 8.57385 20.3523Z" stroke="#3A435E" stroke-linecap="round"/>
          <path d="M20.5 18.5L16.5 3.5" stroke="#3A435E" stroke-linecap="round"/>
          <path d="M3.5 18.5L7.5 3.5" stroke="#3A435E" stroke-linecap="round"/>
          <path d="M12 10.5V8.5" stroke="#3A435E" stroke-linecap="round"/>
          <path d="M12 5.5V3.5" stroke="#3A435E" stroke-linecap="round"/>
          </svg>
          <h1 class="text-base-100">
            Roadwise
          </h1>
      </a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal ">
        <!-- <summary><Search /></summary> -->
    </ul>
  </div>
  <div class="navbar-end">
    <div class="flex-none">
      <ul class="menu menu-horizontal px-10 text-[15px]">
      {#if $user}
          <li class="m-1"> 
            <a role="button" class="btn btn-primary text-[0.9rem]  w-[10vw]" href="/contribute" data-sveltekit-reload><h1 class="translate-y-1/2">Create Route</h1></a>
          </li>
          <li class="my-auto bg-background">
            <details>
              <summary class="">
                Profile
              </summary>
              <ul class="p-2 ">
                <li>
                  <a href="/{$userData?.username}" data-sveltekit-reload class="">Profile</a>
                </li>
                <li><a href="/contribute" data-sveltekit-reload class="">Add route</a></li>
                <li><a href="/profile" class="">Your routes</a></li>
                <li></li>
                <li>
                  <a href="/" on:click={() => (signOut(auth))}>
                  <span class="">Sign Out</span>
                  </a>
              </li>
              </ul>
            </details>
          </li>
        {:else}
          <li><a href="/login" class=" ">Login</a></li>
        {/if}
      </ul>
    </div>
  </div>
</div>
<div class="m-0 divider"></div>