// App.vue

<template>

    <div>

        <div id="draw">
<div class="pure-g">
    <div class="pure-u-1-2">            [Middle Mouse] Add Node  <br> [Left Click]  Move Node   <br>  [Right Click] Make Segment
</div>
    <div class="pure-u-1-2" align="right"><img class="coordSys" src="./coordinate_sys.svg" alt=""></div>
</div>
        </div>
    </div>


</template>

<script>
    import * as PIXI from 'pixi.js'

    import FiniteModel from './../DataModel.js';



    export default {
        data() {
            return {
                scaler: 10,
                app: {},
                points: FiniteModel.getPoints(),
                forces: FiniteModel.getForces(),
                connections: FiniteModel.getConnections(),
                dragging: false
            };
        },
        mounted() {
            this.start();
            let self = this;
            setTimeout(function () {
                self.clear();
                self.update();
            }, 100)
            FiniteModel.addSubscriber(function (p, c, f) {
                self.points = p;
                self.connections = c;
                self.forces = f;

                self.$forceUpdate()
            })
        },
        methods: {
            clear() {
                let stage = this.app.stage;
                for (var i = stage.children.length - 1; i >= 0; i--) {
                    stage.removeChild(stage.children[i]);
                };
            },
            update() {
                let id = 0;
                for (let p of this.points) {
                    this.createnodeHandler(p[0], p[1], id)
                    id++;
                }
                for (let c of this.connections) {
                    this.drawSegment(c[0], c[1])
                    id++;
                }

                this.drawForces()
                this.drawLabels();

            },
            addPoint(x, y) {
                let point = [Number(x), Number(y)];
                if (isNaN(point[0]) || isNaN(point[1])) return;
                FiniteModel.addPoint(point)
            },
            start() {

                let self = this;


                this.app = new PIXI.Application({
                    backgroundColor: 0xFFFFFF
                });
                let app = this.app;

                let noContext = document.getElementById('draw');

                noContext.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    console.log(e)
                });

                function createnodeHandler(x, y, id) {
                    // create our little nodeHandler friend..
                    const nodeHandler = new PIXI.Graphics();
                    nodeHandler.lineStyle(
                    0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
                    nodeHandler.beginFill(0x000000, 1);
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
                    self.dragging = true;
                    this.dragging = true;
                }

                function onDragEnd() {
                    this.alpha = 1;
                    this.dragging = false;
                    self.dragging = false;

                    // set the interaction data to null
                    this.data = null;
                }

                function onDragMove() {
                    if (this.dragging) {
                        const newPosition = this.data.getLocalPosition(this.parent);
                        this.x = newPosition.x;
                        this.y = newPosition.y;
                        FiniteModel.movePoint(this.id, [this.x, this.y])
                    }
                }

                let LSP = [];

                function rightclick(event) {
                    console.log('right click', event, this.id)
                    LSP.push(this.id)
                    console.log(LSP)
                    if (LSP.length == 2) {
                        if (LSP[0] != LSP[1]) FiniteModel.addConnection(...LSP)
                        LSP = [];
                    }

                }

                function drawSegment(node1, node2) {
                    let p1 = self.points[node1];
                    let p2 = self.points[node2];
                    const lineSegment = new PIXI.Graphics()
                    lineSegment.lineStyle(2, 0xff0000, 1)
                    lineSegment.moveTo(p1[0], p1[1])
                    lineSegment.lineTo(p2[0], p2[1])
                    app.stage.addChild(lineSegment);

                }

                function drawLabels(){

                    for(let i in self.points){
                        let p1 = self.points[i];

                        let text = new PIXI.Text(i,{fontFamily : 'Arial', fontSize: 20, fill : 0x000000, align : 'center'});

                        text.x = p1[0]+10;
                        text.y = p1[1]+10;
                                            app.stage.addChild(text);

                    
                    }
                }

                function drawForces() {
                    const forcesGraphics = new PIXI.Graphics();

                    for (let force of self.forces) {
                        let p1 = self.points[force[0]]
                        if (force[3] == 'Fixed X') {

                            forcesGraphics.lineStyle(
                            0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
                            forcesGraphics.beginFill(0x002DF5, 1);
                            forcesGraphics.drawRect(p1[0], p1[1], 25, 5);
                            forcesGraphics.endFill();

                        } else if (force[3] == 'Fixed Y') {
                            forcesGraphics.lineStyle(
                            0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
                            forcesGraphics.beginFill(0xA832A4, 1);
                            forcesGraphics.drawRect(p1[0], p1[1], 5, 25);
                            forcesGraphics.endFill();

                        } else if (force[3] == 'Moment') {

                            forcesGraphics.lineStyle(
                            0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
                            forcesGraphics.beginFill(0x00FF00, 1);
                            forcesGraphics.drawCircle(p1[0], p1[1], 5);
                            forcesGraphics.endFill();


                        } else {
                            let a = force[1];
                            let b = force[2];
                            let scale = 1 / Math.sqrt(a * a + b * b);
                            let p2 = [p1[0] + a * scale * 100, p1[1] + b * scale * 100]

                            const lineSegment = new PIXI.Graphics()
                            lineSegment.lineStyle(4, 0xff890a, 1)
                            lineSegment.moveTo(p1[0], p1[1])
                            lineSegment.lineTo(p2[0], p2[1])
                            app.stage.addChild(lineSegment);

                        }
                    }
                    app.stage.addChild(forcesGraphics);

                }

                self.drawSegment = drawSegment;
                self.drawForces = drawForces;
                self.drawLabels = drawLabels;


                // The application will create a canvas element for you that you
                // can then insert into the DOM.
                document.getElementById("draw").prepend(app.view);
                this.createnodeHandler = createnodeHandler;
                app.renderer.plugins.interaction.on('mouseup', onClick);
                app.renderer.plugins.interaction.on('rightclick', rightclick);

                function onClick(event) {
                    if (event.data.button == 4) return
                    if (event.data.originalEvent.button == 1) {
                        console.log(event.data.global.y)
                        createnodeHandler(event.data.global.x, event.data.global.y)
                        self.addPoint(event.data.global.x, event.data.global.y)
                    }

                }

                window.setInterval(() => {
                    if (self.dragging) return
                    self.clear();
                    self.update();
                }, 500);

            }
        },
        watch: {

        }
    }
</script>


<style lang="scss" scoped>
    #draw {
        width: 800px;
        border: solid grey 1px;
        margin: 20px;
        padding: 5px;
        background: white;

    }
    .coordSys{
        height: 80px;
        text-align: right;
    }
</style>
