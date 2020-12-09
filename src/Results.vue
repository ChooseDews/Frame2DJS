<template>
  <div class="resultsHolder">

      <div class="title center" @click="run()">FEM Results <a class="pure-button button-small" @click="run()" href="#">Run Simulation</a></div>

   





<div class="resultOverflow">



 <table class="center pure-table" v-if="results.solution">
         <tr>
          <th>N</th>
          <th>u</th>
          <th>v</th>
          <th>θ</th>
          <th>F_x</th>
          <th>F_y</th>
          <th>C</th>

        </tr>
        <tr v-for="(c, index) in points">
          <td>{{index}}</td>
          <td>{{results.solution[3*index].toExponential(4)}}</td>
          <td>{{results.solution[3*index+1].toExponential(4)}}</td>
          <td>{{results.solution[3*index+2].toExponential(4)}}</td>

          <td>{{results.reactions[3*index].toFixed(4)}}</td>
          <td>{{results.reactions[3*index+1].toExponential(4)}}</td>
          <td>{{results.reactions[3*index+2].toExponential(4)}}</td>
        </tr>
        
     
      </table>

</div>






    </div>

</template>

<script>
  import Vue from "vue";

  import FiniteModel from './../DataModel.js';

  export default {
    data() {
    let pp = JSON.parse(JSON.stringify(FiniteModel.getPoints()))

    return {
        points: pp,
        connections: FiniteModel.getConnections(),
        forces: FiniteModel.getForces(),
        results: {}
      };
    },
    mounted() {
      let self = this;
      
      FiniteModel.addSubscriber(function (p, c, f) {
        self.points = p;
        self.connections = c;
        self.forces = f;
        self.$forceUpdate()
      })
    },
    methods: {
      run(){
        this.results = FiniteModel.runFEM()
        console.log(this.results.reactions)

      }

    }
  }
</script>

<style lang="scss" scoped>
  .resultsHolder {

    background: #292929;

    width: 100%;

    .resultOverflow{
      max-width: 100%;
      max-height: 100vh;
      overflow: auto;
    }

    .title {
      font-size: 20px;
      padding-bottom: 20px;

    }

    tr td{
      border: solid 1px grey;
      margin: 0;
      min-width: 100px;

    }
    tr th{
      width: 60px;
            border-bottom: solid 1px grey;

    }

   
   
    color: white;

    padding-top: 20px;

    input {
      width: 45px;
      padding: 5px;
      background: inherit;
      border: none;
      border-bottom: 1px solid white;
      text-align: center;
      color: white;
      font-size: 15px;
    }

    font-size: 15px;

    .coord {
      text-align: center;
      margin-top: 5px;

      .material-icons {
        font-size: 20px;
        line-height: 30px;
        vertical-align: top;

      }
    }

    .add {
      position: fixed;
      bottom: 0;
      width: 300px;
      padding-bottom: 30px;
    }


  }
</style>
