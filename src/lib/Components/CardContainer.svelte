<script>
    import Card from './Card.svelte'
    // Fetch data and store it in 'cardsData' (assuming an array of objects with title, content, and imageUrl)
    let cardsData = [
    { title: 'Crazy cool road near you', content: 'Located in swansea', image: 'src/static/road.jpeg'},
    { title: 'Crazy cool road near you', content: 'Located in swansea', image: 'src/static/road.jpeg'},
    { title: 'Crazy cool road near you', content: 'Located in swansea', image: 'src/static/road.jpeg'},
    // { title: 'this card will have cool content', content: 'Slay pictures and reviews'},
    // { title: 'Most intersting cards in the world', content: 'You really want to go on this drive'},
    // { title: 'Most intersting cards in the world', content: 'You really want to go on this drive'},
    // { title: 'Most intersting cards in the world', content: 'You really want to go on this drive'},
    // { title: 'Most intersting cards in the world', content: 'You really want to go on this drive'},
    // Add more cards data as needed
    ];
  </script>
  
<div class="carousel carousel-center max-w-[100vw] h-[500px] p-8 space-x-8 bg-accent my-10 snap-none bg-scroll">
  <div class="carousel-item p-4">
    {#each cardsData as card}
      <Card {...card}/>
    {/each}
  </div> 
</div>