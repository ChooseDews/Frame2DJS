<template>
  <div class="pointsHolder">
    <div class="title center">Points ({{points.length}})</div>
    <div v-for="(p, index) in points" class="coord">
      {{index}} (<input type="number" @change="updatePoint(index, p[0], p[1])" v-model="p[0]" />,<input type="number" @change="updatePoint(index, p[0], p[1])" v-model="p[1]" />)<span
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

      <div class="title center">Connections ({{connections.length}}) <a class="pure-button button-small" @click="clearConnections()" href="#">Clear</a></div>


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

      <div class="title center">Forces ({{forces.length}})  <a class="pure-button button-small" @click="clearForces()" href="#">Clear</a></div>

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
    <div class="addForce">
      <br>
      <div class="title">Add Force</div>
      <select v-model="newForce.node">
        <option v-for="(point, index) in points" :value="index">{{index}}</option>
      </select>
    <select v-model="newForce.type">
      <option>Fixed X</option>
      <option>Fixed Y</option>
      <option>Moment</option>
      <option>Force</option>
    </select>
    <input v-model="newForce.x" placeholder="X Force" />
    <input v-model="newForce.y" placeholder="Y Force"/><span type="number" @click="addForce()"
        class="material-icons">
        add_circle
      </span>
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
        add: {},
        newForce: {}
      };
    },
    mounted() {
      let self = this;
      FiniteModel.addSubscriber(function (p, c, f) {
        self.points = JSON.parse(JSON.stringify(p));
        self.connections = c;
        self.forces = f;

        console.log('forceu updaetr')

        self.$forceUpdate()
      })
    },
    methods: {
      clearConnections(){
        FiniteModel.clearConnections()
      },
       clearForces(){
        FiniteModel.clearForces()
      },
      addPoint() {
        let point = [Number(this.add.x), Number(this.add.y)];
        if (isNaN(point[0]) || isNaN(point[1])) return;
        this.points.push(point)
      },
      addForce(){
        if(!isNaN(Number(this.newForce.node))){
        FiniteModel.addForce(Number(this.newForce.node),Number(this.newForce.x) || 0, Number(this.newForce.y) || 0,this.newForce.type)
        this.newForce = {};
        }
        
      },
      remove(index) {
        if (this.points.length == 0) return;
        this.points.splice(index, 1)
      },
      updatePoint(index, x, y){
          FiniteModel.movePoint(index, [Number(x), Number(y)])

      }
    }
  }
</script>

<style lang="scss" scoped>



  .pointsHolder {

    width: 100%;

    .title {
      font-size: 20px;
      padding-bottom: 20px;

    }

        .button-small {
            font-size: 65%;
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




.addForce{
  text-align: center;
  input{
    width: 60px;
  }

}
</style>
