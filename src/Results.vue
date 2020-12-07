<template>
  <div class="resultsHolder">

      <div class="title center" @click="run()">FEM Results <a class="pure-button button-small" @click="run()" href="#">Run Simulation</a></div>

      <table class="center pure-table" v-if="results.solution">
         <tr>
          <th>N</th>
          <td  v-for="(c, index) in points">{{index}}</td>
        </tr>
        <tr>
          <th>u</th>
          <td  v-for="(c, index) in points">{{results.solution[3*index].toExponential(4)}}</td>
        </tr>
        <tr>
          <th>v</th>
          <td  v-for="(c, index) in points">{{results.solution[3*index+1].toExponential(4)}}</td>
        </tr>
         <tr>
          <th>θ</th>
          <td  v-for="(c, index) in points">{{results.solution[3*index+2].toExponential(4)}}</td>
        </tr>



        <tr>
          <th>F_x</th>
          <td  v-for="(c, index) in points">{{results.reactions[3*index].toFixed(3)}}</td>
        </tr>

        <tr>
          <th>F_y</th>
          <td  v-for="(c, index) in points">{{results.reactions[3*index+1].toFixed(3)}}</td>
        </tr>

        <tr>
          <th>C</th>
          <td  v-for="(c, index) in points">{{results.reactions[3*index+2].toFixed(3)}}</td>
        </tr>
     
      </table>
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

    .title {
      font-size: 20px;
      padding-bottom: 20px;

    }

    tr td{
      width: 140px;
      border: solid 1px grey;
      margin: 0;

    }
    tr th{
      width: 40px;
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
