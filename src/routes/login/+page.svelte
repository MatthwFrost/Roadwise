<script>
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
    import { userData, auth } from "$lib/firebase";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        user = await signInWithPopup(auth, provider);
    }
</script>



{#if $userData}
    {#if $userData?.username}
        <h1>You are all set</h1>
        <a href="/{userData?.username}">Return to home page</a>
    {:else}
        <h2 class="card-title">Welcome, {$userData.username}</h2>
        <p class="text-center text-success">You are logged in</p>
        <a href="/login/username" role="button" class="btn btn-danger">Next step</a>
    {/if}
{:else}
    <button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}

