<template>
    <div>
      <input
        id="honorform"
        @keyup="$emit('search-query', $event.target.value)"
        type="text"
        placeholder="Search. . . "
      />
    </div>
  </template>
  
  <script>
  export default {
    name: "HonorSearchComponent",
  };
  </script>