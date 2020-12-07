// App.vue

<template>
  <div>
  <div class="sidebar">
        <Points></Points>
  </div>
  <div style="float: left; width: calc(100% - 350px)">
            <Stage></Stage>

            <Results></Results>

  </div>
  </div>

</template>

<script>
import Points from "./Points";
import Stage from "./Stage";
import Results from "./Results";

export default {
  data() {
    return {
     
    };
  },
  components: {Points, Stage, Results}
}

</script>

