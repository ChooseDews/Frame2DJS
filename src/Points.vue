<template>
  <div class="pointsHolder">
    <div class="title center">Points ({{points.length}})</div>
    <div v-for="(p, index) in points" class="coord">
      {{index}} (<input type="number" v-model="p[0]" />,<input type="number" v-model="p[1]" />)<span
        @click="remove(index)" class="material-icons">
        delete
      </span>
    </div>
    <br>
    <div class="coord">
      New (<input type="number" v-model="add.x" />,<input v-model="add.y" />)<span type="number" @click="addPoint()"
        class="material-icons">
        add_circle
      </span>

      <br>
      <br>
      <hr>
      <br>

      <div class="title center">Connections ({{connections.length}})</div>


      <table style="width:100%" class="center">
        <tr>
          <th>ID</th>
          <th>N1</th>
          <th>N2</th>
          <th>Angle</th>
          <th>Length</th>
        </tr>
        <tr v-for="(c, index) in connections">
          <td>{{index}}</td>
          <td>{{c[0]}}</td>
          <td>{{c[1]}}</td>
          <td>{{(c[2]).toFixed(2)}}</td>
          <td>{{(c[3]).toFixed(2)}}</td>
        </tr>
      </table>

      <hr>
      <br>

      <div class="title center">Forces ({{forces.length}})</div>

      <table style="width:100%" class="center">
        <tr>
          <th>ID</th>
          <th>N</th>
          <th>X</th>
          <th>Y</th>
          <th>Type</th>
        </tr>
        <tr v-for="(c, index) in forces">
          <td>{{index}}</td>
          <td>{{c[0]}}</td>
          <td>{{c[1]}}</td>
          <td>{{(c[2])}}</td>
          <td>{{(c[3])}}</td>
        </tr>
      </table>
    </div>

</template>

<script>
  import Vue from "vue";

  import FiniteModel from './../model';

  export default {
    data() {
      return {
        bundler: "Parcel bro",
        pointCount: 20,
        points: FiniteModel.getPoints(),
        connections: FiniteModel.getConnections(),
        forces: FiniteModel.getForces(),

        add: {}
      };
    },
    mounted() {
      let self = this;
      FiniteModel.addSubscriber(function (p, c, f) {
        self.points = p;
        self.connections = c;
        self.forces = f;

        console.log('forceu updaetr')

        self.$forceUpdate()
      })
    },
    methods: {
      addPoint() {
        let point = [Number(this.add.x), Number(this.add.y)];
        if (isNaN(point[0]) || isNaN(point[1])) return;
        this.points.push(point)
      },
      remove(index) {
        if (this.points.length == 0) return;
        this.points.splice(index, 1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pointsHolder {

    width: 100%;
    background: grey;

    .title {
      font-size: 20px;
      padding-bottom: 20px;

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
