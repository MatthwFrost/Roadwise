<script context="module">
    export function preload({ params, query }) {
      // the `code` parameter is available because
      // this file is called _error.svelte
      return { code: params.code };
    }
    export let code;
  </script>
  
  <h1>Error {code}</h1>
  <p>Sorry, we couldn't find what you were looking for.</p>