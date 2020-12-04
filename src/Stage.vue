// App.vue

<template>

  <div>
      {{points}}
    <div id="draw">
            [Middle Mouse] Move Points [Left Click] Add Node [Right Click] Make Segment

    </div>
  </div>


</template>

<script>




import * as PIXI from 'pixi.js'




export default {
    props: ['points'],

  data() {
    return {
      bundler: "Parcel bro",
      scaler: 10,
      app: {}
    };
  },
  mounted(){
   this.start();
   let self = this;
   setTimeout(function(){
       self.clear();
       self.update();
   },100)
  },
  watch: {
    points(){
        console.log('something poitns...')
        this.update()
    }
  },
  methods:{
    clear(){
        let stage = this.app.stage;
        for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
    },
    update(){
        let id = 0;
        for(let p of this.points){
            id++
            this.createnodeHandler(p[0], p[1], id)
        }

    },
    addPoint(x,y){
          let point = [Number(x), Number(y)];
          if( isNaN(point[0]) || isNaN(point[1])) return;
          this.points.push(point)
    },
    start(){

        let self = this;


        this.app = new PIXI.Application({ backgroundColor: 0x1099bb });
        let app = this.app;

        let noContext = document.getElementById('draw');

        noContext.addEventListener('contextmenu', e => {
            e.preventDefault();
            console.log(e)
        });

        function createnodeHandler(x, y, id) {
        // create our little nodeHandler friend..
        const nodeHandler = new PIXI.Graphics();
        nodeHandler.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        nodeHandler.beginFill(0xDE3249, 1);
        nodeHandler.drawCircle(0, 0, 10);
        nodeHandler.endFill();
        nodeHandler.id = id
        nodeHandler.interactive = true;
        nodeHandler.buttonMode = true;

        nodeHandler
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove)
            .on('rightclick', rightclick);
        nodeHandler.x = x;
        nodeHandler.y = y;
        // add it to the stage
        app.stage.addChild(nodeHandler);
    }

        function onDragStart(event) {
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        }
        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
        }

        function onDragMove() {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
        }

        let lineSegmentPoints = [];
        function rightclick(event){
            console.log('right click', event, this.id)
            lineSegmentPoints.push([this.x,this.y,this.id])
            console.log(lineSegmentPoints)
            if(lineSegmentPoints.length == 2) drawSegment();

        }
        function drawSegment(){
            let p1 = lineSegmentPoints[0];
            let p2 = lineSegmentPoints[1];
            const lineSegment = new PIXI.Graphics()
            lineSegment.lineStyle(1, 0xff0000, 1)
            lineSegment.moveTo(p1[0], p1[1])
            lineSegment.lineTo(p2[0], p2[1])
            lineSegmentPoints = [];
                    app.stage.addChild(lineSegment);

        }



        // The application will create a canvas element for you that you
        // can then insert into the DOM.
        document.getElementById("draw").prepend(app.view);
        this.createnodeHandler = createnodeHandler;
        app.renderer.plugins.interaction.on('mouseup', onClick);
        app.renderer.plugins.interaction.on('rightclick', rightclick);
        function onClick (event) {
              if(event.data.originalEvent.button==1) return
              if(event.data.button == 4) return
                console.log(event.data.global.y)
                createnodeHandler(event.data.global.x,event.data.global.y)
                self.addPoint(event.data.global.x,event.data.global.y)

        }

        window.setInterval(() => {

            this.clear();
            this.update();
        }, 1000);
        
    }
  },
  watch: {
     
  }
}


</script>


<style lang="scss" scoped>

#draw{
width: 800px;
border: solid grey 1px;
margin: 20px;
background: white;

}



</style>
