// App.vue

<template>
  <div>
  <div class="sidebar">
        <Points :points="pointsArray"></Points>
  </div>
  <div style="float: left; width: calc(100% - 300px)">
            <Stage :points="pointsArray"></Stage>

  </div>
  </div>

</template>

<script>
import Points from "./Points";
import Stage from "./Stage";

export default {
  data() {
    return {
      bundler: "Parcel bro",
      pointsArray: [[10,10],[10,50],[70,50],[70,30]]
    };
  },
  components: {Points, Stage}
}

</script>

