<script>
    export let title;
    export let content;
    export let image;
</script>


<div class="card card-compact w-100 h-[400px] bg-secondary shadow-md ml-5">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <figure><img src="{image}" alt="picture desibing the location of a card" class="w-[40vw] h-[50vh] rounded-md "/></figure>
    <div class="card-body rounded-box ">
      <div>
        <h2 class="card-title text-base-100">{title}</h2>
        <p class="text-base-100">{content}</p>
      </div>
        <p class="text-base-100">
          This is a staple of UK roads. Definetly worth exploring and enjoying this area.
        </p>
      <div class="items-baseline">
        <div class="card-actions justify-end">
            <button class="btn btn-primary text-secondary">Explore</button>
        </div>
        <div class="card-actions justify-start">
        </div>
      </div>
    </div>
  </div>